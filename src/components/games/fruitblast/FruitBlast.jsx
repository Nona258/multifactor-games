import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { UIContext } from '../../../store/UIContext';
import { GameOverModal } from '../../shared/GameOverModal';

const FRUIT_ICONS = ['🍎', '🍐', '🍊', '🍋', '🍉', '🍇', '🍓', '🫐', '🥝', '🥕', '🌽', '🍆', '🥦', '🫑'];

const BLOCK_THEMES = [
  'from-orange-300 to-amber-400 text-white',
  'from-emerald-300 to-green-500 text-white',
  'from-lime-300 to-emerald-400 text-emerald-950',
  'from-rose-300 to-pink-400 text-white',
  'from-yellow-300 to-orange-300 text-amber-950',
  'from-cyan-300 to-sky-400 text-white',
];

const DIFFICULTY_CONFIG = {
  easy: { boardSize: 8, label: 'Easy', pool: 'easy' },
  medium: { boardSize: 9, label: 'Medium', pool: 'medium' },
  hard: { boardSize: 10, label: 'Hard', pool: 'hard' },
};

const SHAPE_POOLS = {
  easy: [
    [[0, 0]],
    [[0, 0], [0, 1]],
    [[0, 0], [1, 0]],
    [[0, 0], [0, 1], [0, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 0], [0, 1], [1, 0], [1, 1]],
    [[0, 0], [1, 0], [1, 1]],
    [[0, 1], [1, 0], [1, 1]],
  ],
  medium: [
    [[0, 0]],
    [[0, 0], [0, 1]],
    [[0, 0], [1, 0]],
    [[0, 0], [0, 1], [0, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 0], [0, 1], [1, 0], [1, 1]],
    [[0, 0], [1, 0], [1, 1]],
    [[0, 1], [1, 0], [1, 1]],
    [[0, 0], [0, 1], [0, 2], [0, 3]],
    [[0, 0], [1, 0], [2, 0], [3, 0]],
    [[0, 1], [1, 0], [1, 1], [1, 2]],
    [[0, 0], [0, 1], [1, 1], [1, 2]],
  ],
  hard: [
    [[0, 0]],
    [[0, 0], [0, 1]],
    [[0, 0], [1, 0]],
    [[0, 0], [0, 1], [0, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 0], [0, 1], [1, 0], [1, 1]],
    [[0, 0], [1, 0], [1, 1]],
    [[0, 1], [1, 0], [1, 1]],
    [[0, 0], [0, 1], [0, 2], [0, 3]],
    [[0, 0], [1, 0], [2, 0], [3, 0]],
    [[0, 1], [1, 0], [1, 1], [1, 2]],
    [[0, 0], [0, 1], [1, 1], [1, 2]],
    [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
    [[0, 1], [1, 1], [2, 0], [2, 1], [2, 2]],
    [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
  ],
};

function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function cloneBoard(board) {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

function createBoard(boardSize) {
  return Array.from({ length: boardSize }, () => Array.from({ length: boardSize }, () => null));
}

function getBounds(cells) {
  return cells.reduce(
    (bounds, [row, col]) => ({
      minRow: Math.min(bounds.minRow, row),
      maxRow: Math.max(bounds.maxRow, row),
      minCol: Math.min(bounds.minCol, col),
      maxCol: Math.max(bounds.maxCol, col),
    }),
    { minRow: Infinity, maxRow: -Infinity, minCol: Infinity, maxCol: -Infinity }
  );
}

function createPiece(difficulty, index) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const pool = SHAPE_POOLS[config.pool] || SHAPE_POOLS.medium;
  const shape = randomChoice(pool);
  const bounds = getBounds(shape);
  const theme = randomChoice(BLOCK_THEMES);
  const icon = randomChoice(FRUIT_ICONS);

  return {
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    shape,
    bounds,
    icon,
    theme,
  };
}

function createHand(difficulty) {
  return Array.from({ length: 3 }, (_, index) => createPiece(difficulty, index));
}

function canPlacePiece(board, piece, anchorRow, anchorCol) {
  if (!piece) return false;

  return piece.shape.every(([offsetRow, offsetCol]) => {
    const row = anchorRow + offsetRow;
    const col = anchorCol + offsetCol;
    return row >= 0 && row < board.length && col >= 0 && col < board.length && !board[row][col];
  });
}

function applyPiece(board, piece, anchorRow, anchorCol) {
  const nextBoard = cloneBoard(board);

  piece.shape.forEach(([offsetRow, offsetCol]) => {
    const row = anchorRow + offsetRow;
    const col = anchorCol + offsetCol;
    nextBoard[row][col] = { icon: piece.icon, theme: piece.theme };
  });

  return nextBoard;
}

function clearCompletedLines(board) {
  const boardSize = board.length;
  const completedRows = [];
  const completedCols = [];

  for (let row = 0; row < boardSize; row += 1) {
    if (board[row].every(Boolean)) {
      completedRows.push(row);
    }
  }

  for (let col = 0; col < boardSize; col += 1) {
    let isComplete = true;

    for (let row = 0; row < boardSize; row += 1) {
      if (!board[row][col]) {
        isComplete = false;
        break;
      }
    }

    if (isComplete) {
      completedCols.push(col);
    }
  }

  if (completedRows.length === 0 && completedCols.length === 0) {
    return { completedRows, completedCols, clearedCells: 0 };
  }

  const rowSet = new Set(completedRows);
  const colSet = new Set(completedCols);
  let clearedCells = 0;

  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      if (rowSet.has(row) || colSet.has(col)) {
        if (board[row][col]) {
          clearedCells += 1;
        }
        board[row][col] = null;
      }
    }
  }

  return { completedRows, completedCols, clearedCells };
}

function getPlacedCells(piece, anchorRow, anchorCol) {
  if (!piece) return [];

  return piece.shape.map(([offsetRow, offsetCol]) => [anchorRow + offsetRow, anchorCol + offsetCol]);
}

function clampPlacementAnchor(piece, boardSize, anchorRow, anchorCol) {
  if (!piece) return { row: anchorRow, col: anchorCol };

  const minRow = -piece.bounds.minRow;
  const maxRow = boardSize - 1 - piece.bounds.maxRow;
  const minCol = -piece.bounds.minCol;
  const maxCol = boardSize - 1 - piece.bounds.maxCol;

  return {
    row: Math.min(Math.max(anchorRow, minRow), maxRow),
    col: Math.min(Math.max(anchorCol, minCol), maxCol),
  };
}

function hasAnyValidMove(board, hand) {
  return hand.some((piece) => {
    if (!piece) return false;
    const maxAnchorRow = board.length - piece.bounds.maxRow - 1;
    const maxAnchorCol = board.length - piece.bounds.maxCol - 1;

    for (let row = 0; row <= maxAnchorRow; row += 1) {
      for (let col = 0; col <= maxAnchorCol; col += 1) {
        if (canPlacePiece(board, piece, row, col)) {
          return true;
        }
      }
    }

    return false;
  });
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function getThemeClasses(theme) {
  return theme;
}

/**
 * Fruit Blast - block-placement puzzle with fruit and vegetable blocks.
 */
export function FruitBlast({ difficulty = 'medium' }) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const { setShowGameOverModal, setGameOverData } = useContext(UIContext);
  const gameOverHandledRef = useRef(false);
  const timerStartRef = useRef(null);
  const boardRef = useRef(null);

  const [board, setBoard] = useState(() => createBoard(config.boardSize));
  const [hand, setHand] = useState(() => createHand(difficulty));
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [hoverCell, setHoverCell] = useState(null);
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [clearedCellSet, setClearedCellSet] = useState(new Set());

  const selectedPiece = hand.find((piece) => piece.id === selectedPieceId) || null;

  const endGame = useCallback(
    (result) => {
      if (gameOverHandledRef.current) return;

      gameOverHandledRef.current = true;
      setGameState(result);
      setShowGameOverModal(true);
      setGameOverData({
        result,
        gameId: 'fruitblast',
        difficulty,
        time: seconds,
        score,
      });
    },
    [difficulty, score, seconds, setGameOverData, setShowGameOverModal]
  );

  const resetGame = useCallback(() => {
    setBoard(createBoard(config.boardSize));
    setHand(createHand(difficulty));
    setSelectedPieceId(null);
    setHoverCell(null);
    setGameState('idle');
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setSeconds(0);
    setClearedCellSet(new Set());
    timerStartRef.current = null;
    gameOverHandledRef.current = false;
    setShowGameOverModal(false);
    setGameOverData(null);
  }, [config.boardSize, difficulty, setGameOverData, setShowGameOverModal]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    if (gameState !== 'playing') {
      timerStartRef.current = null;
      return undefined;
    }

    if (!timerStartRef.current) {
      timerStartRef.current = Date.now();
    }

    const interval = window.setInterval(() => {
      setSeconds(Math.floor((Date.now() - timerStartRef.current) / 1000));
    }, 250);

    return () => window.clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (clearedCellSet.size === 0) return;

    const timeoutId = setTimeout(() => {
      setClearedCellSet(new Set());
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [clearedCellSet]);

  const ensureMoveExists = useCallback(
    (nextBoard, nextHand) => {
      if (!hasAnyValidMove(nextBoard, nextHand)) {
        endGame('lost');
      }
    },
    [endGame]
  );

  const handlePlacePiece = useCallback(
    (pieceId, anchorRow, anchorCol) => {
      if (gameOverHandledRef.current || gameState === 'lost') return;

      const piece = hand.find((entry) => entry.id === pieceId);
      if (!piece || !canPlacePiece(board, piece, anchorRow, anchorCol)) return;

      const nextBoard = applyPiece(board, piece, anchorRow, anchorCol);
      const { completedRows, completedCols, clearedCells } = clearCompletedLines(nextBoard);

      if (completedRows.length > 0 || completedCols.length > 0) {
        const rowSet = new Set(completedRows);
        const colSet = new Set(completedCols);
        const clearedSet = new Set();

        for (let row = 0; row < config.boardSize; row += 1) {
          for (let col = 0; col < config.boardSize; col += 1) {
            if (rowSet.has(row) || colSet.has(col)) {
              clearedSet.add(`${row}-${col}`);
            }
          }
        }

        setClearedCellSet(clearedSet);
      }

      const blocksPlacedScore = piece.shape.length * 10;
      const lineBonus = (completedRows.length + completedCols.length) * 120;
      const comboBonus = completedRows.length + completedCols.length > 0 ? combo * 50 : 0;
      const nextScore = score + blocksPlacedScore + lineBonus + comboBonus + clearedCells * 4;
      const nextCombo = completedRows.length + completedCols.length > 0 ? combo + 1 : 0;
      const nextBestCombo = Math.max(bestCombo, nextCombo);

      const remainingHand = hand.filter((entry) => entry.id !== pieceId);
      const nextHand = remainingHand.length > 0 ? remainingHand : createHand(difficulty);

      if (gameState === 'idle') {
        setGameState('playing');
      }

      if (!timerStartRef.current) {
        timerStartRef.current = Date.now();
      }

      setBoard(nextBoard);
      setHand(nextHand);
      setSelectedPieceId(null);
      setHoverCell(null);
      setScore(nextScore);
      setCombo(nextCombo);
      setBestCombo(nextBestCombo);

      ensureMoveExists(nextBoard, nextHand);
    },
    [bestCombo, board, combo, difficulty, ensureMoveExists, gameState, hand, score]
  );

  useEffect(() => {
    if (gameState === 'playing' && !hasAnyValidMove(board, hand)) {
      endGame('lost');
    }
  }, [board, endGame, gameState, hand]);

  // Global mouse move tracking for piece preview
  useEffect(() => {
    if (!selectedPiece || !boardRef.current) return;

    const handleGlobalMouseMove = (event) => {
      const rect = boardRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Calculate cell size
      const cellSize = rect.width / config.boardSize;

      // Get the grid cell under the cursor (can be negative or beyond board size)
      const cursorCol = Math.floor(x / cellSize);
      const cursorRow = Math.floor(y / cellSize);

      // Calculate piece center offset
      const centerRowOffset = (selectedPiece.bounds.maxRow + selectedPiece.bounds.minRow) / 2;
      const centerColOffset = (selectedPiece.bounds.maxCol + selectedPiece.bounds.minCol) / 2;

      // Anchor position that centers the piece on the cursor, then clamps it to the board.
      // Use floor + 0.5 for "round half up" instead of Math.round's banker's rounding
      const anchorRow = Math.floor(cursorRow - centerRowOffset + 0.5);
      const anchorCol = Math.floor(cursorCol - centerColOffset + 0.5);
      const clampedAnchor = clampPlacementAnchor(selectedPiece, config.boardSize, anchorRow, anchorCol);

      setHoverCell(clampedAnchor);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [selectedPiece, config.boardSize]);

  const handleBoardClick = () => {
    if (!selectedPiece || !hoverCell) return;
    handlePlacePiece(selectedPiece.id, hoverCell.row, hoverCell.col);
  };

  const handlePieceSelect = (pieceId) => {
    setSelectedPieceId((current) => (current === pieceId ? null : pieceId));
  };

  const handlePieceDragStart = (pieceId) => {
    setSelectedPieceId(pieceId);
  };

  const handlePieceDragEnd = () => {
    setHoverCell(null);
  };

  const handleBoardDragOver = (event, row, col) => {
    if (!selectedPiece) return;
    event.preventDefault();
    setHoverCell(clampPlacementAnchor(selectedPiece, config.boardSize, row, col));
  };

  const handleBoardDrop = (event, row, col) => {
    event.preventDefault();
    if (!selectedPiece) return;
    const clampedAnchor = clampPlacementAnchor(selectedPiece, config.boardSize, row, col);
    handlePlacePiece(selectedPiece.id, clampedAnchor.row, clampedAnchor.col);
  };

  const handleReset = () => {
    resetGame();
  };



  const previewCells = hoverCell && selectedPiece ? getPlacedCells(selectedPiece, hoverCell.row, hoverCell.col) : [];
  const previewCellSet = new Set(
    previewCells
      .filter(([row, col]) => row >= 0 && row < config.boardSize && col >= 0 && col < config.boardSize)
      .map(([row, col]) => `${row}-${col}`)
  );
  const previewIsValid = selectedPiece && hoverCell ? canPlacePiece(board, selectedPiece, hoverCell.row, hoverCell.col) : false;

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="bg-white rounded-2xl border-4 border-lime-300 shadow-lg p-4 md:p-6 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-gray-800">🍉 Fruit Blast</h2>
              <Badge variant={difficulty}>{config.label}</Badge>
            </div>
            <p className="text-gray-600 max-w-2xl">
              Place fruit and vegetable blocks, clear completed rows or columns, and keep the board open for as long as you can.
            </p>
          </div>

          <Button variant="secondary" onClick={handleReset} size="md">
            🔄 New Game
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5 text-center">
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
            <p className="text-xs text-gray-600">Score</p>
            <p className="text-lg font-bold text-gray-800">{score}</p>
          </div>
          <div className="bg-lime-50 border border-lime-200 rounded-xl px-3 py-2">
            <p className="text-xs text-gray-600">Time</p>
            <p className="text-lg font-bold text-gray-800">{formatTime(seconds)}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
            <p className="text-xs text-gray-600">Combo</p>
            <p className="text-lg font-bold text-gray-800">x{Math.max(combo, 0)}</p>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
            <p className="text-xs text-gray-600">Best Combo</p>
            <p className="text-lg font-bold text-gray-800">x{bestCombo}</p>
          </div>
          <div className="bg-sky-50 border border-sky-200 rounded-xl px-3 py-2 col-span-2 md:col-span-1">
            <p className="text-xs text-gray-600">Board</p>
            <p className="text-lg font-bold text-gray-800">{config.boardSize} x {config.boardSize}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] items-start">
        <div className="flex justify-center">
          <div
            ref={boardRef}
            className="inline-grid gap-1 p-3 md:p-4 bg-linear-to-b from-lime-50 to-orange-50 rounded-2xl border-4 border-lime-200 shadow-lg overflow-visible animate-fruit-board-enter"
            style={{
              gridTemplateColumns: `repeat(${config.boardSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${config.boardSize}, minmax(0, 1fr))`,
              width: 'min(92vw, 640px)',
              aspectRatio: '1 / 1',
            }}
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const key = `${rowIndex}-${colIndex}`;
                const isPreview = previewCellSet.has(key);
                const isValidPreview = isPreview && previewIsValid;
                const isInvalidPreview = isPreview && !previewIsValid;
                const isClearing = clearedCellSet.has(key);

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleBoardClick()}
                    onDragOver={(event) => handleBoardDragOver(event, rowIndex, colIndex)}
                    onDrop={(event) => handleBoardDrop(event, rowIndex, colIndex)}
                    className={`relative aspect-square rounded-lg border transition-all duration-150 flex items-center justify-center overflow-hidden ${
                      cell
                        ? 'border-white/60 shadow-sm'
                        : isValidPreview
                          ? 'border-lime-300 bg-lime-100/80'
                          : isInvalidPreview
                            ? 'border-rose-300 bg-rose-100/80'
                            : 'border-lime-100 bg-white/80 hover:bg-lime-50'
                    }`}
                  >
                    {cell ? (
                      <span className={`flex h-full w-full items-center justify-center rounded-md bg-linear-to-br ${cell.theme} text-[clamp(0.85rem,2vw,1.5rem)] ${isClearing ? 'animate-fruit-cell-burst' : 'animate-fruit-tile-pop'}`}>
                        {cell.icon}
                      </span>
                    ) : null}

                    {isPreview ? (
                      <span
                        className={`pointer-events-none absolute inset-0 flex h-full w-full items-center justify-center rounded-md border-2 border-dashed text-[clamp(0.75rem,1.8vw,1.25rem)] animate-fruit-preview-pulse ${
                          isValidPreview
                            ? 'border-lime-400 bg-lime-100/40 text-lime-700'
                            : 'border-rose-400 bg-rose-100/40 text-rose-700'
                        }`}
                      >
                        {selectedPiece.icon}
                      </span>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border-4 border-lime-200 shadow-lg p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Blocks</h3>
            <p className="text-sm text-gray-600 mb-4">
              Pick a block, then tap or drop it onto the board. Rows and columns clear when filled.
            </p>

            <div className="grid gap-3">
              {hand.map((piece, index) => {
                const isSelected = selectedPieceId === piece.id;
                const occupiesSpace = piece.shape.length;

                return (
                  <button
                    key={piece.id}
                    type="button"
                    draggable
                    onClick={() => handlePieceSelect(piece.id)}
                    onDragStart={() => handlePieceDragStart(piece.id)}
                    onDragEnd={handlePieceDragEnd}
                    className={`text-left rounded-2xl border-2 p-3 transition-all duration-150 ${
                      isSelected
                        ? 'border-lime-500 bg-lime-50 shadow-md scale-[1.01] animate-fruit-card-lift'
                        : 'border-lime-200 bg-white hover:border-lime-300 hover:shadow-sm'
                    }`}
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-gray-800">{occupiesSpace} block{occupiesSpace > 1 ? 's' : ''}</p>
                        <p className="text-xs text-gray-500">{isSelected ? 'Selected' : 'Tap to select or drag to place'}</p>
                      </div>
                      <span className={`inline-flex rounded-full bg-linear-to-br ${piece.theme} px-3 py-1 text-lg shadow-sm`}>
                        {piece.icon}
                      </span>
                    </div>

                    <div
                      className="grid gap-1"
                      style={{
                        gridTemplateColumns: `repeat(${piece.bounds.maxCol - piece.bounds.minCol + 1}, minmax(0, 1fr))`,
                        width: 'fit-content',
                      }}
                    >
                      {piece.shape.map(([rowOffset, colOffset], index) => (
                        <div
                          key={`${piece.id}-${index}`}
                          className={`flex h-8 w-8 items-center justify-center rounded-md bg-linear-to-br ${getThemeClasses(piece.theme)} border border-white/60 shadow-sm`}
                          style={{
                            gridColumnStart: colOffset - piece.bounds.minCol + 1,
                            gridRowStart: rowOffset - piece.bounds.minRow + 1,
                          }}
                        >
                          <span className="text-sm">{piece.icon}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-linear-to-br from-orange-50 to-rose-50 rounded-2xl border-4 border-orange-200 shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">How to play</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>1. Choose one of the three fruit blocks.</li>
              <li>2. Place it on the board without rotating it.</li>
              <li>3. Fill a complete row or column to clear it.</li>
              <li>4. Keep going until none of the current blocks fit.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border-4 border-lime-200 shadow-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Status</p>
            {gameState === 'idle' && <p className="font-semibold text-lime-700">Pick a block to start the run.</p>}
            {gameState === 'playing' && <p className="font-semibold text-emerald-700">Keep the board open and chase a higher score.</p>}
            {gameState === 'lost' && <p className="font-semibold text-red-600">No moves left. Game over.</p>}
          </div>
        </div>
      </div>

      <GameOverModal onPlayAgain={handleReset} />
    </div>
  );
}
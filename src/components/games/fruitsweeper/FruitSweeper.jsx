import { useEffect, useContext, useRef, useCallback } from 'react';
import { useMinesweeperEngine } from '../../../hooks/useMinesweeperEngine';
import { useGameStore } from '../../../store/gameStore';
import { useGameTimer } from '../../../hooks/useGameTimer';
import { UIContext } from '../../../store/UIContext';
import { getMineIcon } from '../../../utils/assetMapping';
import { Board } from './Board';
import { GameHeader } from './GameHeader';
import { GameOverModal } from '../../shared/GameOverModal';

/**
 * FruitSweeper - main game component
 * Orchestrates engine, store, UI state
 */
export function FruitSweeper({ difficulty = 'medium' }) {
  const gameStore = useGameStore();
  const { setShowGameOverModal, setGameOverData } = useContext(UIContext);
  const prevDifficultyRef = useRef(null); // Initialize as null so first render always triggers
  const gameOverHandledRef = useRef(false);

  const engine = useMinesweeperEngine(gameStore.width, gameStore.height, gameStore.mineCount);
  const timer = useGameTimer();
  const minesRemaining = gameStore.mineCount - engine.flagged.size;

  const handleGameOver = useCallback(
    (result) => {
      if (gameOverHandledRef.current) return;

      gameOverHandledRef.current = true;
      setGameOverData({
        result,
        difficulty: gameStore.difficulty,
        time: timer,
      });
      setShowGameOverModal(true);
    },
    [gameStore.difficulty, setGameOverData, setShowGameOverModal, timer]
  );

  // Initialize game only when difficulty actually changes
  useEffect(() => {
    if (prevDifficultyRef.current !== difficulty) {
      prevDifficultyRef.current = difficulty;
      gameStore.initGame(difficulty);
      gameOverHandledRef.current = false;
    }
  }, [difficulty, gameStore]);

  // Create stable mine icon
  const mineIcon = getMineIcon();

  // Handle tile click (left-click)
  const handleTileClick = ({ row, col }) => {
    if (gameStore.gameState !== 'playing' && gameStore.gameState !== 'idle') return;

    // Start game on first click
    if (gameStore.gameState === 'idle') {
      gameStore.startGame();
    }

    engine.handleReveal(row, col);
    const currentEngineState = engine.getGameState();
    
    // Only update store if game state changed
    if (currentEngineState !== 'idle') {
      gameStore.setGameState(currentEngineState);

      if (currentEngineState === 'won' || currentEngineState === 'lost') {
        handleGameOver(currentEngineState);
      }
    }
  };

  // Handle flag toggle (right-click)
  const handleTileContextMenu = ({ row, col }) => {
    if (gameStore.gameState !== 'playing') return;
    engine.toggleFlag(row, col);
  };

  // Handle reset
  const handleReset = () => {
    engine.reset();
    gameStore.resetGame();
    setShowGameOverModal(false);
    setGameOverData(null);
    gameOverHandledRef.current = false;
  };

  // Handle game over (win/loss) - only once per game
  useEffect(() => {
    if (!gameOverHandledRef.current && (gameStore.gameState === 'won' || gameStore.gameState === 'lost')) {
      handleGameOver(gameStore.gameState === 'won' ? 'won' : 'lost');
    }
  }, [gameStore.gameState, handleGameOver]);


  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <GameHeader
        difficulty={gameStore.difficulty}
        timer={timer}
        minesRemaining={Math.max(0, minesRemaining)}
        totalMines={gameStore.mineCount}
        gameState={gameStore.gameState}
        onReset={handleReset}
      />

      <div className="flex justify-center mb-4">
        <Board
          board={engine.board}
          revealed={engine.revealed}
          flagged={engine.flagged}
          onTileClick={handleTileClick}
          onTileRightClick={handleTileContextMenu}
          mineIcon={mineIcon}
        />
      </div>

      <GameOverModal onPlayAgain={handleReset} />
    </div>
  );
}

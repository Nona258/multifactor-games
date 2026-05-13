import { useEffect, useMemo, useState, useContext, useRef } from 'react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { UIContext } from '../../../store/UIContext';
import { GameOverModal } from '../../shared/GameOverModal';

const CROP_ICONS = ['🌽', '🥕', '🍅', '🍆', '🥦', '🌶️', '🫛', '🧄', '🥔', '🧅', '🍓', '🍇'];

const DIFFICULTY_CONFIG = {
  easy: { rows: 4, cols: 4, label: 'Easy' },
  medium: { rows: 4, cols: 5, label: 'Medium' },
  hard: { rows: 6, cols: 6, label: 'Hard' },
};

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function createDeck(pairCount) {
  const selectedCrops = shuffle(CROP_ICONS).slice(0, pairCount);
  const cards = selectedCrops.flatMap((crop, pairIndex) => [
    { id: `${pairIndex}-a`, crop, pairId: pairIndex, matched: false },
    { id: `${pairIndex}-b`, crop, pairId: pairIndex, matched: false },
  ]);
  return shuffle(cards);
}

/**
 * CropMatch - memory matching game with difficulty-based board sizes.
 */
export function CropMatch({ difficulty = 'medium' }) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const pairCount = (config.rows * config.cols) / 2;

  const [cards, setCards] = useState(() => createDeck(pairCount));
  const [flippedIds, setFlippedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [gameState, setGameState] = useState('idle');
  const [locked, setLocked] = useState(false);

  const matchedCount = useMemo(() => cards.filter((card) => card.matched).length, [cards]);

  useEffect(() => {
    setCards(createDeck(pairCount));
    setFlippedIds([]);
    setMoves(0);
    setSeconds(0);
    setGameState('idle');
    setLocked(false);
  }, [pairCount]);

  useEffect(() => {
    if (gameState !== 'playing') return undefined;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  const { setShowGameOverModal, setGameOverData } = useContext(UIContext);
  const winHandledRef = useRef(false);

  useEffect(() => {
    if (matchedCount === cards.length && cards.length > 0) {
      setGameState('won');
    }
  }, [matchedCount, cards.length]);

  // Trigger global game over modal once when player wins
  useEffect(() => {
    if (gameState === 'won' && !winHandledRef.current) {
      winHandledRef.current = true;
      setGameOverData({
        result: 'won',
        difficulty,
        time: seconds,
        gameId: 'cropmatch',
      });
      setShowGameOverModal(true);
    }
  }, [gameState, setGameOverData, setShowGameOverModal, seconds, difficulty]);

  const handleReset = () => {
    // Clear global modal state if open and allow future win handling
    winHandledRef.current = false;
    setShowGameOverModal(false);
    setGameOverData(null);

    setCards(createDeck(pairCount));
    setFlippedIds([]);
    setMoves(0);
    setSeconds(0);
    setGameState('idle');
    setLocked(false);
  };

  const isCardVisible = (card) => card.matched || flippedIds.includes(card.id);

  const handleCardClick = (card) => {
    if (locked || card.matched || flippedIds.includes(card.id) || gameState === 'won') return;

    if (gameState === 'idle') {
      setGameState('playing');
    }

    const nextFlipped = [...flippedIds, card.id];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length < 2) return;

    setMoves((prev) => prev + 1);
    setLocked(true);

    const [firstId, secondId] = nextFlipped;
    const firstCard = cards.find((entry) => entry.id === firstId);
    const secondCard = cards.find((entry) => entry.id === secondId);

    if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
      setCards((prevCards) =>
        prevCards.map((entry) =>
          entry.id === firstCard.id || entry.id === secondCard.id
            ? { ...entry, matched: true }
            : entry
        )
      );
      setFlippedIds([]);
      setLocked(false);
      return;
    }

    window.setTimeout(() => {
      setFlippedIds([]);
      setLocked(false);
    }, 550);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="bg-white rounded-2xl border-4 border-lime-300 shadow-lg p-4 md:p-6 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">🌽 Crop Match</h2>
            <p className="text-gray-600">Find all matching crop pairs to win.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={difficulty}>{config.label}</Badge>
            <Button variant="secondary" onClick={handleReset}>🔄 Restart</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4 text-center">
          <div className="bg-lime-50 border border-lime-200 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-600">Moves</p>
            <p className="text-lg font-bold text-gray-800">{moves}</p>
          </div>
          <div className="bg-lime-50 border border-lime-200 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-600">Timer</p>
            <p className="text-lg font-bold text-gray-800">{formatTime(seconds)}</p>
          </div>
          <div className="bg-lime-50 border border-lime-200 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-600">Matched</p>
            <p className="text-lg font-bold text-gray-800">{matchedCount / 2}/{pairCount}</p>
          </div>
        </div>
      </div>

      <div
        className="grid gap-2 md:gap-3"
        style={{
          gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
        }}
      >
        {cards.map((card) => {
          const visible = isCardVisible(card);
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`aspect-square rounded-xl border-2 text-2xl md:text-3xl ${
                visible
                  ? 'bg-amber-50 border-amber-300 shadow-inner'
                  : 'bg-lime-200 hover:bg-lime-300 border-lime-400'
              } ${card.matched ? 'ring-2 ring-emerald-300' : ''}`}
              style={{ perspective: '1000px' }}
            >
              <span
                className="relative block h-full w-full [transform-style:preserve-3d] transition-transform duration-500 ease-out"
                style={{ transform: `rotateY(${visible ? 180 : 0}deg)` }}
              >
                <span
                  className="absolute inset-0 flex h-full w-full items-center justify-center rounded-[0.7rem] bg-lime-200 border-2 border-lime-400 [backface-visibility:hidden]"
                >
                  🌱
                </span>
                <span
                  className="absolute inset-0 flex h-full w-full items-center justify-center rounded-[0.7rem] bg-amber-50 border-2 border-amber-300 [backface-visibility:hidden]"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  {card.crop}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {gameState === 'won' && (
        <div className="mt-6 bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 text-center">
          <p className="text-xl font-bold text-emerald-700 mb-1">Harvest Complete! 🎉</p>
          <p className="text-gray-700 mb-3">
            You finished in {formatTime(seconds)} with {moves} moves.
          </p>
          <Button variant="primary" onClick={handleReset}>Play Again</Button>
        </div>
      )}

      {/* Global GameOver modal (uses UIContext) */}
      <GameOverModal onPlayAgain={handleReset} />
    </div>
  );
}

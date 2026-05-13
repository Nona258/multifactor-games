import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Timer } from '../../shared/Timer';
import { MineCounter } from '../../shared/MineCounter';

/**
 * GameHeader - displays game stats (timer, mine counter, difficulty, reset button)
 */
export function GameHeader({
  difficulty = 'medium',
  timer = 0,
  minesRemaining = 40,
  totalMines = 40,
  gameState = 'idle',
  onReset,
}) {
  const difficultyVariant = difficulty === 'easy' ? 'easy' : difficulty === 'hard' ? 'hard' : 'medium';
  const isActive = gameState === 'playing';

  return (
    <div className="w-full bg-gradient-to-r from-lime-100 to-green-100 rounded-lg p-4 mb-4 shadow-md border-2 border-lime-200">
      {/* Top row - title and difficulty */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">🍎 Fruit Sweeper</h1>
        <Badge variant={difficultyVariant}>{difficulty.toUpperCase()}</Badge>
      </div>

      {/* Bottom row - stats and reset */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="flex gap-6">
          <Timer seconds={timer} isActive={isActive} />
          <MineCounter remaining={minesRemaining} total={totalMines} />
        </div>

        <Button
          variant={gameState === 'playing' ? 'secondary' : 'primary'}
          onClick={onReset}
          size="sm"
        >
          🔄 New Game
        </Button>
      </div>

      {/* Game status indicator */}
      {gameState !== 'idle' && (
        <div className="mt-3 text-sm text-center font-semibold">
          {gameState === 'playing' && <span className="text-lime-600">🎮 Game in Progress</span>}
          {gameState === 'won' && <span className="text-emerald-600">✨ You Won!</span>}
          {gameState === 'lost' && <span className="text-red-600">💥 Game Over</span>}
        </div>
      )}
    </div>
  );
}

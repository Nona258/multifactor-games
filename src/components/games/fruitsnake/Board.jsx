import { useEffect } from 'react';

/**
 * Board - renders the game grid with snake and fruit
 */
export function Board({ gridSize, snake, fruit, gameState, difficulty = 'medium', onDirectionChange }) {
  const cellSize = Math.max(20, Math.min(30, 600 / gridSize));
  const boardSize = gridSize * cellSize;
  const isEasy = difficulty === 'easy';
  const snakeMotionClass = isEasy
    ? 'transition-transform duration-200 ease-out will-change-transform'
    : 'transition-all duration-100 ease-out';
  const fruitMotionClass = isEasy
    ? 'transition-transform duration-200 ease-out will-change-transform'
    : 'transition-all duration-100 ease-out';

  // Touch-based controls for mobile
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Determine direction based on swipe
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
          onDirectionChange(1, 0); // Right
        } else {
          onDirectionChange(-1, 0); // Left
        }
      } else {
        // Vertical swipe
        if (diffY > 0) {
          onDirectionChange(0, 1); // Down
        } else {
          onDirectionChange(0, -1); // Up
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onDirectionChange]);

  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      {/* Game board */}
      <div
        className="bg-gray-900 rounded-lg shadow-2xl border-4 border-lime-400 relative"
        style={{
          width: `${boardSize}px`,
          height: `${boardSize}px`,
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize}px ${cellSize}px`,
        }}
      >
        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          const x = segment.x * cellSize;
          const y = segment.y * cellSize;
          const blockSize = cellSize - 3;

          return (
            <div
              key={index}
              className={`absolute border ${snakeMotionClass} ${
                isHead
                  ? 'bg-emerald-700 border-emerald-900 shadow-lg shadow-emerald-500/40'
                  : index % 2 === 0
                    ? 'bg-emerald-500 border-emerald-700 shadow-md shadow-emerald-500/30'
                    : 'bg-lime-500 border-lime-700 shadow-md shadow-lime-500/30'
              } rounded-md`}
              style={{
                left: '0px',
                top: '0px',
                width: `${blockSize}px`,
                height: `${blockSize}px`,
                transform: `translate3d(${x + 1.5}px, ${y + 1.5}px, 0)`,
                zIndex: 10 - index, // Head on top
              }}
            >
              {isHead && (
                <div className="w-full h-full flex items-center justify-center relative">
                  {/* Eyes */}
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}

        {/* Fruit */}
        {fruit && (
          <div
            className={`absolute flex items-center justify-center text-2xl ${fruitMotionClass}`}
            style={{
              left: '0px',
              top: '0px',
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              transform: `translate3d(${fruit.x * cellSize}px, ${fruit.y * cellSize}px, 0)`,
              zIndex: 5,
            }}
          >
            {fruit.emoji}
          </div>
        )}

        {/* Game over overlay */}
        {gameState === 'lost' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg z-50">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">💥 Game Over!</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls info */}
      <div className="text-center text-gray-600 text-sm">
        <p className="mb-2">⬆️ ⬇️ ⬅️ ➡️ or W A S D to move | Swipe on mobile</p>
        <p className="text-xs text-gray-500">Eat fruits 🍎 to grow longer and score points!</p>
      </div>
    </div>
  );
}

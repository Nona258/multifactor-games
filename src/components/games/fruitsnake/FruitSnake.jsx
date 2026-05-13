import { useEffect, useContext, useRef, useCallback, useState } from 'react';
import { useSnakeEngine } from '../../../hooks/useSnakeEngine';
import { UIContext } from '../../../store/UIContext';
import { GameOverModal } from '../../shared/GameOverModal';
import { GameHeader } from './GameHeader';
import { Board } from './Board';

/**
 * FruitSnake - main game component
 * Snake moves around and eats fruits
 */
export function FruitSnake({ difficulty = 'medium' }) {
  const { setShowGameOverModal, setGameOverData } = useContext(UIContext);
  const gameOverHandledRef = useRef(false);
  const prevDifficultyRef = useRef(null);
  const gameStartTimeRef = useRef(null);
  const [timer, setTimer] = useState(0);

  // Difficulty settings
  const difficultyConfig = {
    easy: { gridSize: 12, gameSpeed: 200 },
    medium: { gridSize: 20, gameSpeed: 120 },
    hard: { gridSize: 24, gameSpeed: 80 },
  };

  const config = difficultyConfig[difficulty] || difficultyConfig.medium;
  const engine = useSnakeEngine(config.gridSize, config.gridSize, config.gameSpeed);
  const { gameState } = engine;

  // Timer effect - update every 100ms
  useEffect(() => {
    if (gameState !== 'playing') {
      gameStartTimeRef.current = null;
      return;
    }

    if (!gameStartTimeRef.current) {
      gameStartTimeRef.current = Date.now();
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - gameStartTimeRef.current) / 1000);
      setTimer(elapsed);
    }, 100);

    return () => clearInterval(interval);
  }, [gameState]);

  const handleGameOver = useCallback(
    (result) => {
      if (gameOverHandledRef.current) return;
      gameOverHandledRef.current = true;

      setGameOverData({
        result,
        gameId: 'fruitsnake',
        difficulty,
        time: timer,
        score: engine.score,
        fruitsEaten: engine.fruitsEaten,
      });
      setShowGameOverModal(true);
    },
    [difficulty, setGameOverData, setShowGameOverModal, timer, engine.score, engine.fruitsEaten]
  );

  // Initialize game when difficulty changes
  useEffect(() => {
    if (prevDifficultyRef.current !== difficulty) {
      prevDifficultyRef.current = difficulty;
      engine.reset();
      gameOverHandledRef.current = false;
      setTimer(0);
      gameStartTimeRef.current = null;
    }
  }, [difficulty, engine]);

  // Check for game over
  useEffect(() => {
    if (gameState === 'lost') {
      handleGameOver('lost');
    }
  }, [gameState, handleGameOver]);

  const handlePlayAgain = () => {
    engine.reset();
    gameOverHandledRef.current = false;
    setShowGameOverModal(false);
    setGameOverData(null);
    setTimer(0);
    gameStartTimeRef.current = null;
  };

  return (
    <div className="max-w-4xl w-full">
      <GameHeader score={engine.score} time={timer} difficulty={difficulty} />

      <Board
        gridSize={engine.gridSize}
        snake={engine.snake}
        fruit={engine.fruit}
        gameState={gameState}
        difficulty={difficulty}
        onDirectionChange={engine.handleInput}
      />

      {gameState === 'idle' && (
        <div className="mt-8 text-center p-6 bg-white rounded-lg border-4 border-lime-300 shadow-lg">
          <p className="text-lg font-semibold text-gray-700 mb-2">🎮 Ready to play?</p>
          <p className="text-gray-600">Press any arrow key or WASD to start and control the snake!</p>
        </div>
      )}

      <GameOverModal onPlayAgain={handlePlayAgain} />
    </div>
  );
}

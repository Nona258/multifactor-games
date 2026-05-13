import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { SnakeEngine } from '../lib/gameEngine/SnakeEngine';

/**
 * Hook for managing snake game engine
 * Handles updates, rendering, and keyboard input
 */
export function useSnakeEngine(width = 20, height = 20, gameSpeed = 100) {
  const [_, setTrigger] = useState(0);
  const gameLoopRef = useRef(null);
  const isPlayingRef = useRef(false);

  // Initialize engine
  const engine = useMemo(() => {
    return new SnakeEngine(width, height);
  }, [width, height]);

  const [gameState, setGameState] = useState(engine.getGameState());

  // Force React re-render
  const forceUpdate = useCallback(() => setTrigger((t) => t + 1), []);

  // Handle direction input
  const handleInput = useCallback((dx, dy) => {
    if (!isPlayingRef.current && engine.gameState === 'idle') {
      engine.start();
      isPlayingRef.current = true;
      setGameState('playing');
    }
    engine.setDirection(dx, dy);
  }, [engine]);

  // Game loop - update on interval
  useEffect(() => {
    if (gameState !== 'playing') {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    gameLoopRef.current = setInterval(() => {
      engine.update();
      const newState = engine.getGameState();
      setGameState(newState);
      forceUpdate();
    }, gameSpeed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [engine, gameSpeed, forceUpdate, gameState]);

  // Keyboard input listener
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();

      if (key === 'arrowup' || key === 'w') {
        e.preventDefault();
        handleInput(0, -1);
      } else if (key === 'arrowdown' || key === 's') {
        e.preventDefault();
        handleInput(0, 1);
      } else if (key === 'arrowleft' || key === 'a') {
        e.preventDefault();
        handleInput(-1, 0);
      } else if (key === 'arrowright' || key === 'd') {
        e.preventDefault();
        handleInput(1, 0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleInput]);

  return {
    snake: engine.getSnake(),
    fruit: engine.getFruit(),
    score: engine.getScore(),
    gameState: gameState,
    fruitsEaten: engine.fruitsEaten,
    gridSize: engine.gridSize,

    // Control methods
    handleInput,
    
    reset: () => {
      engine.reset();
      setGameState('idle');
      forceUpdate();
    },

    setGameState: (state) => {
      engine.gameState = state;
      setGameState(state);
      forceUpdate();
    },

    gameState,
  };
}

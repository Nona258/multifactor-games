import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

/**
 * Hook for managing game timer
 * Starts on game begin, stops on game end
 */
export function useGameTimer() {
  const { gameState, timer, startTime, updateTimer } = useGameStore();

  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      updateTimer(elapsed);
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, startTime, updateTimer]);

  return timer;
}

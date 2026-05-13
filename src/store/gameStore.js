import { create } from 'zustand';

/**
 * Zustand game store - manages game state for FruitSweeper
 * Handles difficulty configuration, timer, leaderboard data
 */
export const useGameStore = create((set) => ({
  // Difficulty settings
  difficulty: 'medium',
  width: 16,
  height: 16,
  mineCount: 40,

  // Game timing
  timer: 0,
  startTime: null,
  completionTime: null,

  // Game status
  gameState: 'idle', // idle, playing, won, lost

  // Leaderboard
  currentScore: null,
  currentRank: null,

  /**
   * Initialize game for a specific difficulty
   */
  initGame: (difficulty = 'medium') =>
    set(() => {
      const presets = {
        easy: { width: 8, height: 8, mineCount: 10 },
        medium: { width: 16, height: 16, mineCount: 40 },
        hard: { width: 30, height: 16, mineCount: 99 },
      };

      const config = presets[difficulty] || presets.medium;

      return {
        difficulty: config ? difficulty : 'medium',
        ...config,
        timer: 0,
        startTime: null,
        completionTime: null,
        gameState: 'idle',
        currentScore: null,
        currentRank: null,
      };
    }),

  /**
   * Start the timer
   */
  startGame: () =>
    set((state) => ({
      gameState: 'playing',
      startTime: Date.now(),
      timer: 0,
    })),

  /**
   * Update elapsed time
   */
  updateTimer: (elapsed) => set({ timer: elapsed }),

  /**
   * Set game state (won/lost)
   */
  setGameState: (gameState) =>
    set((state) => ({
      gameState,
      completionTime: gameState === 'won' ? state.timer : null,
    })),

  /**
   * Store leaderboard submission result
   */
  setScore: (score, rank) =>
    set({
      currentScore: score,
      currentRank: rank,
    }),

  /**
   * Reset game
   */
  resetGame: () =>
    set((state) => ({
      gameState: 'idle',
      timer: 0,
      startTime: null,
      completionTime: null,
      currentScore: null,
      currentRank: null,
    })),
}));

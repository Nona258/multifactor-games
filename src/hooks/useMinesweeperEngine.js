

import { useMemo, useState } from 'react';
import { MinesweeperEngine } from '../lib/gameEngine/MinesweeperEngine';

export function useMinesweeperEngine(width, height, mines) {
  const [_, setTrigger] = useState(0);
  const [resetNonce, setResetNonce] = useState(0);

  // Always recreate engine when board size changes
  const engine = useMemo(
    () => new MinesweeperEngine(width, height, mines),
    [width, height, mines, resetNonce]
  );

  /**
   * Force React re-render when game state changes
   */
  const forceUpdate = () => setTrigger((t) => t + 1);

  return {
    // Game state accessors
    board: engine.board,
    revealed: engine.revealed,
    flagged: engine.flagged,
    getGameState: () => engine.gameState,

    /**
     * Handle left-click: reveal tile
     * On first click, lazily place mines
     */
    handleReveal: (row, col) => {
      if (engine.gameState === 'idle') {
        const excludeIdx = engine.coordsToIndex(row, col);
        engine.placeMines(excludeIdx);
        engine.gameState = 'playing';
      }

      engine.revealTile(row, col);
      forceUpdate();
    },

    /**
     * Handle right-click: toggle flag
     */
    toggleFlag: (row, col) => {
      engine.toggleFlag(row, col);
      forceUpdate();
    },

    /**
     * Reset game to initial state
     */
    reset: () => {
      setResetNonce((nonce) => nonce + 1);
      forceUpdate();
    },

    /**
     * Get completion time (for leaderboard)
     */
    getCompletionTime: () => {
      // Will be managed by game component's timer
      return null;
    },
  };
}

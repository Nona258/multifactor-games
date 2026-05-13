import { createContext, useState } from 'react';

/**
 * UIContext - Manage non-game UI state
 * Used for settings, modals, leaderboard visibility
 */
export const UIContext = createContext();

export function UIProvider({ children }) {
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false); // TODO: sound effects
  const [gameOverData, setGameOverData] = useState(null);

  return (
    <UIContext.Provider
      value={{
        showGameOverModal,
        setShowGameOverModal,
        showLeaderboard,
        setShowLeaderboard,
        soundEnabled,
        setSoundEnabled,
        gameOverData,
        setGameOverData,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'fruitsweeper_username';

/**
 * Hook for generating and persisting temporary usernames
 * Format: Farmer{4-digit random number}
 */
export function useTemporaryUser() {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      setUsername(stored);
    } else {
      // Generate new temporary username
      const randomNum = Math.floor(Math.random() * 9000) + 1000;
      const newUsername = `Farmer${randomNum}`;
      localStorage.setItem(STORAGE_KEY, newUsername);
      setUsername(newUsername);
    }

    setLoading(false);
  }, []);

  /**
   * Change username and persist
   */
  const updateUsername = (newUsername) => {
    localStorage.setItem(STORAGE_KEY, newUsername);
    setUsername(newUsername);
  };

  return {
    username,
    loading,
    updateUsername,
  };
}

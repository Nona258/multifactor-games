import { useState, useCallback, useEffect } from 'react';
import {
  submitScore as submitScoreService,
  getScores,
  getTopScores,
  subscribeToLeaderboard,
  getPlayerStats,
} from '../services/leaderboardService';

/**
 * Hook for managing leaderboard operations
 * Handles score submission, fetching scores, and real-time updates
 */
export function useLeaderboard() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [playerStats, setPlayerStats] = useState(null);

  // Submit a score to the leaderboard
  const submitScore = useCallback(
    async (username, game_id, difficulty, completion_time, result) => {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const response = await submitScoreService(
          username,
          game_id,
          difficulty,
          completion_time,
          result
        );

        if (response.success) {
          // Fetch updated leaderboard after submission
          if (result === 'win' || game_id === 'fruitsnake' || game_id === 'fruitblast') {
            const leaderboardResponse = await getScores(game_id, difficulty);
            if (leaderboardResponse.success) {
              setLeaderboardData(leaderboardResponse.data);
            }
          }
          return { success: true };
        } else {
          setSubmitError(response.error?.message || 'Failed to submit score');
          return { success: false, error: response.error };
        }
      } catch (err) {
        setSubmitError(err.message);
        return { success: false, error: err };
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  // Fetch leaderboard for a specific game/difficulty
  const fetchLeaderboard = useCallback(async (game_id, difficulty, limit = 10) => {
    setIsLoading(true);
    try {
      const response = await getScores(game_id, difficulty, limit);
      if (response.success) {
        setLeaderboardData(response.data);
        return response.data;
      } else {
        console.error('Failed to fetch leaderboard:', response.error);
        return [];
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch top scores across all games
  const fetchTopScores = useCallback(async (limit = 20) => {
    setIsLoading(true);
    try {
      const response = await getTopScores(limit);
      if (response.success) {
        setLeaderboardData(response.data);
        return response.data;
      } else {
        console.error('Failed to fetch top scores:', response.error);
        return [];
      }
    } catch (err) {
      console.error('Error fetching top scores:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch player stats
  const fetchPlayerStats = useCallback(async (username) => {
    try {
      const response = await getPlayerStats(username);
      if (response.success) {
        setPlayerStats(response.data);
        return response.data;
      } else {
        console.error('Failed to fetch player stats:', response.error);
        return null;
      }
    } catch (err) {
      console.error('Error fetching player stats:', err);
      return null;
    }
  }, []);

  // Subscribe to real-time updates
  const setupRealtime = useCallback((game_id, difficulty, onUpdate) => {
    return subscribeToLeaderboard(game_id, difficulty, (newScore) => {
      // Update leaderboard with new score
      setLeaderboardData((prevData) => {
        const updated = [newScore, ...prevData];
        // Keep only top 10
        return updated.slice(0, 10);
      });
      if (onUpdate) {
        onUpdate(newScore);
      }
    });
  }, []);

  return {
    // State
    isSubmitting,
    submitError,
    leaderboardData,
    isLoading,
    playerStats,

    // Methods
    submitScore,
    fetchLeaderboard,
    fetchTopScores,
    fetchPlayerStats,
    setupRealtime,
  };
}

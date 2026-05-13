import { supabase } from './supabaseClient';

const SCORES_TABLE = 'scores';

/**
 * Submit a game score to the leaderboard
 * @param {string} username - Player username
 * @param {string} game_id - Game identifier (e.g., 'fruitsweeper')
 * @param {string} difficulty - Difficulty level ('easy', 'medium', 'hard')
 * @param {number} completion_time - Time to complete in seconds
 * @param {string} result - Game result ('win' or 'loss')
 * @returns {Promise<{success: boolean, data?: any, error?: any}>}
 */
export async function submitScore(username, game_id, difficulty, completion_time, result) {
  try {
    const { data, error } = await supabase
      .from(SCORES_TABLE)
      .insert([
        {
          username,
          game_id,
          difficulty,
          completion_time,
          result,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Error submitting score:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error submitting score:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Get top scores for a specific game and difficulty
 * @param {string} game_id - Game identifier
 * @param {string} difficulty - Difficulty level
 * @param {number} limit - Number of scores to fetch (default: 10)
 * @returns {Promise<{success: boolean, data?: any[], error?: any}>}
 */
export async function getScores(game_id, difficulty, limit = 10) {
  try {
    let query = supabase
      .from(SCORES_TABLE)
      .select('username, completion_time, result, created_at')
      .eq('game_id', game_id)
      .eq('difficulty', difficulty);

    // For score-based survival games, show all scores instead of filtering to wins.
    if (game_id !== 'fruitsnake' && game_id !== 'fruitblast') {
      query = query.eq('result', 'win');
    }

    const sortAscending = game_id !== 'fruitblast';

    const { data, error } = await query
      .order('completion_time', { ascending: sortAscending })
      .limit(limit);

    if (error) {
      console.error('Error fetching scores:', error);
      return { success: false, error };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Unexpected error fetching scores:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Get top scores across all games and difficulties
 * @returns {Promise<{success: boolean, data?: any[], error?: any}>}
 */
export async function getTopScores(limit = 20) {
  try {
    const { data, error } = await supabase
      .from(SCORES_TABLE)
      .select('username, game_id, difficulty, completion_time, result, created_at')
      .eq('result', 'win')
      .order('completion_time', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching top scores:', error);
      return { success: false, error };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Unexpected error fetching top scores:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Subscribe to real-time score updates for a game/difficulty
 * @param {string} game_id - Game identifier
 * @param {string} difficulty - Difficulty level
 * @param {Function} callback - Callback function for updates
 * @returns {Function} Unsubscribe function
 */
export function subscribeToLeaderboard(game_id, difficulty, callback) {
  try {
    const resultFilter = game_id === 'fruitsnake' || game_id === 'fruitblast' ? 'loss' : 'win';

    const subscription = supabase
      .channel(`leaderboard:${game_id}:${difficulty}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: SCORES_TABLE,
          filter: `game_id=eq.${game_id} AND difficulty=eq.${difficulty} AND result=eq.${resultFilter}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(subscription);
    };
  } catch (err) {
    console.error('Error subscribing to leaderboard:', err);
    return () => {}; // Return no-op function
  }
}

/**
 * Get player stats (total games, wins, best time per game)
 * @param {string} username - Player username
 * @returns {Promise<{success: boolean, data?: any, error?: any}>}
 */
export async function getPlayerStats(username) {
  try {
    const { data, error } = await supabase
      .from(SCORES_TABLE)
      .select('game_id, difficulty, completion_time, result')
      .eq('username', username)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching player stats:', error);
      return { success: false, error };
    }

    // Calculate stats
    const stats = {
      totalGames: data?.length || 0,
      wins: data?.filter((s) => s.result === 'win').length || 0,
      losses: data?.filter((s) => s.result === 'loss').length || 0,
      bestTimes: {},
    };

    // Find best time for each game/difficulty combo
    if (data) {
      data.forEach((score) => {
        const key = `${score.game_id}_${score.difficulty}`;
        if (!stats.bestTimes[key] || score.completion_time < stats.bestTimes[key]) {
          stats.bestTimes[key] = score.completion_time;
        }
      });
    }

    return { success: true, data: stats };
  } catch (err) {
    console.error('Unexpected error fetching player stats:', err);
    return { success: false, error: err.message };
  }
}

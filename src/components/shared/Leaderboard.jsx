import { useEffect } from 'react';
import { useLeaderboard } from '../../hooks/useLeaderboard';

/**
 * Leaderboard - displays top scores for a specific game/difficulty
 */
export function Leaderboard({ gameId = 'fruitsweeper', difficulty = 'medium', limit = 10 }) {
  const { fetchLeaderboard, leaderboardData, isLoading } = useLeaderboard();
  const isScoreGame = gameId === 'fruitblast';

  useEffect(() => {
    fetchLeaderboard(gameId, difficulty, limit);
  }, [gameId, difficulty, limit, fetchLeaderboard]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatScore = (value) => `${Math.max(0, Math.round(value || 0))}`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="bg-lime-50 rounded-lg p-6 border-2 border-lime-200 text-center">
        <p className="text-gray-600">Loading leaderboard...</p>
      </div>
    );
  }

  if (!leaderboardData || leaderboardData.length === 0) {
    return (
      <div className="bg-lime-50 rounded-lg p-6 border-2 border-lime-200 text-center">
        <p className="text-gray-600">No scores yet for {difficulty} difficulty!</p>
        <p className="text-sm text-gray-500 mt-2">
          {isScoreGame ? 'Be the first to set the high score!' : 'Be the first to win and claim the top spot!'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-lime-50 rounded-lg p-6 border-2 border-lime-200">
      <h3 className="text-lg font-bold text-lime-700 mb-4">📊 Top {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Scores</h3>
      
      <div className="space-y-2">
        {leaderboardData.map((score, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white rounded-lg p-3 border-l-4 border-lime-400"
          >
            <div className="flex items-center gap-3 grow">
              {/* Rank badge */}
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-lime-200 font-bold text-sm text-lime-700">
                {index + 1}
              </div>
              
              {/* Player info */}
              <div className="grow">
                <p className="font-semibold text-gray-800">{score.username}</p>
                <p className="text-xs text-gray-500">{formatDate(score.created_at)}</p>
              </div>
            </div>

            {/* Time */}
            <div className="text-right">
              <p className={`font-mono font-bold ${isScoreGame ? 'text-orange-600' : 'text-lime-600'}`}>
                {isScoreGame ? formatScore(score.completion_time) : formatTime(score.completion_time)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

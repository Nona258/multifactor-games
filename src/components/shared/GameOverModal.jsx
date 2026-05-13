import { useContext, useState } from 'react';
import { UIContext } from '../../store/UIContext';
import { useTemporaryUser } from '../../hooks/useTemporaryUser';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { Leaderboard } from './Leaderboard';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

/**
 * GameOverModal - displays win/loss and allows score submission
 */
export function GameOverModal({ onPlayAgain }) {
  const { showGameOverModal, setShowGameOverModal, gameOverData, setGameOverData } = useContext(UIContext);
  const { username } = useTemporaryUser();
  const { submitScore, isSubmitting, submitError } = useLeaderboard();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!gameOverData) return null;

  const isWin = gameOverData.result === 'won';
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handlePlayAgain = () => {
    if (onPlayAgain) {
      onPlayAgain();
      closeAndReset();
    } else {
      setShowGameOverModal(false);
      setGameOverData(null);
      setSubmitSuccess(false);
    }
  };

  // Always clear modal state after play again to ensure UI is reset
  const closeAndReset = () => {
    setShowGameOverModal(false);
    setGameOverData(null);
    setSubmitSuccess(false);
  };

  const handleSubmitScore = async () => {
    if (!username) {
      console.error('Username not available');
      return;
    }

    const gameId = gameOverData?.gameId || 'fruitsweeper';
    const scoreValue = gameId === 'fruitblast' ? gameOverData?.score || 0 : gameOverData?.time || 0;

    const result = await submitScore(
      username,
      gameId,
      gameOverData.difficulty,
      scoreValue,
      gameId === 'fruitsnake' || gameId === 'fruitblast' ? 'loss' : 'win'
    );

    if (result.success) {
      setSubmitSuccess(true);
    }
  };

  const isScoreGame = gameOverData?.gameId === 'fruitsnake' || gameOverData?.gameId === 'fruitblast';
  const leaderboardKey = `${gameOverData?.gameId || 'fruitsweeper'}-${gameOverData.difficulty}-${submitSuccess ? 'submitted' : 'pending'}`;

  return (
    <Modal
      isOpen={showGameOverModal}
      onClose={handlePlayAgain}
      title={isScoreGame ? '💥 Game Over!' : isWin ? '🎉 You Won!' : '💥 Game Over'}
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-start">
        <div className="space-y-4">
          {/* Success message */}
          {submitSuccess && (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-lg p-4 text-center">
              <p className="text-emerald-700 font-semibold">✨ Score submitted to leaderboard!</p>
            </div>
          )}

          {/* Error message */}
          {submitError && (
            <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 text-center">
              <p className="text-red-700 text-sm font-semibold">{submitError}</p>
            </div>
          )}

          {/* Result message */}
          <div className="text-center xl:text-left">
            {isScoreGame ? (
              <>
                <p className="text-lg font-semibold text-gray-700 mb-2">Great run! You scored {gameOverData.score || 0} points!</p>
                {gameOverData?.gameId === 'fruitsnake' ? (
                  <p className="text-sm text-gray-600 mb-3">Fruits eaten: {gameOverData.fruitsEaten || 0}</p>
                ) : (
                  <p className="text-sm text-gray-600 mb-3">You survived for {formatTime(gameOverData.time || 0)}.</p>
                )}
              </>
            ) : (
              <p className="text-lg font-semibold text-gray-700 mb-2">
                {isWin ? 'Excellent farming work!' : 'The pests got to your crops!'}
              </p>
            )}

            {/* Difficulty badge */}
            <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 mb-3">
              {gameOverData.difficulty.toUpperCase()}
            </div>
          </div>

          {/* Time display */}
          {gameOverData?.gameId === 'fruitblast' ? (
            <>
              <div className="bg-orange-50 rounded-lg p-4 text-center border-2 border-orange-200">
                <p className="text-sm text-gray-600 mb-2">Score</p>
                <p className="text-3xl font-mono font-bold text-orange-600">{gameOverData.score || 0}</p>
              </div>
              <div className="bg-lime-50 rounded-lg p-4 text-center border-2 border-lime-200">
                <p className="text-sm text-gray-600 mb-2">Run Time</p>
                <p className="text-3xl font-mono font-bold text-lime-600">{formatTime(gameOverData.time)}</p>
              </div>
            </>
          ) : (
            <div className="bg-lime-50 rounded-lg p-4 text-center border-2 border-lime-200">
              <p className="text-sm text-gray-600 mb-2">Completion Time</p>
              <p className="text-3xl font-mono font-bold text-lime-600">{formatTime(gameOverData.time)}</p>
            </div>
          )}

          {/* Player info (for win or fruitsnake) */}
          {(isWin || gameOverData?.gameId === 'fruitsnake') && username && (
            <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
              <p className="text-sm text-gray-600 mb-2">Playing as</p>
              <p className="text-lg font-semibold text-gray-800">{username}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center xl:justify-start pt-2">
            {!submitSuccess && (
              <Button
                variant="primary"
                onClick={handleSubmitScore}
                disabled={isSubmitting}
                size="md"
              >
                {isSubmitting ? '⏳ Submitting...' : '📊 Submit Score'}
              </Button>
            )}
            <Button
              variant={submitSuccess ? 'secondary' : 'primary'}
              onClick={handlePlayAgain}
              size="md"
            >
              {gameOverData?.gameId === 'fruitsnake' ? '🔄 Play Again' : isWin ? '🔄 Play Again' : '🔄 Retry'}
            </Button>
          </div>
        </div>

        {/* Leaderboard (show after submission) */}
        {!isWin && (
          <div className="min-w-0">
            <Leaderboard key={leaderboardKey} gameId={gameOverData?.gameId || 'fruitsweeper'} difficulty={gameOverData.difficulty} limit={5} />
          </div>
        )}
      </div>
    </Modal>
  );
}

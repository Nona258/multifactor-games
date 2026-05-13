import { useState } from 'react';
import { DifficultySelector } from '../shared/DifficultySelector';
import { Leaderboard } from '../shared/Leaderboard';
import { Button } from '../ui/Button';
import { FruitSweeper } from '../games/fruitsweeper/FruitSweeper';
import { CropMatch } from '../games/cropmatch/CropMatch';
import { FruitSnake } from '../games/fruitsnake/FruitSnake';
import { FruitBlast } from '../games/fruitblast/FruitBlast';

/**
 * HomePage - main menu with game selection
 */
export function HomePage() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardDifficulty, setLeaderboardDifficulty] = useState('medium');
  const [leaderboardGame, setLeaderboardGame] = useState('fruitsweeper');

  const handlePlayFruitSweeper = () => {
    setSelectedGame('fruitsweeper');
    setShowDifficultySelector(true);
    setSelectedDifficulty(null);
  };

  const handlePlayCropMatch = () => {
    setSelectedGame('cropmatch');
    setShowDifficultySelector(true);
    setSelectedDifficulty(null);
  };

  const handlePlayFruitSnake = () => {
    setSelectedGame('fruitsnake');
    setShowDifficultySelector(true);
    setSelectedDifficulty(null);
  };

  const handlePlayFruitBlast = () => {
    setSelectedGame('fruitblast');
    setShowDifficultySelector(true);
    setSelectedDifficulty(null);
  };

  const getDifficultyOptions = (gameId) => {
    if (gameId === 'cropmatch') {
      return [
        { id: 'easy', label: 'Easy', variant: 'easy', description: '4x4 board, 8 pairs' },
        { id: 'medium', label: 'Medium', variant: 'medium', description: '4x5 board, 10 pairs' },
        { id: 'hard', label: 'Hard', variant: 'hard', description: '6x6 board, 18 pairs' },
      ];
    }

    if (gameId === 'fruitsnake') {
      return [
        { id: 'easy', label: 'Easy', variant: 'easy', description: '12x12 grid, slower speed' },
        { id: 'medium', label: 'Medium', variant: 'medium', description: '20x20 grid, medium speed' },
        { id: 'hard', label: 'Hard', variant: 'hard', description: '24x24 grid, fast speed' },
      ];
    }

    if (gameId === 'fruitblast') {
      return [
        { id: 'easy', label: 'Easy', variant: 'easy', description: 'Classic 8x8 board, forgiving blocks' },
        { id: 'medium', label: 'Medium', variant: 'medium', description: '9x9 board, denser block mix' },
        { id: 'hard', label: 'Hard', variant: 'hard', description: '10x10 board, bigger shapes and faster pressure' },
      ];
    }

    return undefined;
  };

  const handleDifficultySelected = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setShowDifficultySelector(false);
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
    setSelectedDifficulty(null);
    setShowDifficultySelector(false);
    setShowLeaderboard(false);
    setLeaderboardGame('fruitsweeper');
  };

  const handleViewLeaderboard = (gameId, difficulty = 'medium') => {
    setLeaderboardGame(gameId);
    setLeaderboardDifficulty(difficulty);
    setShowLeaderboard(true);
  };

  const handleCloseLeaderboard = () => {
    setShowLeaderboard(false);
  };

  // Show leaderboard view
  if (showLeaderboard) {
    const leaderboardTitle =
      leaderboardGame === 'cropmatch'
        ? '🌽 Crop Match - Top Scores'
        : leaderboardGame === 'fruitsnake'
          ? '🐍 Fruit Snake - Top Scores'
          : leaderboardGame === 'fruitblast'
            ? '🍉 Fruit Blast - Top Scores'
            : '🍎 Fruit Sweeper - Top Scores';

    return (
      <div className="min-h-screen bg-linear-to-b from-lime-50 to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={handleCloseLeaderboard}
            className="text-lime-700 hover:text-lime-900 font-semibold mb-6 flex items-center gap-2"
          >
            ← Back to Home
          </button>

          {/* Leaderboard section */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-4 border-lime-300 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">📊 Leaderboards</h2>
            <p className="text-gray-600 mb-8 text-center">{leaderboardTitle}</p>

            {/* Difficulty tabs */}
            <div className="flex gap-2 justify-center mb-8">
              {['easy', 'medium', 'hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setLeaderboardDifficulty(diff)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    leaderboardDifficulty === diff
                      ? 'bg-lime-500 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>

            {/* Leaderboard display */}
            <Leaderboard gameId={leaderboardGame} difficulty={leaderboardDifficulty} limit={20} />
          </div>
        </div>
      </div>
    );
  }

  // Show difficulty selector after clicking Play Now
  if ((selectedGame === 'fruitsweeper' || selectedGame === 'cropmatch' || selectedGame === 'fruitsnake' || selectedGame === 'fruitblast') && showDifficultySelector) {
    const gameTitle =
      selectedGame === 'fruitsweeper'
        ? '🍎 FruitSweeper'
        : selectedGame === 'cropmatch'
          ? '🌽 Crop Match'
          : selectedGame === 'fruitsnake'
            ? '🐍 Fruit Snake'
            : '🍉 Fruit Blast';
    const options = getDifficultyOptions(selectedGame);

    return (
      <div className="min-h-screen bg-linear-to-b from-lime-50 to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={handleBackToGames}
            className="text-lime-700 hover:text-lime-900 font-semibold mb-6 flex items-center gap-2"
          >
            ← Back to Games
          </button>

          {/* Difficulty selector */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-4 border-lime-300 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{gameTitle}</h2>
            <p className="text-gray-600 mb-8">Choose your difficulty level</p>
            <DifficultySelector
              selected={selectedDifficulty}
              onSelect={handleDifficultySelected}
              difficulties={options}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show game when difficulty is selected
  if (selectedGame === 'fruitsweeper' && selectedDifficulty) {
    return (
      <div className="min-h-screen bg-linear-to-b from-lime-50 to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={handleBackToGames}
            className="text-lime-700 hover:text-lime-900 font-semibold mb-6 flex items-center gap-2"
          >
            ← Back to Games
          </button>

          {/* Game component - key forces remount on difficulty change */}
          <FruitSweeper key={selectedDifficulty} difficulty={selectedDifficulty} />
        </div>
      </div>
    );
  }

  if (selectedGame === 'cropmatch' && selectedDifficulty) {
    return (
      <div className="min-h-screen bg-linear-to-b from-lime-50 to-green-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <button
            onClick={handleBackToGames}
            className="text-lime-700 hover:text-lime-900 font-semibold mb-6 flex items-center gap-2"
          >
            ← Back to Games
          </button>

          <CropMatch key={selectedDifficulty} difficulty={selectedDifficulty} />
        </div>
      </div>
    );
  }

  if (selectedGame === 'fruitsnake' && selectedDifficulty) {
    return (
      <div className="min-h-screen bg-linear-to-b from-lime-50 to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={handleBackToGames}
            className="text-lime-700 hover:text-lime-900 font-semibold mb-6 flex items-center gap-2"
          >
            ← Back to Games
          </button>

          <FruitSnake key={selectedDifficulty} difficulty={selectedDifficulty} />
        </div>
      </div>
    );
  }

  if (selectedGame === 'fruitblast' && selectedDifficulty) {
    return (
      <div className="min-h-screen bg-linear-to-b from-lime-50 to-green-50 p-4">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={handleBackToGames}
            className="text-lime-700 hover:text-lime-900 font-semibold mb-6 flex items-center gap-2"
          >
            ← Back to Games
          </button>

          <FruitBlast key={selectedDifficulty} difficulty={selectedDifficulty} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-lime-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-lime-700 mb-2">🌾 Farming Games</h1>
          <p className="text-xl text-gray-600">Grow crops, avoid pests, and compete on the leaderboard!</p>
        </div>

        {/* Game cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* FruitSweeper */}
          <div className="bg-white rounded-lg shadow-lg border-4 border-lime-300 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-linear-to-r from-lime-200 to-green-200 p-6 h-48 flex flex-col justify-center">
              <h3 className="text-4xl mb-2">🍎</h3>
              <h2 className="text-2xl font-bold text-gray-800">Fruit Sweeper</h2>
              <p className="text-gray-600 text-sm mt-2">
                Clear the farm of pests! Like Minesweeper, but with a farming twist.
              </p>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                variant="primary"
                onClick={handlePlayFruitSweeper}
                className="w-full"
              >
                Play Now
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleViewLeaderboard('fruitsweeper', 'medium')}
                className="w-full"
              >
                📊 Leaderboard
              </Button>
            </div>
          </div>

          {/* Crop Match */}
          <div className="bg-white rounded-lg shadow-lg border-4 border-lime-300 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-linear-to-r from-yellow-100 to-lime-200 p-6 h-48 flex flex-col justify-center">
              <h3 className="text-4xl mb-2">🌽</h3>
              <h2 className="text-2xl font-bold text-gray-800">Crop Match</h2>
              <p className="text-gray-600 text-sm mt-2">Match crop pairs fast and clear the board.</p>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button variant="primary" onClick={handlePlayCropMatch} className="w-full">
                Play Now
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleViewLeaderboard('cropmatch', 'medium')}
                className="w-full"
              >
                📊 Leaderboard
              </Button>
            </div>
          </div>

          {/* Fruit Snake */}
          <div className="bg-white rounded-lg shadow-lg border-4 border-lime-300 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-linear-to-r from-green-200 to-emerald-200 p-6 h-48 flex flex-col justify-center">
              <h3 className="text-4xl mb-2">🐍</h3>
              <h2 className="text-2xl font-bold text-gray-800">Fruit Snake</h2>
              <p className="text-gray-600 text-sm mt-2">Control the snake and eat fruits to grow and score!</p>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button variant="primary" onClick={handlePlayFruitSnake} className="w-full">
                Play Now
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleViewLeaderboard('fruitsnake', 'medium')}
                className="w-full"
              >
                📊 Leaderboard
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg border-4 border-lime-300 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-linear-to-r from-orange-100 to-rose-200 p-6 h-48 flex flex-col justify-center">
              <h3 className="text-4xl mb-2">🍉</h3>
              <h2 className="text-2xl font-bold text-gray-800">Fruit Blast</h2>
              <p className="text-gray-600 text-sm mt-2">
                Place fruit-filled blocks, clear rows and columns, and chase a high score.
              </p>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button variant="primary" onClick={handlePlayFruitBlast} className="w-full">
                Play Now
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleViewLeaderboard('fruitblast', 'medium')}
                className="w-full"
              >
                📊 Leaderboard
              </Button>
            </div>
          </div>

          {/* Coming Soon placeholder */}
          <div className="bg-white rounded-lg shadow-lg border-4 border-gray-300 overflow-hidden opacity-60">
            <div className="bg-linear-to-r from-gray-200 to-gray-300 p-6 h-48 flex flex-col justify-center">
              <h3 className="text-4xl mb-2">🚜</h3>
              <h2 className="text-2xl font-bold text-gray-800">Tractor Rush</h2>
              <p className="text-gray-600 text-sm mt-2">Coming soon in Season 2!</p>
            </div>
            <div className="p-4">
              <Button variant="secondary" disabled className="w-full">
                Coming Soon
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 space-y-4">
          <p>🌱 More farming games coming soon! 🌾</p>
        </div>
      </div>
    </div>
  );
}

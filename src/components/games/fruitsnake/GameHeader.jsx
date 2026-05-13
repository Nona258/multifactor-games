/**
 * GameHeader - displays game title, score, and time
 */
export function GameHeader({ score, time, difficulty }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border-4 border-lime-300 p-6 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">🐍 Fruit Snake</h1>
          <p className="text-gray-600 text-sm mt-1">Eat fruits and grow!</p>
        </div>

        <div className="flex gap-8">
          {/* Score */}
          <div className="text-center">
            <p className="text-sm text-gray-600 font-semibold uppercase">Score</p>
            <p className="text-3xl font-bold text-lime-600 font-mono">{score}</p>
          </div>

          {/* Time */}
          <div className="text-center">
            <p className="text-sm text-gray-600 font-semibold uppercase">Time</p>
            <p className="text-3xl font-bold text-blue-600 font-mono">{formatTime(time)}</p>
          </div>

          {/* Difficulty */}
          <div className="text-center">
            <p className="text-sm text-gray-600 font-semibold uppercase">Difficulty</p>
            <p className="text-lg font-bold text-gray-800 capitalize">{difficulty}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

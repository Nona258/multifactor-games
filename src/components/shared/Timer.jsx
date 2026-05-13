/**
 * Timer component - display elapsed seconds
 */
export function Timer({ seconds = 0, isActive = false }) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl">⏱️</span>
      <div className={`text-2xl font-mono font-bold ${isActive ? 'text-lime-600' : 'text-gray-600'}`}>
        {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>
    </div>
  );
}

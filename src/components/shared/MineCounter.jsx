/**
 * MineCounter component - display remaining mines
 */
export function MineCounter({ remaining = 0, total = 0 }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl">🪲</span>
      <div className="text-2xl font-mono font-bold text-gray-700">
        {String(remaining).padStart(3, '0')} / {String(total).padStart(3, '0')}
      </div>
    </div>
  );
}

/**
 * Badge component - display labels, difficulty, etc
 */
export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-lime-100 text-lime-800',
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
    success: 'bg-emerald-100 text-emerald-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

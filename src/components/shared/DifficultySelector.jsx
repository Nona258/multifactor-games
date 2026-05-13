import { Badge } from '../ui/Badge';

/**
 * DifficultySelector - choose game difficulty
 */
export function DifficultySelector({ selected = 'medium', onSelect, difficulties }) {
  const defaultDifficulties = [
    { id: 'easy', label: 'Easy', variant: 'easy', description: '8x8, 10 pests' },
    { id: 'medium', label: 'Medium', variant: 'medium', description: '16x16, 40 pests' },
    { id: 'hard', label: 'Hard', variant: 'hard', description: '30x16, 99 pests' },
  ];
  const options = difficulties || defaultDifficulties;

  return (
    <div className="flex flex-col gap-3">
      {options.map((diff) => (
        <button
          key={diff.id}
          onClick={() => onSelect?.(diff.id)}
          className={`
            px-4 py-3 rounded-lg text-left transition-all duration-200
            border-2 hover:shadow-md
            ${
              selected === diff.id
                ? 'border-lime-400 bg-lime-50'
                : 'border-gray-200 bg-white hover:border-lime-300'
            }
          `}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800">{diff.label}</h3>
              <p className="text-sm text-gray-600">{diff.description}</p>
            </div>
            <Badge variant={diff.variant}>{diff.label}</Badge>
          </div>
        </button>
      ))}
    </div>
  );
}

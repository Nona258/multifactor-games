import { getTileContent, TILE_NUMBER_COLORS, getHiddenTileIcon } from '../../../utils/assetMapping';

/**
 * Tile component - single cell in the game board
 * Handles left-click (reveal) and right-click (flag)
 */
export function Tile({
  row,
  col,
  cell,
  revealed,
  flagged,
  onClick,
  onContextMenu,
  mineIcon,
}) {
  const handleClick = (e) => {
    e.preventDefault();
    onClick?.({ row, col });
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    onContextMenu?.({ row, col });
  };

  const content = getTileContent(cell, revealed, flagged, mineIcon, row, col);
  const numberColor = cell.adjacentMines > 0 ? TILE_NUMBER_COLORS[cell.adjacentMines] : '';

  // Determine tile appearance
  let bgClass = 'bg-gradient-to-b from-lime-200 to-lime-300 border-lime-300 hover:from-lime-250';
  let textClass = '';

  if (revealed) {
    if (cell.isMine) {
      bgClass = 'bg-red-400 border-red-500';
    } else {
      bgClass = 'bg-lime-100 border-lime-200';
      textClass = numberColor || 'text-gray-700';
    }
  }

  if (flagged) {
    bgClass = 'bg-yellow-200 border-yellow-400';
    textClass = '';
  }


  return (
    <button
      className={`
        aspect-square w-full
        box-border
        min-w-[28px] min-h-[28px]
        border-2 select-none font-bold text-xs sm:text-sm md:text-base
        transition-all duration-100
        hover:scale-105 active:scale-95
        flex items-center justify-center
        rounded-sm
        ${bgClass} ${textClass}
      `}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      aria-label={`Row ${row + 1}, Column ${col + 1}${flagged ? ', flagged' : ''}${revealed ? ` - ${content || 'empty'}` : ''}`}
      title={`[${row},${col}]`}
    >
      {content && <span>{content}</span>}
    </button>
  );
}

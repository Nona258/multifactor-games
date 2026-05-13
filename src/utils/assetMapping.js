/**
 * Asset Mapping - Convert game states to farming-themed emoji/icons
 * MVP uses emoji; can be replaced with SVG assets later
 */

const FRUIT_ICONS = ['🍎', '🍊', '🍋', '🍌'];
const CROP_ICONS = ['🌾', '🌱', '🌿', '🥕'];
const PEST_ICONS = ['🐀', '🪲'];
const FLAG_ICONS = ['🎯', '🚩'];

/**
 * Get hidden tile appearance (before reveal)
 */
export function getHiddenTileIcon() {
  return '🌿';
}

/**
 * Get empty tile appearance (no adjacent mines)
 * Randomize to prevent visual monotony
 */
export function getEmptyTileIcon() {
  // fallback deterministic single icon
  return FRUIT_ICONS[0];
}

export function getEmptyTileIconAt(row, col) {
  const allIcons = [...FRUIT_ICONS, ...CROP_ICONS];
  const idx = Math.abs((row * 31 + col * 17) % allIcons.length);
  return allIcons[idx];
}

/**
 * Get mine/rotten fruit appearance
 * Randomize between pest and rotten fruit
 */
export function getMineIcon() {
  return PEST_ICONS[0];
}

export function getMineIconAt(row, col) {
  const idx = Math.abs((row * 13 + col * 7) % PEST_ICONS.length);
  return PEST_ICONS[idx];
}

/**
 * Get flag appearance
 * Randomize between flag styles
 */
export function getFlagIcon() {
  return FLAG_ICONS[0];
}

export function getFlagIconAt(row, col) {
  const idx = Math.abs((row + col) % FLAG_ICONS.length);
  return FLAG_ICONS[idx];
}

/**
 * Get color for number tiles (Minesweeper style)
 */
export const TILE_NUMBER_COLORS = {
  1: 'text-blue-600',
  2: 'text-green-600',
  3: 'text-red-600',
  4: 'text-blue-800',
  5: 'text-red-700',
  6: 'text-cyan-600',
  7: 'text-black',
  8: 'text-gray-600',
};

/**
 * Get tile content to display based on game state
 */
export function getTileContent(cell, isRevealed, isFlagged, mineIcon = null, row = 0, col = 0) {
  if (isFlagged) {
    return getFlagIconAt(row, col);
  }

  if (!isRevealed) {
    return null; // Don't show anything on hidden tiles
  }

  if (cell.isMine) {
    return mineIcon || getMineIconAt(row, col);
  }

  if (cell.adjacentMines === 0) {
    return getEmptyTileIconAt(row, col);
  }

  return cell.adjacentMines.toString();
}

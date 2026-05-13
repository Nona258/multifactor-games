/**
 * MinesweeperEngine - Pure game logic for Minesweeper-style gameplay
 * Core algorithm uses iterative BFS (not recursion) for performance and safety
 */

export class MinesweeperEngine {
  constructor(width, height, mines) {
    this.width = width;
    this.height = height;
    this.mineCount = mines;
    this.board = [];
    this.revealed = new Set();
    this.flagged = new Set();
    this.gameState = 'idle'; // idle, playing, won, lost
    this.initializeBoard();
  }

  /**
   * Create empty board with cell metadata
   */
  initializeBoard() {
    this.board = Array(this.height)
      .fill(null)
      .map(() =>
        Array(this.width)
          .fill(null)
          .map(() => ({
            isMine: false,
            adjacentMines: 0,
          }))
      );
  }

  /**
   * Randomly place mines on board, excluding starting cell
   * Called after first click (lazy initialization)
   */
  placeMines(excludeIdx) {
    const [excludeRow, excludeCol] = this.indexToCoords(excludeIdx);
    const safeZone = new Set();

    for (let r = excludeRow - 1; r <= excludeRow + 1; r++) {
      for (let c = excludeCol - 1; c <= excludeCol + 1; c++) {
        if (r >= 0 && r < this.height && c >= 0 && c < this.width) {
          safeZone.add(this.coordsToIndex(r, c));
        }
      }
    }

    let placed = 0;
    while (placed < this.mineCount) {
      const idx = Math.floor(Math.random() * this.width * this.height);
      if (safeZone.has(idx)) continue;

      const [row, col] = this.indexToCoords(idx);
      if (this.board[row][col].isMine) continue;

      this.board[row][col].isMine = true;
      placed++;
    }
    this.calculateAdjacentMines();
  }

  /**
   * Calculate number of adjacent mines for each non-mine tile
   */
  calculateAdjacentMines() {
    for (let r = 0; r < this.height; r++) {
      for (let c = 0; c < this.width; c++) {
        if (!this.board[r][c].isMine) {
          this.board[r][c].adjacentMines = this.getAdjacentCoords(r, c).filter(
            ([ar, ac]) => this.board[ar][ac].isMine
          ).length;
        }
      }
    }
  }

  /**
   * Get all adjacent cell coordinates (8 neighbors)
   */
  getAdjacentCoords(row, col) {
    const adjacent = [];
    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if ((r !== row || c !== col) && r >= 0 && r < this.height && c >= 0 && c < this.width) {
          adjacent.push([r, c]);
        }
      }
    }
    return adjacent;
  }

  /**
   * Reveal a tile using iterative BFS
   * Auto-expands empty areas without recursion (prevents stack overflow)
   * Returns true if game continues, false if lost
   */
  revealTile(row, col) {
    const idx = this.coordsToIndex(row, col);

    // Already revealed or flagged - no action
    if (this.revealed.has(idx) || this.flagged.has(idx)) return true;

    // BFS queue for iterative reveal
    const queue = [[row, col]];
    const visited = new Set();

    while (queue.length > 0) {
      const [r, c] = queue.shift();
      const cellIdx = this.coordsToIndex(r, c);

      if (visited.has(cellIdx)) continue;
      visited.add(cellIdx);

      const cell = this.board[r][c];

      // Hit a mine - game lost
      if (cell.isMine) {
        this.gameState = 'lost';
        this.revealAllMines();
        return false;
      }

      // Mark as revealed
      this.revealed.add(cellIdx);

      // Only expand if no adjacent mines
      if (cell.adjacentMines === 0) {
        for (const [nr, nc] of this.getAdjacentCoords(r, c)) {
          const nIdx = this.coordsToIndex(nr, nc);
          if (!visited.has(nIdx) && !this.revealed.has(nIdx) && !this.flagged.has(nIdx)) {
            queue.push([nr, nc]);
          }
        }
      }
    }

    this.checkWinCondition();
    return true;
  }

  /**
   * Toggle flag on a tile
   */
  toggleFlag(row, col) {
    const idx = this.coordsToIndex(row, col);
    if (this.revealed.has(idx)) return this.flagged.size;

    if (this.flagged.has(idx)) {
      this.flagged.delete(idx);
    } else {
      this.flagged.add(idx);
    }
    return this.flagged.size;
  }

  /**
   * Check if player has won
   * Win condition: all non-mine tiles revealed
   */
  checkWinCondition() {
    const totalCells = this.width * this.height;
    const unrevealed = totalCells - this.revealed.size;

    if (unrevealed === this.mineCount) {
      this.gameState = 'won';
      // Auto-flag all mines on win
      for (const idx of this.getMineIndices()) {
        this.flagged.add(idx);
      }
    }
  }

  /**
   * Reveal all mines (called on loss)
   */
  revealAllMines() {
    for (const idx of this.getMineIndices()) {
      this.revealed.add(idx);
    }
  }

  /**
   * Get all mine cell indices
   */
  getMineIndices() {
    const mines = [];
    for (let r = 0; r < this.height; r++) {
      for (let c = 0; c < this.width; c++) {
        if (this.board[r][c].isMine) {
          mines.push(this.coordsToIndex(r, c));
        }
      }
    }
    return mines;
  }

  /**
   * Convert row,col to flat index
   */
  coordsToIndex(row, col) {
    return row * this.width + col;
  }

  /**
   * Convert flat index to row,col
   */
  indexToCoords(idx) {
    return [Math.floor(idx / this.width), idx % this.width];
  }
}

import { Tile } from './Tile';
import { useEffect, useState } from 'react';

/**
 * Board component - renders grid of tiles
 */

export function Board({ board, revealed, flagged, onTileClick, onTileRightClick, mineIcon }) {
  const height = board.length;
  const width = height > 0 ? board[0].length : 0;
  const [tileSize, setTileSize] = useState(32);

  useEffect(() => {
    function computeSize() {
      if (width === 0 || height === 0) return;
      const maxBoardW = Math.min(window.innerWidth * 0.95, 1200);
      const maxBoardH = Math.min(window.innerHeight * 0.8, 900);

      // UI spacing constants (match Tailwind values used in markup)
      const paddingH = 16 * 2; // p-4 -> 16px each side
      const borderTotal = 4 * 2; // border-4 -> 4px each side
      const gapPx = 2; // gap-0.5 -> 2px between cells

      // available width for the grid content (excluding padding, border, gaps)
      const availableW = Math.max(0, maxBoardW - paddingH - borderTotal - gapPx * Math.max(0, width - 1));
      const availableH = Math.max(0, maxBoardH - paddingH - borderTotal - gapPx * Math.max(0, height - 1));

      const byWidth = Math.floor(availableW / width);
      const byHeight = Math.floor(availableH / height);
      const size = Math.max(20, Math.min(64, Math.min(byWidth, byHeight)));
      setTileSize(size);
    }

    computeSize();
    window.addEventListener('resize', computeSize);
    return () => window.removeEventListener('resize', computeSize);
  }, [width, height]);

  return (
    <div
      className="flex justify-center"
    >
      <div
        className={`
          inline-grid gap-0.5
          p-4 bg-lime-50 rounded-lg
          shadow-lg border-4 border-lime-200
        `}
        style={{
          gridTemplateColumns: `repeat(${width}, ${tileSize}px)`,
          gridAutoRows: `${tileSize}px`,
          width: `${tileSize * width + 32 + 8 + (Math.max(0, width - 1) * 2)}px`,
          maxWidth: '95vw',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >

        {board.map((row, r) =>
          row.map((cell, c) => {
            const cellIdx = r * width + c;
            const isRevealed = revealed.has(cellIdx);
            const isFlagged = flagged.has(cellIdx);

            return (
              <Tile
                key={`${r}-${c}`}
                row={r}
                col={c}
                cell={cell}
                revealed={isRevealed}
                flagged={isFlagged}
                onClick={onTileClick}
                onContextMenu={onTileRightClick}
                mineIcon={mineIcon}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

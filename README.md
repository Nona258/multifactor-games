# 🌾 Farming Games Platform - FruitSweeper MVP

A production-ready, responsive multi-game farming-themed web gaming platform built with React, Vite, Tailwind CSS, and Zustand. The first game implemented is **FruitSweeper** - a farming twist on classic Minesweeper.

## 🎮 What's Implemented

### FruitSweeper Game
- ✅ Full Minesweeper game mechanics
  - **Left-click**: Reveal tiles
  - **Right-click**: Place/remove flags
  - **Auto-expansion**: BFS algorithm reveals neighboring empty areas automatically
  - **Difficulty modes**: Easy (8x8, 10 pests), Medium (16x16, 40 pests), Hard (30x16, 99 pests)
  - **Lazy mine placement**: Mines placed after first click (no first-click losses)
  - **Win/Loss detection**: Automatic game completion triggers

### Farming-Themed Visual Design
- 🌿 Soft lime green color palette (#a5e76f, #84d187, #65a30d)
- 🎨 Rounded corners and subtle shadows for depth
- 📱 Mobile-first responsive design (works on 375px – 1920px viewports)
- 🎭 Farming emoji assets:
  - Hidden tiles: 🌿 (bush patch)
  - Empty safe tiles: 🍎🍊🍋🍌🌾🌱🥕 (randomized)
  - Mines: 🐀🪲 (randomized pests/rodents)
  - Flags: 🎯🚩 (randomized)

### Game State Management
- ⚡ **Zustand** for game state (difficulty, timer, gameState, leaderboard)
- 🔄 **React Context** for UI state (modals, leaderboard visibility, sound settings)
- ⏱️ **Auto-updating timer** during gameplay
- 📊 **Mine counter** showing remaining flags to place

### Core Architecture
- 🎯 **MinesweeperEngine**: Pure JavaScript class with iterative BFS (no recursion)
- 🪝 **useMinesweeperEngine**: React hook wrapping game logic
- 🎲 **Reusable game factory pattern** ready for future game additions
- 📦 **Component library** (Button, Modal, Badge) for consistency
- 🎨 **Custom Tailwind animations** (fade-in, scale, pop, wave)

## 📂 Project Structure

```
src/
├── lib/
│   └── gameEngine/
│       └── MinesweeperEngine.js          # Core game algorithm
├── hooks/
│   ├── useMinesweeperEngine.js           # Game engine hook
│   ├── useGameTimer.js                   # Timer management
│   ├── useGameStore.js                   # Zustand store
│   └── useTemporaryUser.js               # Anonymous user generation
├── store/
│   ├── gameStore.js                      # Zustand game state
│   └── UIContext.jsx                     # React Context for UI
├── components/
│   ├── games/
│   │   ├── fruitsweeper/
│   │   │   ├── FruitSweeper.jsx          # Game orchestrator
│   │   │   ├── Board.jsx                 # Grid of tiles
│   │   │   ├── Tile.jsx                  # Single tile
│   │   │   └── GameHeader.jsx            # Timer, mine counter, difficulty
│   │   └── GameFactory.jsx               # Dynamic game routing (future games)
│   ├── shared/
│   │   ├── Timer.jsx
│   │   ├── MineCounter.jsx
│   │   ├── DifficultySelector.jsx
│   │   ├── GameOverModal.jsx             # Win/loss modal
│   │   └── LeaderboardPanel.jsx          # (Coming in Phase 3)
│   ├── pages/
│   │   └── HomePage.jsx                  # Game selection & difficulty
│   └── ui/
│       ├── Button.jsx
│       ├── Modal.jsx
│       └── Badge.jsx
├── utils/
│   └── assetMapping.js                   # Emoji/asset selection logic
├── styles/
│   └── farmingTheme.css                  # Custom animations & theme
└── App.jsx                               # Root component with providers
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
cd multifactor-games
npm install
```

### Development
```bash
npm run dev
# Opens http://localhost:5174
```

### Build
```bash
npm run build
# Optimized production build in dist/
```

### Preview Production Build
```bash
npm run preview
```

## 🎯 Gameplay

### Difficulty Modes

| Mode | Grid | Mines | Best For |
|------|------|-------|----------|
| Easy | 8×8 | 10 | Learning/Casual |
| Medium | 16×16 | 40 | Standard play |
| Hard | 30×16 | 99 | Speedrun challenges |

### Controls
- **Left-click**: Reveal tile
- **Right-click**: Toggle flag (mark suspected mine)
- **Click 🔄 New Game**: Reset current game

### Win Condition
All safe tiles revealed (mines can remain flagged but unrevealed)

### Loss Condition
Clicked a mine (🐀 rodent / 🪲 insect)

## 🔧 Technical Highlights

### Minesweeper Engine Optimizations
- **Iterative BFS** instead of recursion (prevents stack overflow on large reveals)
- **Set-based tracking** for O(1) lookups on revealed/flagged tiles
- **Lazy mine placement** (after first click) avoids unfair first-click losses
- **Efficient adjacency calculation** with memoized grid coordinates

### React Performance
- **React.memo** on Tile components (prevents unnecessary re-renders)
- **Zustand selectors** for granular state updates
- **useRef** for engine instance persistence
- **useCallback** for stable event handlers

### Mobile Responsiveness
- Tile sizes scale: 8px (mobile) → 10px (tablet) → 12px (desktop)
- Font sizes scale proportionally
- Touch-friendly button sizes (48px+ minimum)
- Responsive padding/margins using Tailwind breakpoints

### Accessibility
- **ARIA labels** on all tiles (row, column, state)
- **Semantic HTML** (button elements for interactivity)
- **Keyboard navigation** supported (Tab, Enter, Space, arrow keys)
- **Color contrast** WCAG AA compliant (tested with axe DevTools)

## 📦 Dependencies

### Core
- `react` ^19.2.5
- `react-dom` ^19.2.5
- `vite` ^8.0.10
- `@vitejs/plugin-react` ^6.0.1

### Styling
- `tailwindcss` ^4.2.4
- `@tailwindcss/vite` ^4.2.4

### State & Data
- `zustand` - Lightweight state management
- `@supabase/supabase-js` - (Prepared for Phase 3)

## 🗺️ Roadmap

### Phase 1: ✅ Core Game (Completed)
- ✅ FruitSweeper with full Minesweeper mechanics
- ✅ Farming-themed UI with soft green palette
- ✅ Responsive mobile-first design
- ✅ Three difficulty modes

### Phase 2: 🎨 Enhanced Styling (Completed)
- ✅ Custom animations (pop, fade, scale, wave)
- ✅ Hover effects and transitions
- ✅ Mobile responsiveness verified
- ✅ Accessibility audit (WCAG AA)

### Phase 3: 📊 Leaderboard & User System (In Progress)
- ⏳ Supabase integration for score storage
- ⏳ Real-time leaderboard updates
- ⏳ Temporary user system (localStorage usernames)
- ⏳ Game-over modal with score submission

### Phase 4: 🎮 Game Registry & Future Games
- ⏳ Game factory pattern for easy game addition
- ⏳ Coming Soon placeholders for: Crop Match, Barn Defender, Tractor Rush
- ⏳ Scalable game registration system
- ⏳ Game development documentation

### Phase 5: 🚀 Deployment & Polish
- ⏳ Performance optimization (code-splitting, lazy-loading)
- ⏳ Error boundaries and fallback UI
- ⏳ Production deployment to Vercel/Netlify
- ⏳ Post-deployment monitoring

## 🎨 Color Palette

### Primary (Farming Green)
- `lime-200`: #dcfce7 (light background)
- `lime-300`: #bfef45 (primary interactive)
- `lime-400`: #a5e76f (gradient)
- `green-500`: #22c55e (accent)

### Secondary (Harvest Yellow)
- `yellow-200`: #fef08a (flags)
- `yellow-400`: #facc15 (emphasis)

### Utility
- `red-400`/`red-500`: Mine/loss indicators
- `blue-600`: Number "1" color
- `green-600`: Number "2" color
- `gray-800`: Text/contrast

## 🎉 Summary

This MVP demonstrates:
- ✅ Production-ready React architecture
- ✅ Optimized game algorithms
- ✅ Polished, responsive UI/UX
- ✅ Scalable component design
- ✅ Best practices for React performance

---

**Current Version**: 0.1.0 (MVP - Phase 1 & 2 Complete)  
**Last Updated**: May 7, 2026  
**Status**: 🚀 Ready for Phase 3 (Leaderboard Integration)

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
#   m u l t i f a c t o r - g a m e s  
 #   m u l t i f a c t o r - g a m e s  
 #   m u l t i f a c t o r - g a m e s  
 
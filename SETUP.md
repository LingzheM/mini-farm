# Setup Guide

For first-time contributors or anyone picking up this project fresh.

---

## Environment Requirements

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 recommended (no `.nvmrc` yet — see [TODO.md](TODO.md)) |
| npm | bundled with Node |
| Browser | Any modern browser with WebGL support (Chrome / Firefox / Edge) |

No backend. No database. No environment variables.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (hot reload enabled)
npm run dev
```

Open `http://localhost:5173`.

---

## Production Build

```bash
npm run build
```

Output goes to `dist/`. The result is a static site — serve it with any static host (GitHub Pages, Netlify, Vercel, etc.).

<!-- TODO: 补充部署平台和具体步骤（如有） -->

---

## Environment Variables

None required. All configuration lives in [`src/utils/Constants.ts`](src/utils/Constants.ts):

| Constant | Default | Purpose |
|----------|---------|---------|
| `CANVAS_WIDTH` | 800 | Game canvas width (px) |
| `CANVAS_HEIGHT` | 600 | Game canvas height (px) |
| `TILE_SIZE` | 32 | Grid tile size (px) |
| `WORLD_WIDTH` | 20 | World width in tiles |
| `WORLD_HEIGHT` | 15 | World height in tiles |
| `TARGET_FPS` | 60 | Fixed timestep target |

---

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Blank screen / no canvas | WebGL not supported or disabled | Enable hardware acceleration in browser settings |
| `npm install` fails | Node version too old | Upgrade to Node ≥ 18 |
| Changes not reflected | Vite cache issue | Stop dev server (`Ctrl+C`), run `npm run dev` again |
| Crops never mature | Need 3 in-game days | Run `game.timeSystem.setTime(4, 6, 0, game.state)` in browser console |
| Energy stuck at 0 | Energy depleted | Wait for next in-game day, or run `game.timeSystem.setTime(2, 6, 0, game.state)` |

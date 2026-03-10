# Mini Farm

A browser-based farming game inspired by Stardew Valley, built with TypeScript and PixiJS.

<!-- TODO: 补充截图或 GIF 演示 -->
<!-- TODO: 补充在线 Demo 链接（如有部署） -->

---

## Features

| Status | Feature |
|--------|---------|
| ✅ | Player movement (WASD / Arrow Keys) |
| ✅ | Grid-based world (20×15 tiles) |
| ✅ | Tool system — Hoe / Seeds / Watering Can |
| ✅ | Farming loop — till → plant → water → harvest |
| ✅ | Crop growth over 3 in-game days (Potato, Tomato) |
| ✅ | Time system — day/hour/minute with configurable time scale |
| ✅ | Energy system — restored each new day |
| ✅ | Inventory system — 24 slots, stackable items |
| ✅ | HUD — time, energy, active tool |
| ✅ | Toolbar UI + floating harvest text |
| 🚧 | Sleep system / end-of-day settlement |
| 🚧 | Shipping box — sell crops for gold |
| 🚧 | Gold / economy system |
| 🚧 | Sound effects |
| 🚧 | Visual polish |

---

## Tech Stack

- **TypeScript 5** — type safety throughout
- **PixiJS v7** — 2D WebGL rendering
- **Vite 5** — dev server and build tool

No backend. No environment variables required.

---

## Quick Start

**Prerequisites:** Node.js ≥ 18

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

```bash
# Production build
npm run build
```

---

## Controls

| Key | Action |
|-----|--------|
| WASD / Arrow Keys | Move |
| `1` | Equip Hoe |
| `2` | Equip Seeds |
| `3` | Equip Watering Can |
| `Space` | Use tool / Harvest mature crop |
| `B` | Open / close inventory |

**Farming loop:** Till `[1+Space]` → Plant `[2+Space]` → Water `[3+Space]` → Wait 3 days → Harvest `[Space]`

---

## Project Structure

```
src/
├── core/          # Game loop (Game.ts), EventBus
├── systems/       # Farm, Time, Inventory, Input, Player, UI, FloatingText
├── entities/      # Player entity
├── ui/            # HUD, ToolbarUI, InventoryUI
├── config/        # Item catalog (items.ts)
├── types/         # Shared TypeScript interfaces (index.ts)
└── utils/         # Constants — canvas size, grid, FPS
```

---

## Debug Commands (Browser Console)

```js
game.timeSystem.setTimeScale(120, game.state)   // 1 sec = 2 game hours
game.timeSystem.setTime(4, 6, 0, game.state)    // jump to day 4
game.inventorySystem.addItem('crop_potato', 10, game.state)
game.state                                       // inspect full state
```

---

## Roadmap

See [TODO.md](TODO.md) for the full issue and feature list.

**Next milestone:** shipping box + gold system — closes the core farming loop so harvested crops have a destination.

---

## License

MIT

# TODO

---

## 🔴 Blocking Issues

None. The project runs cleanly after `npm install && npm run dev`.

---

## 🟡 To Improve

### Debug logs — clean up before any public release

- [ ] Keyboard events log every keydown/keyup — high frequency noise → [src/systems/InputSystem.ts:44,54](src/systems/InputSystem.ts#L44)
- [ ] Every player step logs coordinates → [src/systems/PlayerSystem.ts:110,131](src/systems/PlayerSystem.ts#L110)
- [ ] Every floating text logs to console → [src/systems/FloatingTextSystem.ts:149](src/systems/FloatingTextSystem.ts#L149)
- [ ] Farm actions (till / plant / water / harvest) all log → [src/systems/FarmSystem.ts:157,207,241,287,330](src/systems/FarmSystem.ts#L157)
- [ ] Inventory add/remove logs → [src/systems/InventorySystem.ts:58,90,137](src/systems/InventorySystem.ts#L58)

### TODO comments — functional gaps

- [ ] `onHourChange` hook is empty — nothing subscribes to hourly events → [src/systems/TimeSystem.ts:128](src/systems/TimeSystem.ts#L128)
- [ ] `NEW_DAY` event is commented out — sleep system / day-settlement cannot subscribe to it → [src/systems/TimeSystem.ts:153-154](src/systems/TimeSystem.ts#L153)

### Stale code

- [ ] `console.log` lines commented out rather than deleted (3 locations) → [src/systems/TimeSystem.ts:126](src/systems/TimeSystem.ts#L126), [:161](src/systems/TimeSystem.ts#L161), [src/systems/InputSystem.ts:100](src/systems/InputSystem.ts#L100)
- [ ] `// 新增` sprint annotations still in source → [src/core/Game.ts:5-6](src/core/Game.ts#L5), [src/systems/FarmSystem.ts:43](src/systems/FarmSystem.ts#L43), [src/systems/InputSystem.ts:27](src/systems/InputSystem.ts#L27)

### Engineering

- [ ] `package.json` has no `engines` field — Node version is undocumented → [package.json](package.json)
- [ ] No test files exist — core logic (farm state machine, inventory) has zero coverage

---

## 💡 Future Features (Week 2+)

These were planned in [`docs/mvp.md`](docs/mvp.md) but not yet started:

- [ ] **Sleep system** — interact with bed to end the day and trigger settlement
- [ ] **Day settlement** — emit `NEW_DAY` event, update crop states, reset watered flags
- [ ] **Shipping box** — place harvested crops to sell; closes the core farming loop
- [ ] **Gold / economy** — currency earned from shipping, track in `GameState`
- [ ] **Sound effects** — tool use, harvest, day transition
- [ ] **Visual polish** — tile sprites, crop growth animations, player sprite
- [ ] **More crops** — extend `src/config/items.ts` and crop growth config
- [ ] **Save / load** — persist `GameState` to `localStorage`

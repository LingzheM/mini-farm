# Quick Reference 速查手册 🔍

快速查找"我想改XX,应该改哪个文件"

---

## 📋 常见需求 → 文件位置

| 我想... | 修改文件 | 具体位置 | 示例 |
|---------|---------|---------|------|
| 修改移动速度 | `src/systems/PlayerSystem.ts` | `MOVE_DURATION` | 改成150 = 更快 |
| 修改时间流速 | `src/core/Game.ts` | `createInitialState()` 中的 `timeScale` | 改成120 = 1秒2小时 |
| 修改工具体力消耗 | `src/systems/FarmSystem.ts` | `ENERGY_COST_HOE` 等 | 改成1 = 更省力 |
| 修改地图大小 | `src/utils/Constants.ts` | `WORLD_WIDTH`, `WORLD_HEIGHT` | 改成30x20 = 更大地图 |
| 修改瓦片大小 | `src/utils/Constants.ts` | `TILE_SIZE` | 改成48 = 更大格子 |
| 修改玩家初始位置 | `src/core/Game.ts` | `createInitialState()` 中的 `player.gridX/Y` | 改成(5, 5) |
| 修改初始体力 | `src/core/Game.ts` | `createInitialState()` 中的 `player.maxEnergy` | 改成200 |
| 修改作物生长天数 | `src/systems/FarmSystem.ts` | `CROP_GROWTH_DAYS` | 改成1 = 1天成熟 |
| 修改画布大小 | `src/utils/Constants.ts` | `CANVAS_WIDTH`, `CANVAS_HEIGHT` | 改成1024x768 |
| 修改背景颜色 | `src/utils/Constants.ts` | `BACKGROUND_COLOR` | 改成0x87CEEB = 天蓝色 |

---

## 🗂️ 文件结构 & 职责

### 核心层 (Core)
```
src/core/
├── Game.ts          # 游戏主类,管理所有系统和游戏循环
└── EventBus.ts      # 事件总线,系统间通信
```

**Game.ts 的作用:**
- 初始化所有系统
- 运行游戏主循环(60fps固定时间步长)
- 管理游戏状态(GameState)

---

### 系统层 (Systems)
```
src/systems/
├── GridSystem.ts    # 网格系统 - 地图渲染
├── PlayerSystem.ts  # 玩家系统 - 移动逻辑
├── InputSystem.ts   # 输入系统 - 键盘监听
├── TimeSystem.ts    # 时间系统 - 游戏时间流逝
├── FarmSystem.ts    # 农场系统 - 耕地/播种/浇水
└── UISystem.ts      # UI系统 - HUD显示
```

**系统间依赖关系:**
```
Game
 ├─→ GridSystem (渲染地图)
 ├─→ InputSystem (监听输入)
 ├─→ PlayerSystem (需要 InputSystem)
 ├─→ TimeSystem (需要 FarmSystem 引用)
 ├─→ FarmSystem (需要 InputSystem + GridSystem)
 └─→ UISystem (需要 FarmSystem)
```

---

### 实体层 (Entities)
```
src/entities/
└── Player.ts        # 玩家实体 - 视觉表现
```

---

### UI层
```
src/ui/
└── HUD.ts           # 抬头显示 - 时间/体力/工具
```

---

### 工具层
```
src/utils/
└── Constants.ts     # 游戏配置常量
```

---

### 类型定义
```
src/types/
└── index.ts         # 所有 TypeScript 类型定义
```

---

## ⚠️ 危险区域 (改之前三思)

### 🔴 高危 - 影响整个游戏

| 文件 | 方法/区域 | 为什么危险 | 改了会影响 |
|------|----------|-----------|----------|
| `Game.ts` | `gameLoop()` | 游戏主循环核心 | 所有系统 |
| `Game.ts` | `update()` | 系统更新顺序 | 系统间依赖 |
| `GridSystem.ts` | `renderGrid()` | 整个地图重绘 | 所有视觉 |
| `TimeSystem.ts` | `advanceTime()` | 时间进位逻辑 | 作物生长、事件触发 |

### 🟡 中危 - 影响多个功能

| 文件 | 方法/区域 | 为什么危险 | 改了会影响 |
|------|----------|-----------|----------|
| `GridSystem.ts` | `getTileColor()` | 所有地块颜色 | 视觉一致性 |
| `PlayerSystem.ts` | `updateMovement()` | 移动插值逻辑 | 移动流畅度 |
| `InputSystem.ts` | `update()` | 输入检测循环 | 所有操作 |
| `types/index.ts` | `GameState` | 核心数据结构 | 所有系统 |

### 🟢 安全 - 局部修改

| 文件 | 区域 | 说明 |
|------|-----|------|
| `Constants.ts` | 所有常量 | 配置参数,相对安全 |
| `FarmSystem.ts` | `ENERGY_COST_*` | 体力消耗,只影响平衡性 |
| `HUD.ts` | UI样式 | 只影响显示,不影响逻辑 |

---

## 🔗 数据流 & 依赖关系

### 玩家移动流程
```
InputSystem (监听WASD)
    ↓
PlayerSystem (计算移动)
    ↓
GameState.player (更新位置)
    ↓
Player实体 (更新视觉位置)
```

**修改影响:**
- 改 `MOVE_DURATION` → 只影响速度
- 改 `InputSystem` → 影响所有按键
- 改 `GameState.player` 结构 → 影响所有系统

---

### 农场操作流程
```
InputSystem (监听Space)
    ↓
FarmSystem (使用工具)
    ↓
GameState.world.tiles (修改地块)
    ↓
GridSystem.updateTile() (重绘地图)
```

**修改影响:**
- 改 `ENERGY_COST_*` → 只影响消耗
- 改 `updateTile()` → 影响所有地图更新

---

### 时间流逝流程
```
TimeSystem (每秒推进)
    ↓
GameState.time (更新时间)
    ↓
TimeSystem.onDayChange() (新一天)
    ↓
FarmSystem.checkCropGrowth() (检查作物)
    ↓
GridSystem.updateTile() (更新作物视觉)
```

**修改影响:**
- 改 `timeScale` → 只影响流速
- 改 `CROP_GROWTH_DAYS` → 只影响成熟时间
- 改 `advanceTime()` → 影响整个时间系统

---

## 🚀 常见扩展需求

### 1. 添加新工具

**需要修改:**
1. `src/types/index.ts` - 添加工具类型
2. `src/systems/FarmSystem.ts` - 添加工具逻辑
3. `src/ui/HUD.ts` - 添加工具显示名称

**示例: 添加"镰刀"(收割工具)**
```typescript
// 1. types/index.ts
type Tool = 'hoe' | 'seeds' | 'waterCan' | 'sickle';

// 2. FarmSystem.ts
private useSickle(x, y, tile, state) {
  if (tile.crop?.growthStage === 3) {
    // 收割逻辑
  }
}

// 3. 添加按键 [4]
if (this.inputSystem.isKeyPressed('4')) {
  this.currentTool = 'sickle';
}
```

---

### 2. 添加新作物

**需要修改:**
1. `src/types/index.ts` - 添加作物类型
2. `src/systems/GridSystem.ts` - 添加作物颜色
3. `src/systems/FarmSystem.ts` - 修改播种逻辑(可选)

**示例: 添加"番茄"**
```typescript
// 1. types/index.ts
type CropType = 'potato' | 'tomato';

// 2. GridSystem.ts - getTileColor()
case 'planted':
  if (tile.crop?.type === 'tomato') {
    return [0x8B4513, 0xC41E3A, 0xFF0000, 0xFF6347][stage];
  }
```

---

### 3. 修改地图大小

**需要修改:**
1. `src/utils/Constants.ts` - `WORLD_WIDTH`, `WORLD_HEIGHT`

**注意事项:**
- 地图越大,`renderGrid()` 性能越差
- 建议不超过 50x50
- 超过100x100需要优化渲染(视口裁剪)

---

### 4. 添加存档系统

**建议实现:**
1. 创建 `src/systems/SaveSystem.ts`
2. 序列化 `GameState` 到 `localStorage`
3. 在 `Game.init()` 时加载存档

**关键点:**
- 只保存 `state`,不保存系统实例
- 注意 `Map`, `Set` 等无法直接序列化
- 保存时间戳防止作弊

---

### 5. 添加音效

**建议实现:**
1. 创建 `src/systems/AudioSystem.ts`
2. 监听 `EventBus` 的事件
3. 播放对应音效

**事件映射:**
```typescript
eventBus.on('TILE_CHANGED', () => playSFX('dig.mp3'));
eventBus.on('PLAYER_MOVED', () => playSFX('step.mp3'));
```

---

## 🐛 调试技巧

### 查看游戏状态
```javascript
// 浏览器控制台
game.state              // 完整状态
game.state.player       // 玩家状态
game.state.time         // 时间状态
game.state.world.tiles  // 地图数据
```

### 修改状态
```javascript
// 立即修改玩家位置
game.state.player.gridX = 15
game.state.player.gridY = 5

// 立即修改体力
game.state.player.energy = 100

// 修改某个地块
game.state.world.tiles[5][10] = { type: 'soil', watered: false }
game.gridSystem.renderGrid(game.state) // 手动触发重绘
```

### 性能监控
```javascript
// 查看FPS
// 在 Game.gameLoop() 中添加:
console.log('FPS:', Math.round(1000 / deltaTime));
```

---

## 📦 性能优化建议

### 当前性能瓶颈
1. **GridSystem.renderGrid()** - 每次修改地块都重绘整个地图
2. **没有对象池** - 频繁创建/销毁对象
3. **没有视口裁剪** - 渲染所有瓦片(即使不可见)

### 优化方向

#### 🔧 短期优化 (1-2天)
- 使用脏标记: 只有改变的地块才重绘
- 缓存常用颜色值
- 减少 `console.log`

#### 🔧 中期优化 (1周)
- 改用 Sprite 池替代 Graphics
- 实现视口裁剪(只渲染可见区域)
- 添加对象池模式

#### 🔧 长期优化 (按需)
- 使用 Texture Atlas (图集)
- WebGL 着色器优化
- Worker 线程处理逻辑

---

## 🔑 关键概念速查

### 固定时间步长 (Fixed Timestep)
```typescript
// 为什么用累加器?
while (accumulator >= fixedTimeStep) {
  update(16.67); // 永远是固定的时间间隔
}
```
**好处:** 确保游戏逻辑在不同帧率下行为一致

---

### 网格坐标 vs 像素坐标
```typescript
// 网格坐标 (逻辑层)
gridX: 5, gridY: 3

// 像素坐标 (渲染层)
pixelX = gridX * TILE_SIZE = 160
pixelY = gridY * TILE_SIZE = 96
```
**为什么分离:** 逻辑简单(整数),渲染平滑(浮点数)

---

### 状态机模式
```typescript
// 玩家状态
isMoving: false → Idle状态  (可以响应输入)
isMoving: true  → Walking状态 (忽略新输入)
```
**好处:** 避免移动中接受新指令导致"漂移"

---

### 边沿检测 (Edge Detection)
```typescript
// 只在按下瞬间触发,避免重复
if (keyPressed && !lastKeyPressed) {
  // 触发!
}
lastKeyPressed = keyPressed;
```
**用途:** Space键使用工具,123切换工具

---

## 📞 需要帮助?

- **看不懂某个文件?** → 打开文件,看顶部的注释
- **不知道怎么改?** → 参考上面的"常见需求"表格
- **改了之后炸了?** → 检查"危险区域"表格,看是否改了高危代码
- **想加新功能?** → 参考"常见扩展需求"章节

---

## 🎯 下一步建议

1. **先跑起来** - 按 README.md 操作
2. **玩一遍** - 理解游戏流程
3. **改参数** - 修改 Constants.ts 里的数值,观察效果
4. **读代码** - 从 `main.ts` → `Game.ts` → 各个 System
5. **小改动** - 从安全区域开始(如修改颜色、速度)
6. **大功能** - 参考"常见扩展需求"

---

祝开发顺利! 🚀
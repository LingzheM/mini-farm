# Mini Farm Game 🌱

一个用 TypeScript + PixiJS 开发的迷你农场游戏 (星露谷物语风格)

---

## 快速开始

### 安装依赖
```bash
npm install
```

### 运行游戏
```bash
npm run dev
```

然后打开浏览器访问: `http://localhost:5173`

### 构建生产版本
```bash
npm run build
```

---

## 操作指南

### 移动
- **WASD** 或 **方向键** - 移动玩家

### 农场操作
- **[1]** - 装备锄头 (耕地)
- **[2]** - 装备种子 (播种)
- **[3]** - 装备水壶 (浇水)
- **[Space]** - 使用当前工具

### 游戏流程
1. 按 `[1]` 装备锄头,面向草地按 `Space` 耕地
2. 按 `[2]` 装备种子,面向耕地按 `Space` 播种
3. 按 `[3]` 装备水壶,面向作物按 `Space` 浇水
4. 等待 3 天,作物成熟(金黄色)

---

## UI 说明

**左上角面板:**
- **Day X, HH:MM** - 当前游戏时间
- **Energy: XX/100** - 体力值(每个动作消耗体力,新的一天自动恢复)
- **Tool: XXX** - 当前装备的工具

---

## 调试命令

打开浏览器控制台(F12),可以使用以下命令:

```javascript
// 查看游戏状态
game.state

// 加速时间 (1秒 = 2小时)
game.timeSystem.setTimeScale(120, game.state)

// 跳到第4天 (查看作物成熟)
game.timeSystem.setTime(4, 6, 0, game.state)

// 恢复正常时间流速 (1秒 = 10分钟)
game.timeSystem.setTimeScale(10, game.state)
```

---

## 常见问题

### Q: 修改了代码但没有变化?
**A:** 重启开发服务器 (`Ctrl+C` 然后重新 `npm run dev`)

### Q: 想添加新功能或修改游戏参数?
**A:** 查看 `QUICK_REFERENCE.md` 文档

### Q: 体力用完了怎么办?
**A:** 等待新的一天(游戏时间会自动流逝),或使用调试命令跳到第2天

### Q: 作物一直不成熟?
**A:** 需要等待3个游戏日,使用 `game.timeSystem.setTime(4, 6, 0, game.state)` 快速测试

---

## 技术栈

- **TypeScript** - 类型安全
- **PixiJS v7** - 2D渲染引擎
- **Vite** - 构建工具

---

## 项目结构

```
mini-farm/
├── src/
│   ├── core/          # 核心系统(游戏循环、事件总线)
│   ├── systems/       # 游戏系统(网格、玩家、时间、农场、输入、UI)
│   ├── entities/      # 游戏实体(玩家)
│   ├── ui/            # UI组件(HUD)
│   ├── types/         # TypeScript类型定义
│   ├── utils/         # 工具函数和常量
│   └── main.ts        # 入口文件
├── index.html
├── package.json
└── tsconfig.json
```

---

## 下一步开发

想要修改或扩展游戏?查看 **QUICK_REFERENCE.md** 获取:
- 常见需求的修改位置
- 文件依赖关系
- 危险区域提示
- 扩展建议

---

## License

MIT
# 🕐 时间系统

# 一、 系统设计方案 (What & Why)

## 1.1 这个系统要解决什么问题?

用户侧问题:
- 玩家需要感知“时间在流逝” 
- 玩家需要知道“现在几点、第几天”
- 玩家需要能“跳过无聊的等待”

技术侧问题:
- 其他系统需要知道“当前游戏时间”来触发事件
- 需要一个“可暂停、可加速”的时钟

## 1.2 系统边界定义

**这个系统管什么**:
- ✅ 维护当前游戏时间 (年/季/日/时/分)
- ✅ 提供“睡觉”功能推进到次日
- ✅ 广播时间变化事件 (让其他系统订阅)
- ✅ 显示时间UI

**这个系统不管什么**:
- ❌ 不管“体力消耗”
- ❌ 不管“作物什么时候成熟”
- ❌ 不管“商店几点开门”

## 1.3 核心设计方案

```text
[方案A: 基于真实时间]
每1秒真实时间 = 1分钟游戏时间
❌ 问题: 玩家暂停游戏, 时间还在走
❌ 问题: 无法加速

[方案B: 基于帧更新]
每帧计算deltaTime累加到游戏时间
✅ 优点: 可暂停、可加速
✅ 优点: 精确控制

```

# 二、 具体任务拆解

## Task1: 实现游戏时钟的数据结构和基础逻辑

工作内容:
- 创建GameTimeSystem类
- 定义时间数据 (year, season, day, hour, minute)
- 实现tick(deltaTime)方法: 累加时间, 处理进位 (60分 -> 1小时)

输入: 无
输出:
- 一个可实例化的类
- 能在console打印当前时间

## Task2: 实现时间UI显示

工作内容:
- 创建UI元素 (canvas的Text或DOM的div)
- 绑定到GameTimeSystem, 每分钟刷新显示
- 格式化输出 (如: “春1日 14:30”)

输入: Task1的GameTimeSystem实例
输出: 地图左上角显示时间, 每分钟更新

## Task3: 实现时间倍速控制

工作内容:
- 给GameTimeSystem添加timeScale属性 (默认是10, 可设置)
- 在tick方法里应用倍速: deltaTime * timeScale

## Task4: 实现睡觉功能

工作内容:
- 在GameTimeSystem里添加sleep()方法
- 逻辑: 将时间直接设置为“次日 6:00”
- 触发 onDayEnd和 onDayStart事件

# 三、技术方案文档

## 3.1 核心数据结构

```javascript
GameTimeSystem {
  数据：
    currentYear: 整数（第几年）
    currentSeason: 字符串（"spring"/"summer"/"fall"/"winter"）
    currentDay: 整数（1-28）
    currentHour: 整数（0-23）
    currentMinute: 整数（0-59）
    timeScale: 浮点数（时间倍速，默认1）
    
  方法：
    tick(deltaTime): 
      - 输入：距离上一帧的毫秒数
      - 功能：累加时间，处理进位
      - 输出：无
      
    sleep():
      - 功能：跳到次日6:00
      - 触发：onDayEnd, onDayStart事件
      
    on(eventName, callback):
      - 功能：订阅事件
      
    getCurrentTime():
      - 返回：{year, season, day, hour, minute}
}
```

## 时间进位规则

```
60分钟 → 1小时（分钟归0，小时+1）
24小时 → 1天（小时归0，天+1）
28天 → 下一季（天归1，季节切换）
4季 → 1年（季节归春，年+1）

季节顺序：spring → summer → fall → winter → spring
```
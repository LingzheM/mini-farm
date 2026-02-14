import type { IGameSystem, GameState } from '../types';
import type { EventBus } from '../core/EventBus';

/**
 * 时间系统 - 管理游戏内时间流逝
 * 
 * 核心概念:
 * 1. 真实时间 → 游戏时间转换
 * 2. 时间累加器确保精确
 * 3. 时间进位逻辑
 * 4. 时间事件触发
 */
export class TimeSystem implements IGameSystem {
  private eventBus: EventBus;
  
  // 时间累加器 (毫秒)
  private accumulator: number = 0;
  
  // 每1000ms真实时间 = timeScale分钟游戏时间
  private readonly MS_PER_GAME_TICK = 1000;
  
  // 上一次触发事件的时间点
  private lastMinute: number = 0;
  private lastHour: number = 6;
  private lastDay: number = 1;
  
  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    console.log('⏰ Time system initialized');
    console.log(`   Time scale: 1 real second = ${60} game minutes`);
  }

  update(deltaTime: number, state: GameState): void {
    // 累加真实时间
    this.accumulator += deltaTime;
    
    // 每1秒真实时间,推进游戏时间
    while (this.accumulator >= this.MS_PER_GAME_TICK) {
      this.advanceTime(state);
      this.accumulator -= this.MS_PER_GAME_TICK;
    }
    
    // 检测时间变化,触发事件
    this.checkTimeEvents(state);
  }

  /**
   * 推进游戏时间
   * 
   * 每次调用增加 timeScale 分钟
   */
  private advanceTime(state: GameState): void {
    const { timeScale } = state.time;
    
    // 增加分钟
    state.time.minute += timeScale;
    state.time.totalMinutes += timeScale;
    
    // 分钟进位 → 小时
    if (state.time.minute >= 60) {
      const addHours = Math.floor(state.time.minute / 60);
      state.time.hour += addHours;
      state.time.minute = state.time.minute % 60;
    }
    
    // 小时进位 → 天
    if (state.time.hour >= 24) {
      const addDays = Math.floor(state.time.hour / 24);
      state.time.day += addDays;
      state.time.hour = state.time.hour % 24;
    }
  }

  /**
   * 检测时间事件
   * 
   * 当分钟/小时/天变化时,触发对应事件
   */
  private checkTimeEvents(state: GameState): void {
    const { minute, hour, day } = state.time;
    
    // 分钟变化
    if (minute !== this.lastMinute) {
      this.onMinuteChange(state);
      this.lastMinute = minute;
    }
    
    // 小时变化
    if (hour !== this.lastHour) {
      this.onHourChange(state);
      this.lastHour = hour;
    }
    
    // 天变化
    if (day !== this.lastDay) {
      this.onDayChange(state);
      this.lastDay = day;
    }
  }

  /**
   * 每分钟触发
   */
  private onMinuteChange(state: GameState): void {
    this.eventBus.emit({
      type: 'TIME_CHANGED',
      data: state.time,
    });
    
    // 每10分钟输出一次日志(避免刷屏)
    if (state.time.minute % 10 === 0) {
      this.logTime(state);
    }
  }

  /**
   * 每小时触发
   */
  private onHourChange(state: GameState): void {
    console.log(`⏰ Hour changed: ${this.formatTime(state)}`);
    
    // TODO: 这里可以触发作物生长检查等逻辑
    // this.eventBus.emit({ type: 'HOUR_PASSED', data: state.time });
  }

  /**
   * 每天触发
   */
  private onDayChange(state: GameState): void {
    console.log(`📅 New day: Day ${state.time.day}`);
    
    // 恢复体力
    state.player.energy = state.player.maxEnergy;
    console.log(`💚 Energy restored to ${state.player.maxEnergy}`);
    
    // 触发新一天事件
    this.eventBus.emit({
      type: 'TIME_CHANGED',
      data: state.time,
    });
    
    // TODO: 这里可以触发作物成熟检查等逻辑
    // this.eventBus.emit({ type: 'NEW_DAY', data: state.time });
  }

  /**
   * 输出当前时间
   */
  private logTime(state: GameState): void {
    console.log(`⏰ ${this.formatTime(state)}`);
  }

  /**
   * 格式化时间字符串
   */
  private formatTime(state: GameState): string {
    const { day, hour, minute } = state.time;
    const hourStr = String(hour).padStart(2, '0');
    const minuteStr = String(minute).padStart(2, '0');
    return `Day ${day}, ${hourStr}:${minuteStr}`;
  }

  /**
   * 设置时间流速 (调试用)
   */
  setTimeScale(scale: number, state: GameState): void {
    state.time.timeScale = scale;
    console.log(`⏰ Time scale changed to ${scale} (1 real second = ${scale} game minutes)`);
  }

  /**
   * 跳到指定时间 (调试用)
   */
  setTime(day: number, hour: number, minute: number, state: GameState): void {
    state.time.day = day;
    state.time.hour = hour;
    state.time.minute = minute;
    state.time.totalMinutes = (day - 1) * 24 * 60 + hour * 60 + minute;
    
    this.lastDay = day;
    this.lastHour = hour;
    this.lastMinute = minute;
    
    console.log(`⏰ Time set to ${this.formatTime(state)}`);
  }

  destroy(): void {
    console.log('⏰ Time system destroyed');
  }
}
import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import type { Application } from 'pixi.js';
import type { GameState } from '../types';

/**
 * HUD - 抬头显示
 * 显示: 时间、体力、当前工具
 */
export class HUD {
  private app: Application;
  private container: Container;
  private background: Graphics;
  
  // UI元素
  private timeText: Text;
  private energyText: Text;
  private energyBar: Graphics;
  private toolText: Text;
  
  // 当前工具(从FarmSystem同步)
  private currentTool: 'hoe' | 'seeds' | 'waterCan' = 'hoe';
  
  constructor(app: Application) {
    this.app = app;
    this.container = new Container();
    this.background = new Graphics();
    this.energyBar = new Graphics();
    
    // 创建文本样式
    const textStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 16,
      fill: 0xFFFFFF,
      stroke: 0x000000,
      strokeThickness: 3,
    });
    
    this.timeText = new Text('Day 1, 06:00', textStyle);
    this.energyText = new Text('Energy: 100/100', textStyle);
    this.toolText = new Text('Tool: Hoe', textStyle);
    
    this.setupUI();
    this.app.stage.addChild(this.container);
  }

  /**
   * 设置UI布局
   */
  private setupUI(): void {
    const padding = 10;
    const panelWidth = 220;
    const panelHeight = 120;
    
    // 半透明背景面板
    this.background.beginFill(0x000000, 0.6);
    this.background.drawRoundedRect(padding, padding, panelWidth, panelHeight, 8);
    this.background.endFill();
    
    this.container.addChild(this.background);
    
    // 时间文本
    this.timeText.x = padding + 10;
    this.timeText.y = padding + 10;
    this.container.addChild(this.timeText);
    
    // 体力文本
    this.energyText.x = padding + 10;
    this.energyText.y = padding + 40;
    this.container.addChild(this.energyText);
    
    // 体力条背景
    this.energyBar.x = padding + 10;
    this.energyBar.y = padding + 65;
    this.container.addChild(this.energyBar);
    
    // 工具文本
    this.toolText.x = padding + 10;
    this.toolText.y = padding + 90;
    this.container.addChild(this.toolText);
  }

  /**
   * 更新HUD显示
   */
  update(state: GameState): void {
    this.updateTime(state);
    this.updateEnergy(state);
  }

  /**
   * 更新时间显示
   */
  private updateTime(state: GameState): void {
    const { day, hour, minute } = state.time;
    const hourStr = String(hour).padStart(2, '0');
    const minuteStr = String(minute).padStart(2, '0');
    this.timeText.text = `Day ${day}, ${hourStr}:${minuteStr}`;
  }

  /**
   * 更新体力显示
   */
  private updateEnergy(state: GameState): void {
    const { energy, maxEnergy } = state.player;
    this.energyText.text = `Energy: ${energy}/${maxEnergy}`;
    
    // 绘制体力条
    this.energyBar.clear();
    
    const barWidth = 200;
    const barHeight = 16;
    const fillWidth = (energy / maxEnergy) * barWidth;
    
    // 背景(灰色)
    this.energyBar.beginFill(0x333333);
    this.energyBar.drawRoundedRect(0, 0, barWidth, barHeight, 4);
    this.energyBar.endFill();
    
    // 体力条(绿色→黄色→红色)
    let barColor = 0x4CAF50; // 绿色
    if (energy < maxEnergy * 0.5) {
      barColor = 0xFFC107; // 黄色
    }
    if (energy < maxEnergy * 0.2) {
      barColor = 0xF44336; // 红色
    }
    
    this.energyBar.beginFill(barColor);
    this.energyBar.drawRoundedRect(0, 0, fillWidth, barHeight, 4);
    this.energyBar.endFill();
    
    // 边框
    this.energyBar.lineStyle(2, 0xFFFFFF, 0.5);
    this.energyBar.drawRoundedRect(0, 0, barWidth, barHeight, 4);
  }

  /**
   * 更新工具显示
   */
  updateTool(tool: 'hoe' | 'seeds' | 'waterCan'): void {
    this.currentTool = tool;
    
    const toolNames = {
      hoe: 'Hoe (锄头)',
      seeds: 'Seeds (种子)',
      waterCan: 'Water Can (水壶)',
    };
    
    this.toolText.text = `Tool: ${toolNames[tool]}`;
  }

  destroy(): void {
    this.background.destroy();
    this.timeText.destroy();
    this.energyText.destroy();
    this.energyBar.destroy();
    this.toolText.destroy();
    this.container.destroy();
  }
}
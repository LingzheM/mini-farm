import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import type { Application } from 'pixi.js';
import type { GameState } from '../types';
import { getItemName, getItemColor } from '../config/items';

/**
 * 背包UI - 显示24格背包界面
 * 
 * 布局:
 * - 6列 x 4行 = 24格
 * - 每格40x40像素
 * - 显示物品颜色方块 + 数量
 */
export class InventoryUI {
  private app: Application;
  private container: Container;
  private background: Graphics;
  private title: Text;
  private slots: Graphics[] = [];
  private slotTexts: Text[] = [];
  private infoText: Text;
  
  private readonly SLOT_SIZE = 40;
  private readonly SLOT_PADDING = 4;
  private readonly COLS = 6;
  private readonly ROWS = 4;
  
  constructor(app: Application) {
    this.app = app;
    this.container = new Container();
    this.background = new Graphics();
    
    // 初始隐藏
    this.container.visible = false;
    
    // 标题样式
    const titleStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 20,
      fill: 0xFFFFFF,
      fontWeight: 'bold',
    });
    this.title = new Text('Inventory', titleStyle);
    
    // 信息栏样式
    const infoStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 14,
      fill: 0xCCCCCC,
    });
    this.infoText = new Text('Press B to close', infoStyle);
    
    this.setupUI();
    this.app.stage.addChild(this.container);
    
    console.log('🎒 Inventory UI created');
  }

  /**
   * 设置UI布局
   */
  private setupUI(): void {
    const panelWidth = this.COLS * (this.SLOT_SIZE + this.SLOT_PADDING) + 40;
    const panelHeight = this.ROWS * (this.SLOT_SIZE + this.SLOT_PADDING) + 100;
    
    // 居中位置
    const x = (this.app.screen.width - panelWidth) / 2;
    const y = (this.app.screen.height - panelHeight) / 2;
    
    // 半透明背景
    this.background.beginFill(0x2C3E50, 0.95);
    this.background.drawRoundedRect(0, 0, panelWidth, panelHeight, 8);
    this.background.endFill();
    
    // 边框
    this.background.lineStyle(2, 0xFFFFFF, 0.3);
    this.background.drawRoundedRect(0, 0, panelWidth, panelHeight, 8);
    
    this.container.x = x;
    this.container.y = y;
    this.container.addChild(this.background);
    
    // 标题
    this.title.x = 20;
    this.title.y = 15;
    this.container.addChild(this.title);
    
    // 创建24个槽位
    for (let row = 0; row < this.ROWS; row++) {
      for (let col = 0; col < this.COLS; col++) {
        const slotIndex = row * this.COLS + col;
        const slotX = 20 + col * (this.SLOT_SIZE + this.SLOT_PADDING);
        const slotY = 50 + row * (this.SLOT_SIZE + this.SLOT_PADDING);
        
        // 槽位背景
        const slotGraphics = new Graphics();
        slotGraphics.x = slotX;
        slotGraphics.y = slotY;
        this.container.addChild(slotGraphics);
        this.slots.push(slotGraphics);
        
        // 数量文本
        const countText = new Text('', new TextStyle({
          fontFamily: 'Arial',
          fontSize: 12,
          fill: 0xFFFFFF,
          stroke: 0x000000,
          strokeThickness: 2,
        }));
        countText.x = slotX + this.SLOT_SIZE - 18;
        countText.y = slotY + this.SLOT_SIZE - 18;
        this.container.addChild(countText);
        this.slotTexts.push(countText);
      }
    }
    
    // 信息栏
    this.infoText.x = 20;
    this.infoText.y = panelHeight - 30;
    this.container.addChild(this.infoText);
  }

  /**
   * 更新显示
   */
  update(state: GameState): void {
    // 更新可见性
    this.container.visible = state.inventory.isOpen;
    
    if (!state.inventory.isOpen) return;
    
    // 更新标题(显示已用槽位)
    const usedSlots = state.inventory.slots.filter(s => s !== null).length;
    this.title.text = `Inventory (${usedSlots}/${state.inventory.maxSlots})`;
    
    // 更新每个槽位
    for (let i = 0; i < state.inventory.maxSlots; i++) {
      const slot = state.inventory.slots[i];
      this.renderSlot(i, slot);
    }
  }

  /**
   * 渲染单个槽位
   */
  private renderSlot(index: number, slot: { item: string; count: number } | null): void {
    const slotGraphics = this.slots[index];
    const countText = this.slotTexts[index];
    
    slotGraphics.clear();
    
    // 槽位背景
    slotGraphics.beginFill(0x34495E, 0.8);
    slotGraphics.drawRoundedRect(0, 0, this.SLOT_SIZE, this.SLOT_SIZE, 4);
    slotGraphics.endFill();
    
    // 边框
    slotGraphics.lineStyle(1, 0x7F8C8D, 0.5);
    slotGraphics.drawRoundedRect(0, 0, this.SLOT_SIZE, this.SLOT_SIZE, 4);
    
    if (slot) {
      // 有物品: 绘制物品颜色方块
      const itemColor = getItemColor(slot.item as any);
      const itemSize = this.SLOT_SIZE - 12;
      
      slotGraphics.beginFill(itemColor);
      slotGraphics.drawRoundedRect(6, 6, itemSize, itemSize, 2);
      slotGraphics.endFill();
      
      // 显示数量
      countText.text = `x${slot.count}`;
      countText.visible = true;
    } else {
      // 空槽位
      countText.visible = false;
    }
  }

  /**
   * 切换显示/隐藏
   */
  toggle(state: GameState): void {
    state.inventory.isOpen = !state.inventory.isOpen;
    this.container.visible = state.inventory.isOpen;
    
    if (state.inventory.isOpen) {
      this.update(state);
    }
  }

  destroy(): void {
    this.background.destroy();
    this.title.destroy();
    this.infoText.destroy();
    
    this.slots.forEach(s => s.destroy());
    this.slotTexts.forEach(t => t.destroy());
    
    this.container.destroy();
  }
}
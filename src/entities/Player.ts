import { Graphics, Container, Text } from 'pixi.js';
import type { Application } from 'pixi.js';
import { GRID_CONFIG } from '../utils/Constants';
import type { PlayerState } from '../types';
import { GridSystem } from '../systems/GridSystem';

/**
 * 玩家实体 - 负责玩家的视觉表现
 */
export class Player {
  private app: Application;
  private container: Container;
  private graphics: Graphics;
  private directionIndicator: Graphics;
  
  constructor(app: Application) {
    this.app = app;
    this.container = new Container();
    this.graphics = new Graphics();
    this.directionIndicator = new Graphics();
    
    this.container.addChild(this.graphics);
    this.container.addChild(this.directionIndicator);
    this.app.stage.addChild(this.container);
    
    this.drawPlayer();
  }

  /**
   * 绘制玩家外观
   */
  private drawPlayer(): void {
    const { TILE_SIZE } = GRID_CONFIG;
    const size = TILE_SIZE * 0.7; // 玩家比瓦片小一点
    const offset = (TILE_SIZE - size) / 2;
    
    this.graphics.clear();
    
    // 身体 - 蓝色方块
    this.graphics.beginFill(0x2196F3);
    this.graphics.drawRect(offset, offset, size, size);
    this.graphics.endFill();
    
    // 眼睛
    this.graphics.beginFill(0xFFFFFF);
    this.graphics.drawCircle(offset + size * 0.3, offset + size * 0.3, 3);
    this.graphics.drawCircle(offset + size * 0.7, offset + size * 0.3, 3);
    this.graphics.endFill();
    
    this.graphics.beginFill(0x000000);
    this.graphics.drawCircle(offset + size * 0.3, offset + size * 0.3, 2);
    this.graphics.drawCircle(offset + size * 0.7, offset + size * 0.3, 2);
    this.graphics.endFill();
  }

  /**
   * 绘制方向指示器
   */
  private drawDirectionIndicator(direction: string): void {
    const { TILE_SIZE } = GRID_CONFIG;
    this.directionIndicator.clear();
    this.directionIndicator.beginFill(0xFFEB3B, 0.8); // 黄色
    
    const size = 6;
    const centerX = TILE_SIZE / 2;
    const centerY = TILE_SIZE / 2;
    
    // 根据方向绘制三角形
    switch (direction) {
      case 'up':
        this.directionIndicator.drawPolygon([
          centerX, centerY - 15,
          centerX - size, centerY - 10,
          centerX + size, centerY - 10,
        ]);
        break;
      case 'down':
        this.directionIndicator.drawPolygon([
          centerX, centerY + 15,
          centerX - size, centerY + 10,
          centerX + size, centerY + 10,
        ]);
        break;
      case 'left':
        this.directionIndicator.drawPolygon([
          centerX - 15, centerY,
          centerX - 10, centerY - size,
          centerX - 10, centerY + size,
        ]);
        break;
      case 'right':
        this.directionIndicator.drawPolygon([
          centerX + 15, centerY,
          centerX + 10, centerY - size,
          centerX + 10, centerY + size,
        ]);
        break;
    }
    
    this.directionIndicator.endFill();
  }

  /**
   * 更新玩家位置和状态
   */
  updatePosition(state: PlayerState): void {
    const pixel = GridSystem.gridToPixel(state.gridX, state.gridY);
    const { TILE_SIZE } = GRID_CONFIG;
    
    // 设置容器位置 (左上角对齐)
    this.container.x = pixel.x - TILE_SIZE / 2;
    this.container.y = pixel.y - TILE_SIZE / 2;
    
    // 更新方向指示器
    this.drawDirectionIndicator(state.direction);
  }

  destroy(): void {
    this.graphics.destroy();
    this.directionIndicator.destroy();
    this.container.destroy();
  }
}
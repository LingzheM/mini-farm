import type { IGameSystem, GameState } from '../types';
import { Graphics } from 'pixi.js';
import type { Application } from 'pixi.js';

export class DebugSystem implements IGameSystem {
  private app: Application;
  private graphics: Graphics;
  private frameCount: number = 0;
  private elapsedTime: number = 0;
  private x: number = 100;
  private y: number = 100;
  private vx: number = 2;
  private vy: number = 1.5;

  constructor(app: Application) {
    this.app = app;
    this.graphics = new Graphics();
    this.app.stage.addChild(this.graphics);
  }

  update(deltaTime: number, state: GameState): void {
    this.frameCount++;
    this.elapsedTime += deltaTime;

    if (this.elapsedTime >= 1000) {
      console.log(`🎮 FPS: ${this.frameCount} | Game Time: Day ${state.time.day}, ${state.time.hour}:${String(state.time.minute).padStart(2, '0')}`);
      this.frameCount = 0;
      this.elapsedTime = 0;
    }

    this.updateBall(deltaTime);
  }

  private updateBall(deltaTime: number): void {
    this.x += this.vx;
    this.y += this.vy;

    // 边界反弹
    if (this.x <= 0 || this.x >= this.app.screen.width - 50) {
      this.vx *= -1;
    }
    if (this.y <= 0 || this.y >= this.app.screen.height - 50) {
      this.vy *= -1;
    }

    // PixiJS v7 的绘制方式
    this.graphics.clear();
    this.graphics.beginFill(0xFF6B6B); // 红色
    this.graphics.drawRect(this.x, this.y, 50, 50);
    this.graphics.endFill();
  }

  destroy(): void {
    this.graphics.destroy();
  }
}
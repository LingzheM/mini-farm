import type { IGameSystem, GameState, Direction } from '../types';
import { Player } from '../entities/Player';
import type { Application } from 'pixi.js';
import { InputSystem } from './InputSystem';
import { GridSystem } from './GridSystem';

/**
 * 玩家系统: 负责玩家移动
 */

export class PlayerSystem implements IGameSystem {
    private player: Player;
    private inputSystem: InputSystem;

    // 移动配置
    private readonly MOVE_DURATION = 300;   //每移动一格需要消耗300ms
    private readonly ENERGY_COST_MOVE = 1;  // 每次移动消耗1点体力

    // 移动状态
    private isMoving: boolean = false;
    private moveProgress: number = 0;
    private moveStartGrid: { x: number; y: number } = { x: 0, y: 0 };
    private moveTargetGrid: { x: number; y: number } = { x: 0, y: 0 };

    constructor(app: Application, inputSystem: InputSystem) {
        this.player = new Player(app);
        this.inputSystem = inputSystem;
    }

    update(deltaTime: number, state: GameState): void {
        if (this.isMoving) {
            this.updateMovement(deltaTime, state);
        } else {
            this.handleInput(state);
        }
        
        // 每帧更新玩家的视觉位置
        this.updatePlayerVisual(state);
        //this.player.updatePosition(state.player);
    }

    private handleInput(state: GameState): void {
        const moveCommand = this.inputSystem.moveCommand;
        if (!moveCommand) {
            return;
        }

        // 尝试开始移动
        this.tryMove(moveCommand, state);
    }

    private tryMove(direction: Direction, state: GameState): void {
        // 1. 更新朝向
        state.player.direction = direction;

        // 2. 计算目标网络
        const currentX = state.player.gridX;
        const currentY = state.player.gridY;
        let targetX = currentX;
        let targetY = currentY;

        switch(direction) {
            case 'up':
                targetY -= 1;
                break;
            case 'down':
                targetY += 1;
                break;
            case 'left':
                targetX -= 1;
                break;
            case 'right':
                targetX += 1;
                break;
        }

        // 3.碰撞检测: 边界
        if (!GridSystem.isValidGrid(targetX, targetY, state)) {
            console.log(`🚫 Cannot move: Out of bounds (${targetX}, ${targetY})`);
            return;
        }

        // 4.检查体力
        if (state.player.energy < this.ENERGY_COST_MOVE) {
            console.log('🚫 Cannot move: Not enough energy');
          return;
        }

        // 5.确认移动
        this.startMove(currentX, currentY, targetX, targetY, state);

    }

    private startMove(
        startX: number,
        startY: number,
        targetX: number,
        targetY: number,
        state: GameState
    ): void {
        this.isMoving = true;
        this.moveProgress = 0;
        this.moveStartGrid = { x: startX, y: startY };
        this.moveTargetGrid = { x: targetX, y: targetY };

        // 扣除体力
        state.player.energy -= this.ENERGY_COST_MOVE;
        state.player.isMoving = true;
    
        console.log(`🚶 Moving from (${startX}, ${startY}) to (${targetX}, ${targetY}), Energy: ${state.player.energy}`);
    }

    private updateMovement(deltaTime: number, state: GameState): void {
        this.moveProgress += deltaTime / this.MOVE_DURATION;

        // 移动完成
        if (this.moveProgress >= 1) {
            this.completeMove(state);
        }
    }

    private completeMove(state: GameState): void {
        state.player.gridX = this.moveTargetGrid.x;
        state.player.gridY = this.moveTargetGrid.y;

        //状态机
        this.isMoving = false;
        this.moveProgress = 0;
        state.player.isMoving = false;

        console.log(`✅ Arrived at (${state.player.gridX}, ${state.player.gridY})`);
    }

    /**
     * 更新视觉位置
     * @param state 
     */
    private updatePlayerVisual(state: GameState): void {
        if (this.isMoving) {
            const visualState = {
                ...state.player,
                gridX: this.lerp(this.moveStartGrid.x, this.moveTargetGrid.x, this.moveProgress),
                gridY: this.lerp(this.moveStartGrid.y, this.moveTargetGrid.y, this.moveProgress),
            };
            this.player.updatePosition(visualState);
        } else {
            // 静止
            this.player.updatePosition(state.player);
        }
    }

    /**
     * 线性插值
     */
    private lerp(start: number, end: number, t: number): number {
        return start + (end - start) * Math.min(t, 1);
    }

    destroy(): void {
        this.player.destroy();
    }
}
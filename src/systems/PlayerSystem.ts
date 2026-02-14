import type { IGameSystem, GameState } from '../types';
import { Player } from '../entities/Player';
import type { Application } from 'pixi.js';

/**
 * 玩家系统
 */

export class PlayerSystem implements IGameSystem {
    private player: Player;

    constructor(app: Application) {
        this.player = new Player(app);
    }

    update(deltaTime: number, state: GameState): void {
        this.player.updatePosition(state.player);
    }

    destroy(): void {
        this.player.destroy();
    }
}
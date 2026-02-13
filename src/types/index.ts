import type { Application } from "pixi.js";

// 游戏状态
export interface GameState {
    time: TimeState;
    player: PlayerState;
    world: WorldState;
}

export interface TimeState {
    day: number;
    hour: number;
    minute: number;
    totalMinutes: number;
    timeScale: number;  // 时间流速
}

export interface PlayerState {
    gridX: number;
    gridY: number;
    energy: number;
    maxEnergy: number;
    direction: Direction;
    isMoving: boolean;
}

export interface WorldState {
    tiles: TileData[][];
    width: number;
    height: number;
}

export interface TileData {
    type: TileType;
    watered: boolean;
    crop?: CropData;
}

export interface CropData {
    type: CropType;
    growthStage: number;
    dayPlanted: number;
}


export type Direction = 'up' | 'down' | 'left' | 'right';
export type TileType = 'grass' | 'soil' | 'planted';
export type CropType = 'potato' | 'tomato';

// 系统接口
export interface IGameSystem {
    update(deltaTime: number, state: GameState): void;
    destroy?(): void;
}

// 事件类型
export type GameEvent = 
    | { type: 'TIME_CHANGED'; data: TimeState }
    | { type: 'PLAYER_MOVED'; data: { x: number; y: number } }
    | { type: 'ENERGY_CHANGED'; data: number }
    | { type: 'TILE_CHANGED'; data: { x: number; y: number; tile: TileData } };
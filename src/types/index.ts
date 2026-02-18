import { Application } from "pixi.js";

// 物品分类 (预留扩展)
export type ItemCategory = 'tool' | 'seed' | 'crop' | 'mineral' | 'metal';

// 物品ID
export type ItemType = 
    | 'seed_potato'
    | 'seed_tomato'
    | 'crop_potato'
    | 'crop_tomato';

// 物品定义
export interface ItemDefinition {
    id: ItemType;
    name: string;
    category: ItemCategory;
    stackable: boolean;
    maxStack: number;
    description?: string;
    color: number;
}

// 背包槽位
export interface InventorySlot {
    item: ItemType;
    count: number;
}

// 背包状态
export interface InventoryState {
    slots: (InventorySlot | null)[];
    maxSlots: number;
    isOpen: boolean;
}


// 游戏状态
export interface GameState {
    time: TimeState;
    player: PlayerState;
    world: WorldState;
    inventory: InventoryState;
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
    | { type: 'TILE_CHANGED'; data: { x: number; y: number; tile: TileData } }
    | { type: 'ITEM_ADD'; data: { item: ItemType; count: number } }
    | { type: 'ITEM_REMOVED'; data: { item: ItemType; count: number } }
    | { type: 'INVENTORY_FULL'; data: null }
    | { type: 'CROP_HARVESTED'; data: { item: ItemType; count: number; gridX: number; gridY: number } } ;
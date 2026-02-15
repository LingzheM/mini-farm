import type { IGameSystem, GameState, TileData, Direction, ItemType } from "types";
import type { EventBus } from "core/EventBus";
import type { InputSystem } from "./InputSystem";
import { GridSystem } from "./GridSystem";
import { InventorySystem } from "./InventorySystem";

/**
 * 农场系统——管理土地和作物
 */

export class FarmSystem implements IGameSystem {

    private eventBus: EventBus;
    private inputSystem: InputSystem;
    private gridSystemRef: GridSystem;
    private inventorySystem: InventorySystem;

    // 工具类型
    private currentTool: 'hoe' | 'seeds' | 'waterCan' = 'hoe';

    // 作物配置
    private readonly CROP_GROWTH_DAYS = 3;  //成熟期3天
    private readonly ENEGY_COST_HOE = 2;
    private readonly ENEGY_COST_PLANT = 1;
    private readonly ENERY_COST_WATER = 1;
    private readonly ENERY_COST_HARVEST = 2;

    private lastKey1Pressed: boolean = false;
    private lastKey2Pressed: boolean = false;
    private lastKey3Pressed: boolean = false;

    constructor(eventBus: EventBus, inputSystem: InputSystem, gridSystem: GridSystem, inventorySystem: InventorySystem) {
        this.eventBus = eventBus;
        this.inputSystem = inputSystem;
        this.gridSystemRef = gridSystem;
        this.inventorySystem = inventorySystem;

        console.log('🌱 Farm system initialized');
        console.log('   [1] Hoe (锄头) - Till the soil');
        console.log('   [2] Seeds (种子) - Plant crops');
        console.log('   [3] Water Can (水壶) - Water crops');
        console.log('   [Space] Use current tool');
        console.log('   [Space on mature crop] Harvest'); // 新增
        console.log('');
        console.log('🔧 Current tool: Hoe (锄头)');

    }
 

    update(deltaTime: number, state: GameState): void {
        this.handleToolsSwitch(state);

        if (this.inputSystem.actionCommand === 'use_tool') {
            this.useTool(state);
        }
    }

    /**
     * 切换工具
     * @param state 
     */
    private handleToolsSwitch(state: GameState): void {
        const key1Pressed = this.inputSystem.isKeyPressed('1');
        const key2Pressed = this.inputSystem.isKeyPressed('2');
        const key3Pressed = this.inputSystem.isKeyPressed('3');

        if (key1Pressed && !this.lastKey1Pressed) {
            this.currentTool = 'hoe';
            console.log('🔧 Tool: Hoe (锄头)');
        }else if (key2Pressed && !this.lastKey2Pressed) {
            this.currentTool = 'seeds';
            console.log('🔧 Tool: Seeds (种子)');
        } else if (key3Pressed && this.lastKey3Pressed) {
            this.currentTool = 'waterCan';
            console.log('🔧 Tool: Water Can (水壶)');
        }

        // 更新上一帧状态
        this.lastKey1Pressed = key1Pressed;
        this.lastKey2Pressed = key2Pressed;
        this.lastKey3Pressed = key3Pressed;
    }

    private useTool(state: GameState): void {
        // 计算面前的格子
        const targetGrid = this.getTargetGrid(state);

        if (!GridSystem.isValidGrid(targetGrid.x, targetGrid.y, state)) {
            console.log('🚫 Cannot use tool: Out of bounds');
            return;
        }

        const tile = state.world.tiles[targetGrid.y][targetGrid.x];

        // 检查是否是成熟作物 -> 收获
        if (tile.type === 'planted' && tile.crop && tile.crop.growthStage === 3) {
            this.harvestCrop(targetGrid.x, targetGrid.y, tile, state);
            return;
        }

        // 根据工具类型执行操作
        switch(this.currentTool) {
            case "hoe":
                this.useHoe(targetGrid.x, targetGrid.y, tile, state);
                break;
            case "seeds":
                this.plantSeeds(targetGrid.x, targetGrid.y, tile, state);
                break;
            case "waterCan":
                this.waterTile(targetGrid.x, targetGrid.y, tile, state);
                break;
        }
    }

    private getTargetGrid(state: GameState): { x: number; y: number } {
        const {gridX, gridY, direction} = state.player;

        switch (direction) {
            case "up":
                return { x: gridX, y: gridY - 1 };
            case "down":
                return { x: gridX, y: gridY + 1 };
            case "left":
                return { x: gridX - 1, y: gridY };
            case "right":
                return { x: gridX + 1, y: gridY };
        }
    }

    /**
     * 使用锄头
     */
    private useHoe(x: number, y: number, tile: TileData, state: GameState): void {
        if (tile.type !== 'grass') {
            console.log('🚫 This tile is already tilled or planted');
            return;
        }

        // 检查体力
        if (state.player.energy < this.ENEGY_COST_HOE) {
            console.log('🚫 Not enough energy to use hoe');
            return;
        }

        // 耕地
        const newTile: TileData = {
            type: 'soil',
            watered: false,
        };

        state.world.tiles[y][x] = newTile;
        state.player.energy -= this.ENEGY_COST_HOE;

        // 更新渲染
        this.gridSystemRef.updateTile(x, y, newTile, state);

        console.log(`🔨 Tilled soil at (${x}, ${y}), Energy: ${state.player.energy}`);

        this.eventBus.emit({
            type: 'TILE_CHANGED',
            data: { x, y, tile: newTile },
        });
    }

    /**
     * 播种
     */
    private plantSeeds(x: number, y: number, tile: TileData, state: GameState): void {
        // 检查是否是耕地
        if (tile.type !== 'soil') {
            console.log('🚫 Can only plant on tilled soil');
            return;
        }

        // 检查体力
        if (state.player.energy < this.ENEGY_COST_PLANT) {
            console.log('🚫 Not enough energy to plant');
            return;
        }

        // 检查是否有种子
        const hasSeeds = this.inventorySystem.hasItem('seed_potato', 1, state);
        if (!hasSeeds) {
            console.log('🚫 No seeds in inventory');
            return;
        }

        // 消耗种子
        this.inventorySystem.removeItem('seed_potato', 1, state);

        // 播种
        const newTile: TileData = {
            type: 'planted',
            watered: false,
            crop: {
                type: 'potato',
                growthStage: 0,
                dayPlanted: state.time.day,
            },
        };
        state.world.tiles[y][x] = newTile;
        state.player.energy -= this.ENEGY_COST_PLANT;

        // 更新渲染
        this.gridSystemRef.updateTile(x, y, newTile, state);

        console.log(`🌱 Planted seeds at (${x}, ${y}), Energy: ${state.player.energy}`);

        this.eventBus.emit({
            type: 'TILE_CHANGED',
            data: { x, y, tile: newTile },
        });
    }

    private waterTile(x: number, y: number, tile: TileData, state: GameState): void {
        // 检查是否是耕地或者已播种
        if (tile.type !== 'soil' && tile.type !== 'planted') {
            console.log('🚫 Can only water soil or crops');
            return;
        }

        // 检查是否已经浇水
        if (tile.watered) {
            console.log('💧 This tile is already watered');
            return;
        }

        // 检查体力
        if (state.player.energy < this.ENERY_COST_WATER) {
            console.log('🚫 Not enough energy to water');
            return;
        }

        // 浇水
        tile.watered = true;
        state.player.energy -= this.ENERY_COST_WATER;

        // 更新渲染
        this.gridSystemRef.updateTile(x, y, tile, state);

        console.log(`💧 Watered tile at (${x}, ${y}), Energy: ${state.player.energy}`);

        this.eventBus.emit({
            type: 'TILE_CHANGED',
            data: { x, y, tile },
        });
    }

    /**
     * 收获成熟作物
     * @param x 
     * @param y 
     * @param tile 
     * @param state 
     */
    private harvestCrop(x: number, y: number, tile: TileData, state: GameState): void {
        if (!tile.crop) return;

        // 检查体力
        if (state.player.energy < this.ENERY_COST_HARVEST) {
            console.log('🚫 Not enough energy to harvest');
            return;
        }

        // 根据作物类型获取物品ID
        const cropItemId: ItemType = tile.crop.type === 'potato' ? 'crop_potato' : 'crop_tomato';

        // 尝试添加到背包
        const success = this.inventorySystem.addItem(cropItemId, 1, state);
        if (!success) {
            console.log('🚫 Inventory full! Cannot harvest.');
            return;
        }

        // 成功收获
        state.player.energy -= this.ENERY_COST_HARVEST;

        // 变回耕地
        const newTile: TileData = {
            type: 'soil',
            watered: false,
        };

        state.world.tiles[y][x] = newTile;
        this.gridSystemRef.updateTile(x, y, newTile, state);
        
        console.log(`🌾 Harvested ${cropItemId} at (${x}, ${y}), Energy: ${state.player.energy}`);

        this.eventBus.emit({
            type: 'TILE_CHANGED',
            data: { x, y, tile: newTile },
        });

    }

    /**
     * 检查并更新作物生长
     */
    checkCropGrowth(state: GameState): void {
        const currentDay = state.time.day;

        for (let y = 0; y < state.world.height; y++) {
            for (let x = 0; x < state.world.width; x++) {
                const tile = state.world.tiles[y][x];

                if (tile.type === 'planted' && tile.crop) {
                    const daysSincePlanted = currentDay - tile.crop.dayPlanted;

                    // 计算生长阶段(0-3)
                    const newStage = Math.min(
                        Math.floor(daysSincePlanted / this.CROP_GROWTH_DAYS * 3),
                        3
                    );

                    if (newStage !== tile.crop.growthStage) {
                        tile.crop.growthStage = newStage;
                        this.gridSystemRef.updateTile(x, y, tile, state);

                        if (newStage === 3) {
                            console.log(`🌾 Crop at (${x}, ${y}) is ready to harvest!`);
                        }
                    }

                    // 每天重新浇水
                    tile.watered = false;
                }
            }
        }
    }

    destroy(): void {
        console.log('🌱 Farm system destroyed');
    }

    /**
     * 
     * @returns 获取当前工具
     */
    public getCurrentTool(): 'hoe' | 'seeds' | 'waterCan' {
        return this.currentTool;
    }
}
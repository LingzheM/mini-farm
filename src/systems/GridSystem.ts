import type { IGameSystem, GameState, TileData, TileType } from "types";
import { Container, Graphics, Text } from "pixi.js";
import type { Application } from "pixi.js";
import { GRID_CONFIG } from "../utils/Constants";

/**
 * 网格系统 负责瓦片地图的渲染和管理
 * 
 * 1. 初始化世界上地图数据
 * 2. 渲染瓦片
 * 3. 提供坐标转换工具
 */

export class GridSystem implements IGameSystem {
    private app: Application;
    private container: Container;
    private graphics: Graphics;
    private gridLines: Graphics;

    constructor(app: Application) {
        this.app = app;
        this.container = new Container();
        this.graphics = new Graphics();
        this.gridLines = new Graphics();

        this.container.addChild(this.graphics);
        this.container.addChild(this.gridLines);
        this.app.stage.addChild(this.container);
    }

    /**
     * 初始化世界地图
     */
    initWorld(state: GameState): void {
        const { WORLD_WIDTH, WORLD_HEIGHT } = GRID_CONFIG;

        state.world.tiles = [];
        state.world.width = WORLD_WIDTH;
        state.world.height = WORLD_HEIGHT;

        for (let y = 0; y < WORLD_HEIGHT; y++) {
            state.world.tiles[y] = [];
            for (let x = 0; x < WORLD_WIDTH; x++) {
                state.world.tiles[y][x] = this.createTile('grass');
            }
        }

        state.world.tiles[7][10] = this.createTile('soil');
        state.world.tiles[7][11] = this.createTile('soil');
        state.world.tiles[8][10] = this.createTile('soil');

        this.renderGrid(state);

        console.log(`🗺️  World initialized: ${WORLD_WIDTH}x${WORLD_HEIGHT} tiles`);
    }

    /**
     * 创建瓦片数据
     * @param type 
     * @returns 
     */
    private createTile(type: TileType): TileData {
        return {
            type,
            watered: false,
        };
    }

    /**
     * 渲染整个网络
     * @param state 
     */
    private renderGrid(state: GameState): void {
        this.graphics.clear();
        const { TILE_SIZE } = GRID_CONFIG;

        for (let y = 0; y < state.world.height; y++) {
            for (let x = 0; x < state.world.width; x++) {
                const tile = state.world.tiles[y][x];
                const color = this.getTileColor(tile);

                const pixelX = x * TILE_SIZE;
                const pixelY = y * TILE_SIZE;

                this.graphics.beginFill(color);
                this.graphics.drawRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);
                this.graphics.endFill();
            }
        }

        // 绘制网格线
        this.drawGridLines(state);
    }


    private drawGridLines(state: GameState): void {
        this.gridLines.clear();
        this.gridLines.lineStyle(1, 0x000000, 0.1);
    
        const {TILE_SIZE} = GRID_CONFIG;
        const totalWidth = state.world.width * TILE_SIZE;
        const totalHeight = state.world.height * TILE_SIZE;

        // 垂直线
        for (let x = 0; x <= state.world.width; x++) {
            const pixelX = x * TILE_SIZE;
            this.gridLines.moveTo(pixelX, 0);
            this.gridLines.lineTo(pixelX, totalHeight);
        }

        // 水平线
        for (let y = 0; y <= state.world.height; y++) {
            const pixelY = y * TILE_SIZE;
            this.gridLines.moveTo(0, pixelY);
            this.gridLines.lineTo(totalWidth, pixelY);
        }
    }

    /**
     * 
     * @param tile 根据瓦片类型返回颜色
     * @returns 
     */
    private getTileColor(tile: TileData): number {
        switch(tile.type) {
            case 'grass':
                return 0x8BC34A;
            case 'soil':
                return 0x8D6E63;
            case 'planted':
                return 0x6D4C41;
            default:
                return 0xCCCCCC;
        }
    }

    static pixelToGrid(pixelX: number, pixelY: number): { x: number; y: number } {
        return {
            x: Math.floor(pixelX / GRID_CONFIG.TILE_SIZE),
            y: Math.floor(pixelY / GRID_CONFIG.TILE_SIZE),
        };
    }

    /**
     * 坐标转换工具: 网格 -> 像素(中心点)
     */
    static gridToPixel(gridX: number, gridY: number): { x: number; y: number } {
        const { TILE_SIZE } = GRID_CONFIG;
        return {
            x: gridX * TILE_SIZE + TILE_SIZE / 2,
            y: gridY * TILE_SIZE + TILE_SIZE / 2,
        };
    }

    /**
     * 检查网格坐标是否在世界范围内
     */
    static isValidGrid(x: number, y: number, state: GameState): boolean {
        return x >= 0 && x < state.world.width && y >= 0 && y < state.world.height;
    }

    /**
     * 获取指定网格的瓦片数据
     */
    static getTileAt(x: number, y: number, state: GameState): TileData | null {
        if (!this.isValidGrid(x, y, state)) {
        return null;
        }
        return state.world.tiles[y][x];
    }

    /**
     * 更新指定瓦片并重新渲染
     */
    updateTile(x: number, y: number, tile: TileData, state: GameState): void {
        if (!GridSystem.isValidGrid(x, y, state)) {
        return;
        }
        
        state.world.tiles[y][x] = tile;
        this.renderSingleTile(x, y, tile);
    }

    /**
     * 渲染单个瓦片
     * @param gridX 
     * @param gridY 
     * @param tile 
     */
    private renderSingleTile(gridX: number, gridY: number, tile: TileData): void {
        const { TILE_SIZE } = GRID_CONFIG;
        const color = this.getTileColor(tile);

        const pixelX = gridX * TILE_SIZE;
        const pixelY = gridY * TILE_SIZE;

        this.graphics.beginFill(color);
        this.graphics.drawRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);
        this.graphics.endFill();
    }

    update(deltaTime: number, state: GameState): void {
        
    }

    destroy(): void {
        this.graphics.destroy();
        this.gridLines.destroy();
        this.container.destroy();
    }
}


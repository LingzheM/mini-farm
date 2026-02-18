import { Text, TextStyle, Container } from "pixi.js";
import type { Application } from "pixi.js";
import type { IGameSystem, GameState, ItemType } from "types";
import type { EventBus } from "core/EventBus";
import { GridSystem } from "./GridSystem";
import { getItemName } from "../config/items";

/**
 * 浮动文字条目
 */

interface FloatingTextEntry {
    textObj: Text;  // PixiJS Text 对象
    x: number;
    y: number;
    lifetime: number;
    totalLifetime: number;
    active: boolean;    // 是否激活
}

/**
 * 浮动文字系统
 */
export class FloatingTextSystem implements IGameSystem {
    
    private app: Application;
    private eventBus: EventBus;
    private container: Container;

    // 对象池
    private pool: FloatingTextEntry[] = [];
    private readonly POOL_SIZE = 20;

    // 动画配置
    private readonly LIFETIME = 1000;   // ms
    private readonly FLOAT_SPEED = 40;  // 像素/秒

    constructor(app: Application, eventBus: EventBus) {
        this.app = app;
        this.eventBus = eventBus;

        // 创建容器, 确保渲染在最顶层
        this.container = new Container();
        this.app.stage.addChild(this.container);

        this.initPool();

        // 监听作物收获事件
        this.eventBus.on('CROP_HARVESTED', this.onCropHarvested);
    }

    /**
     * 初始化对象池
     */
    private initPool(): void {
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 16,
            fontWeight: 'bold',
            fill: 0xFFFFFF,
            stroke: 0x000000,
            strokeThickness: 3,
        });

        for (let i = 0; i < this.POOL_SIZE; i++) {
            const textObj = new Text('', style);
            textObj.anchor.set(0.5, 0.5);
            textObj.visible = false;
            this.container.addChild(textObj);

            this.pool.push({
                textObj,
                x: 0,
                y: 0,
                lifetime: 0,
                totalLifetime: this.LIFETIME,
                active: false,
            });
        }
    }

    /**
     * 从对象池取出一个可用条目
     */
    private acquireFromPool(): FloatingTextEntry | null {
        const entry = this.pool.find(e => !e.active);

        if (!entry) {
            console.warn('⚠️ FloatingText pool exhausted!');
            return null;
        }
        
        return entry;
    }

    /**
     * 归还条目到对象池
     * @param entry 
     */
    private releaseToPool(entry: FloatingTextEntry): void {
        entry.active = false;
        entry.textObj.visible = false;
    }

    /**
     * 监听收获事件
     * @param data 
     */
    private onCropHarvested = (data: {item: ItemType; count: number; gridX: number, gridY: number}): void => {
        const itemName = getItemName(data.item);
        const text = `+${data.count} ${itemName}`;

        // 网格坐标
        const pixel = GridSystem.gridToPixel(data.gridX, data.gridY);

        this.spawn(text, pixel.x, pixel.y, 0xFFEB3B);
    }

    /**
     * 生成一个浮动文字
     * @param text 
     * @param x 
     * @param y 
     * @param color 
     */
    spawn(text: string, x: number, y: number, color: number = 0xFFFFFF): void {
        const entry = this.acquireFromPool();
        if (!entry) return;

        // 设置文字内容和颜色
        entry.textObj.text = text;
        entry.textObj.style.fill = color;

        // 设置初始位置
        entry.x = x;
        entry.y = y;
        entry.textObj.x = x;
        entry.textObj.y = y;

        // 重置生命周期
        entry.lifetime = this.LIFETIME;
        entry.totalLifetime = this.LIFETIME;

        // 激活
        entry.active = true;
        entry.textObj.visible = true;
        entry.textObj.alpha = 1;

        console.log(`✨ Floating text: "${text}" at (${x}, ${y})`);

    }



    /**
     * 每帧更新所有激活的浮动文字
     * @param deltaTime 
     * @param state 
     */
    update(deltaTime: number, state: GameState): void {
        for (const entry of this.pool) {
            if (!entry.active) continue;

            // 减少生命周期
            entry.lifetime -= deltaTime;

            // 生命结束, 归还对象池
            if (entry.lifetime <= 0) {
                this.releaseToPool(entry);
                continue;
            }

            // 向上飘动
            entry.y -= this.FLOAT_SPEED * (deltaTime / 1000);
            entry.textObj.y = entry.y;

            // 线性淡出
            entry.textObj.alpha = entry.lifetime / entry.totalLifetime;
        }
    }

    destroy(): void {
        this.eventBus.off('CROP_HARVESTED', this.onCropHarvested);
        this.container.destroy({ children: true });
        console.log('✨ FloatingText system destroyed');

    }
}
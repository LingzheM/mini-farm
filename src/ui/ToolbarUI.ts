import { Container, Graphics, Text, TextStyle } from "pixi.js";
import type { Application } from "pixi.js";

/**
 * 工具定义
 */
interface ToolDefinition {
    id: 'hoe' | 'seeds' | 'waterCan';
    key: string;
    name: string;
    color: number;
}

const TOOLS: ToolDefinition[] = [
  { id: 'hoe', key: '1', name: 'Hoe', color: 0x795548 },      // 棕色
  { id: 'seeds', key: '2', name: 'Seed', color: 0x8BC34A },   // 绿色
  { id: 'waterCan', key: '3', name: 'H2O', color: 0x2196F3 }, // 蓝色
];

/**
 * Toolbar 底部的工具槽位展示
 */
export class Toolbar {
    private app: Application;
    private container: Container;

    private slots: Graphics[] = [];
    private icons: Graphics[] = [];
    private labels: Text[] = [];
    private keys: Text[] = [];

    private readonly SLOT_SIZE = 60;
    private readonly SLOT_PADDING = 12;

    constructor(app: Application) {
        this.app = app;
        this.container = new Container();

        this.setupUI();
        this.app.stage.addChild(this.container);

        console.log('🔧 Toolbar initialized');
    }

    private setupUI(): void {
        const totalWidth = TOOLS.length * (this.SLOT_SIZE + this.SLOT_PADDING) - this.SLOT_PADDING;

        // 底部居中
        const startX = (this.app.screen.width - totalWidth) / 2;
        const y = this.app.screen.height - 100;

        for (let i = 0; i < TOOLS.length; i++) {
            const tool = TOOLS[i];
            const x = startX + i * (this.SLOT_SIZE + this.SLOT_PADDING);

            // 槽位背景
            const slotGraphics = new Graphics();
            slotGraphics.x = x;
            slotGraphics.y = y;
            this.container.addChild(slotGraphics);
            this.slots.push(slotGraphics);

            // 工具图标
            const iconGraphics = new Graphics();
            iconGraphics.x = x;
            iconGraphics.y = y;
            this.container.addChild(iconGraphics);
            this.icons.push(iconGraphics);

            // 工具名称
            const labelStyle = new TextStyle({
                fontFamily: 'Arial',
                fontSize: 12,
                fill: 0xFFFFFF,
                fontWeight: 'bold',
            });

            const label = new Text(tool.name, labelStyle);
            label.anchor.set(0.5, 0);
            label.x = x + this.SLOT_SIZE / 2;
            label.y = y + this.SLOT_SIZE - 18;
            this.container.addChild(label);
            this.labels.push(label);

            // 快捷键提示
            const keyStyle = new TextStyle({
                fontFamily: 'Arial',
                fontSize: 10,
                fill: 0xCCCCCC,
            });
            
            const keyText = new Text(tool.key, keyStyle);
            keyText.anchor.set(0.5, 0);
            keyText.x = x + this.SLOT_SIZE / 2;
            keyText.y = y + this.SLOT_SIZE + 4;
            this.container.addChild(keyText);
            this.keys.push(keyText);
        }
    }
    
    update(currentTool: 'hoe' | 'seeds' | 'waterCan'): void {
        for (let i = 0; i < TOOLS.length; i++) {
            const tool = TOOLS[i];
            const isSelected = tool.id === currentTool;

            this.renderSlot(i, tool, isSelected);
        }
    }

    /**
     * 渲染单个槽位
     */
    private renderSlot(index: number, tool: ToolDefinition, selected: boolean): void {
        const slotGraphics = this.slots[index];
        const iconGraphics = this.icons[index];

        slotGraphics.clear();
        iconGraphics.clear();

        // 槽位背景
        slotGraphics.beginFill(0x34495E, 0.9);
        slotGraphics.drawRoundedRect(0, 0, this.SLOT_SIZE, this.SLOT_SIZE, 6);
        slotGraphics.endFill();

        // 边框 (选中高亮)
        if (selected) {
            slotGraphics.lineStyle(3, 0xFFEB3B, 1);
        } else {
            slotGraphics.lineStyle(2, 0x7F8C8D, 0.5);
        }
        slotGraphics.drawRoundedRect(0, 0, this.SLOT_SIZE, this.SLOT_SIZE, 6);

        // 工具图标
        const iconSize = this.SLOT_SIZE - 24;
        const iconOffset = 12;

        iconGraphics.beginFill(tool.color);
        iconGraphics.drawRoundedRect(iconOffset, iconOffset, iconSize, iconSize, 4);
        iconGraphics.endFill();
    }

    destory(): void {
        this.slots.forEach(s => s.destroy());
        this.icons.forEach(i => i.destroy());
        this.labels.forEach(l => l.destroy());
        this.keys.forEach(k => k.destroy());
        this.container.destroy();
    }
}
import type { IGameSystem, GameState, Direction } from "types";

/**
 * 输入系统: 监听和处理玩家输入
 */

export class InputSystem implements IGameSystem {
    // 按键状态映射
    private keys: Map<string, boolean> = new Map();

    // 当前帧的移动指令
    public moveCommand: Direction | null = null;

    public actionCommand: 'use_tool' | 'switch_tool' | null = null;

    // 记录上一帧的space状态
    private lastSpacePressed: boolean = false;

    constructor() {
        this.setupEventListeners();
        console.log('⌨️  Input system initialized');
        console.log('   WASD/Arrow Keys: Move');
        console.log('   Space: Use tool');
        console.log('   E: Switch tool');
    }

    private setupEventListeners(): void {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    private onKeyDown = (event: KeyboardEvent): void => {
        const key = event.key.toLowerCase();

        if (this.keys.get(key)) {
            return;
        }

        this.keys.set(key, true);
        console.log(`🔽 Key pressed: ${key}`);
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
            event.preventDefault();
        }
    }

    private onKeyUp = (event: KeyboardEvent): void => {
        const key = event.key.toLowerCase();
        this.keys.set(key, false);

        console.log(`🔼 Key released: ${key}`);
    }

    public isKeyPressed(key: string): boolean {
        return this.keys.get(key.toLowerCase()) || false;
    }

    update(deltaTime: number, state: GameState): void {
        // 清空上一帧的指令
        this.moveCommand = null;
        this.actionCommand = null;

        if (this.isKeyPressed('W') || this.isKeyPressed('arrowup')) {
            this.moveCommand = 'up';
        } else if (this.isKeyPressed('s') || this.isKeyPressed('arrowdown')) {
            this.moveCommand = 'down';
        } else if (this.isKeyPressed('a') || this.isKeyPressed('arrowleft')) {
            this.moveCommand = 'left';
        } else if (this.isKeyPressed('d') || this.isKeyPressed('arrowright')) {
            this.moveCommand = 'right';
        }

        const spacePressed = this.isKeyPressed(' ');
        if (spacePressed && !this.lastSpacePressed) {
            this.actionCommand = 'use_tool';
            console.log(`⚡ Action command: use_tool`);

        }
        // 更新上一帧状态
        this.lastSpacePressed = spacePressed;

        if (this.isKeyPressed('e')) {
            this.actionCommand = 'switch_tool';
        }

        // if (this.moveCommand) {
        //    console.log(`➡️  Move command: ${this.moveCommand}`);
        // }
        if (this.actionCommand) {
            console.log(`⚡ Action command: ${this.actionCommand}`);
        }
    }

    destroy(): void {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        this.keys.clear();
        console.log('⌨️  Input system destroyed');
    }
}
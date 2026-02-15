import type { IGameSystem, GameState } from "../types";
import { HUD } from "../ui/HUD";
import type { Application } from "pixi.js";
import type { FarmSystem } from "./FarmSystem";
import { InventoryUI } from "../ui/InventoryUI";

export class UISystem implements IGameSystem {
    private hud: HUD;
    private inventoryUI: InventoryUI;
    private farmSystem: FarmSystem;

    constructor(app: Application, farmSystem: FarmSystem) {
        this.hud = new HUD(app);
        this.inventoryUI = new InventoryUI(app);
        this.farmSystem = farmSystem;

        console.log('📊 UI system initialized');
    }



    update(deltaTime: number, state: GameState): void {
        // 更新HUD
        this.hud.update(state);
        // 同步当前工具显示
        this.hud.updateTool(this.farmSystem.getCurrentTool());
        // 更新背包UI
        this.inventoryUI.update(state);
    }

    destroy(): void {
        this.hud.destroy();
        console.log('📊 UI system destroyed');
    }
}
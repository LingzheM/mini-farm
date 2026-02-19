import type { IGameSystem, GameState } from "../types";
import { HUD } from "../ui/HUD";
import type { Application } from "pixi.js";
import type { FarmSystem } from "./FarmSystem";
import { InventoryUI } from "../ui/InventoryUI";
import { Toolbar } from "../ui/ToolbarUI";

export class UISystem implements IGameSystem {
    private hud: HUD;
    private inventoryUI: InventoryUI;
    private toolbar: Toolbar;
    private farmSystem: FarmSystem;

    constructor(app: Application, farmSystem: FarmSystem) {
        this.hud = new HUD(app);
        this.inventoryUI = new InventoryUI(app);
        this.toolbar = new Toolbar(app);
        this.farmSystem = farmSystem;

        console.log('📊 UI system initialized');
    }



    update(deltaTime: number, state: GameState): void {
        // 更新HUD
        this.hud.update(state);
        // 更新背包UI
        this.inventoryUI.update(state);
        // 更新toolbar
        this.toolbar.update(this.farmSystem.getCurrentTool());
    }

    destroy(): void {
        this.hud.destroy();
        this.inventoryUI.destroy();
        this.toolbar.destory();
        console.log('📊 UI system destroyed');
    }
}
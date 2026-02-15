import type { IGameSystem, GameState, ItemType, InventorySlot } from "../types";
import type { EventBus } from "../core/EventBus";
import {ITEMS} from '../config/items'
/**
 * 背包系统 - 管理物品存储
 */
export class InventorySystem implements IGameSystem {

    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        console.log('🎒 Inventory system initialized (24 slots)');
    }

    addItem(itemId: ItemType, count: number, state: GameState): boolean {
        const itemDef = ITEMS[itemId];

        if (!itemDef.stackable) {
            // 不可堆叠物品
            return this.addNonStackableItem(itemId, count, state)
        }

        // 可堆叠物品
        let remainingCount = count;

        for (let i = 0; i < state.inventory.slots.length; i++) {
            const slot = state.inventory.slots[i];

            if (slot && slot.item === itemId && slot.count < itemDef.maxStack) {
                const canAdd = Math.min(remainingCount, itemDef.maxStack - slot.count);
                slot.count += canAdd;
                remainingCount -= canAdd;

                console.log(`🎒 Added ${canAdd}x ${itemDef.name} to slot ${i} (total: ${slot.count})`);

                if (remainingCount === 0) {
                    this.emitItemAdded(itemId, count, state);
                    return true;
                }
            }
        }

        // 第二步: 在空槽位创建
        while (remainingCount > 0) {
            const emptySlotIndex = this.findEmptySlot(state);

            if (emptySlotIndex === -1) {
                // 背包已满
                console.log(`🚫 Inventory full! Cannot add ${remainingCount}x ${itemDef.name}`);
                this.eventBus.emit({ type: 'INVENTORY_FULL', data: null });

                if (remainingCount < count) {
                    this.emitItemAdded(itemId, count - remainingCount, state);
                }

                return false;
            }

            const addCount = Math.min(remainingCount, itemDef.maxStack);
            state.inventory.slots[emptySlotIndex] = {
                item: itemId,
                count: addCount,
            };
            console.log(`🎒 Added ${addCount}x ${itemDef.name} to new slot ${emptySlotIndex}`);
            remainingCount -= addCount;
        }

        this.emitItemAdded(itemId, count, state);
        return true;
    }

    /**
     * 添加不可堆叠物品
     * @param itemId 
     * @param count 
     * @param state 
     * @returns 
     */
    addNonStackableItem(itemId: ItemType, count: number, state: GameState): boolean {
        return true;
    }

    removeItem(itemId: ItemType, count: number, state: GameState): boolean {
        let remainingCount = count;

        for (let i = state.inventory.slots.length - 1; i >= 0; i--) {
            const slot = state.inventory.slots[i];

            if (slot && slot.item === itemId) {
                const removeCount = Math.min(remainingCount, slot.count);
                slot.count -= removeCount;
                remainingCount -= removeCount;

                // 如果堆叠为0
                if (slot.count === 0) {
                    state.inventory.slots[i] = null;
                }

                if (remainingCount === 0) {
                    console.log(`🎒 Removed ${count}x ${ITEMS[itemId].name}`);
                    this.eventBus.emit({
                        type: 'ITEM_REMOVED',
                        data: { item: itemId, count },
                    });
                    return true;
                }
            }
        }
        console.log(`🚫 Not enough ${ITEMS[itemId].name} (need ${count}, have ${count - remainingCount})`);
        return false;
    }

    /**
     * 获取物品总数量
     * @param itemId 
     * @param state 
     * @returns 
     */
    getItemCount(itemId: ItemType, state: GameState): number {
        let total = 0;
        for (const slot of state.inventory.slots) {
            if (slot && slot.item === itemId) {
                total += slot.count;
            }
        }
        return total;
    }

    /**
     * 检查是否有足够数量的物品
     * @param itemId 
     * @param count 
     * @param state 
     */
    hasItem(itemId: ItemType, count: number, state: GameState): boolean {
        return this.getItemCount(itemId, state) >= count;
    }

    /**
     * 查找第一个空槽位
     * @param state 
     * @returns 
     */
    private findEmptySlot(state: GameState): number {
        for (let i = 0; i < state.inventory.slots.length; i++) {
            if (state.inventory.slots[i] === null) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 检查背包是否已满
     * @param state 
     * @returns 
     */
    isFull(state: GameState): boolean {
        return this.findEmptySlot(state) === -1;
    }

    /**
     * 获取已使用槽位
     * @param state 
     * @returns 
     */
    getUsedSlots(state: GameState): number {
        return state.inventory.slots.filter(slot => slot !== null).length;
    }

    /**
     * 切换背包打开 / 关闭
     * @param itemId 
     * @param count 
     * @param state 
     */
    toggleInventory(state: GameState): void {
        state.inventory.isOpen = !state.inventory.isOpen;
        console.log(`🎒 Inventory ${state.inventory.isOpen ? 'opened' : 'closed'}`);
    }

    private emitItemAdded(itemId: ItemType, count: number, state: GameState): void {
        this.eventBus.emit({
            type: 'ITEM_ADD',
            data: { item: itemId, count },
        });
    }

    update(deltaTime: number, state: GameState): void {
        
    }

    destroy(): void {
        
    }
}
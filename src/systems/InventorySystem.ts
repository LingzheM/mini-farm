import type { IGameSystem, GameState, ItemType, InventorySlot } from '../types';
import type { EventBus } from '../core/EventBus';
import { ITEMS } from '../config/items';

/**
 * 背包系统 - 管理物品存储
 * 
 * 功能:
 * - 添加物品(自动堆叠)
 * - 移除物品
 * - 查询物品数量
 * - 检查背包是否已满
 */
export class InventorySystem implements IGameSystem {
  private eventBus: EventBus;
  
  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    console.log('🎒 Inventory system initialized (24 slots)');
  }

  update(deltaTime: number, state: GameState): void {
    // 背包系统不需要每帧更新
  }

  /**
   * 添加物品到背包
   * 
   * 逻辑:
   * 1. 查找是否有相同物品且未满堆叠
   * 2. 如果有,增加数量
   * 3. 如果没有,查找空槽位
   * 4. 如果有空槽,创建新堆叠
   * 5. 如果背包满,返回false
   * 
   * @returns true=成功添加, false=背包已满
   */
  addItem(itemId: ItemType, count: number, state: GameState): boolean {
    const itemDef = ITEMS[itemId];
    
    if (!itemDef.stackable) {
      // 不可堆叠物品(目前所有物品都可堆叠)
      return this.addNonStackableItem(itemId, count, state);
    }
    
    // 可堆叠物品
    let remainingCount = count;
    
    // 第一步: 尝试堆叠到现有物品
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
    
    // 第二步: 在空槽位创建新堆叠
    while (remainingCount > 0) {
      const emptySlotIndex = this.findEmptySlot(state);
      
      if (emptySlotIndex === -1) {
        // 背包已满
        console.log(`🚫 Inventory full! Cannot add ${remainingCount}x ${itemDef.name}`);
        this.eventBus.emit({ type: 'INVENTORY_FULL', data: null });
        
        // 如果有部分添加成功,也触发事件
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
   * 添加不可堆叠物品(未来扩展)
   */
  private addNonStackableItem(itemId: ItemType, count: number, state: GameState): boolean {
    for (let i = 0; i < count; i++) {
      const emptySlot = this.findEmptySlot(state);
      if (emptySlot === -1) return false;
      
      state.inventory.slots[emptySlot] = {
        item: itemId,
        count: 1,
      };
    }
    return true;
  }

  /**
   * 移除物品
   * 
   * @returns true=成功移除, false=物品不足
   */
  removeItem(itemId: ItemType, count: number, state: GameState): boolean {
    let remainingCount = count;
    
    // 从后往前遍历,优先移除后面的堆叠
    for (let i = state.inventory.slots.length - 1; i >= 0; i--) {
      const slot = state.inventory.slots[i];
      
      if (slot && slot.item === itemId) {
        const removeCount = Math.min(remainingCount, slot.count);
        slot.count -= removeCount;
        remainingCount -= removeCount;
        
        // 如果堆叠数量为0,清空槽位
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
    
    // 物品数量不足
    console.log(`🚫 Not enough ${ITEMS[itemId].name} (need ${count}, have ${count - remainingCount})`);
    return false;
  }

  /**
   * 获取物品总数量
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
   */
  hasItem(itemId: ItemType, count: number, state: GameState): boolean {
    return this.getItemCount(itemId, state) >= count;
  }

  /**
   * 查找第一个空槽位
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
   */
  isFull(state: GameState): boolean {
    return this.findEmptySlot(state) === -1;
  }

  /**
   * 获取已使用槽位数
   */
  getUsedSlots(state: GameState): number {
    return state.inventory.slots.filter(slot => slot !== null).length;
  }

  /**
   * 切换背包打开/关闭状态
   */
  toggleInventory(state: GameState): void {
    state.inventory.isOpen = !state.inventory.isOpen;
    console.log(`🎒 Inventory ${state.inventory.isOpen ? 'OPENED' : 'CLOSED'}`);
  }

  /**
   * 触发物品添加事件
   */
  private emitItemAdded(itemId: ItemType, count: number, state: GameState): void {
    this.eventBus.emit({
      type: 'ITEM_ADD',
      data: { item: itemId, count },
    });
  }

  destroy(): void {
    console.log('🎒 Inventory system destroyed');
  }
}
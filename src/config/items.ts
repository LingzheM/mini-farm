import type { ItemDefinition, ItemType } from "../types";

/**
 * 物品配置
 */
export const ITEMS: Record<ItemType, ItemDefinition> = {
    seed_potato: {
    id: 'seed_potato',
    name: '土豆种子',
    category: 'seed',
    stackable: true,
    maxStack: 99,
    description: '种下后3天成熟',
    color: 0x8D6E63, // 棕色
  },
  
  seed_tomato: {
    id: 'seed_tomato',
    name: '番茄种子',
    category: 'seed',
    stackable: true,
    maxStack: 99,
    description: '种下后3天成熟',
    color: 0xFF5722, // 橙红色
  },
  
  // ===== 作物 =====
  crop_potato: {
    id: 'crop_potato',
    name: '土豆',
    category: 'crop',
    stackable: true,
    maxStack: 99,
    description: '新鲜的土豆',
    color: 0xFFEB3B, // 金黄色
  },
  
  crop_tomato: {
    id: 'crop_tomato',
    name: '番茄',
    category: 'crop',
    stackable: true,
    maxStack: 99,
    description: '新鲜的番茄',
    color: 0xF44336, // 红色
  },
};

export function getItemDefinition(itemId: ItemType): ItemDefinition {
    return ITEMS[itemId];
}

export function getItemName(itemId: ItemType): string {
    return ITEMS[itemId].name;
}

export function getItemColor(itemId: ItemType): number {
    return ITEMS[itemId].color;
}
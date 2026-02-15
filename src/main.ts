import { Game } from './core/Game';

function main() {
  const game = new Game();
  
  try {
    game.init();
    game.start();
    
    (window as any).game = game;
    
    console.log('');
    console.log('🎮 ===== MINI FARM GAME =====');
    console.log('');
    console.log('✨ NEW: Inventory System Added!');
    console.log('');
    console.log('🚶 MOVEMENT:');
    console.log('   WASD or Arrow Keys - Move');
    console.log('');
    console.log('🎒 INVENTORY:');
    console.log('   B - Open/Close inventory (24 slots)');
    console.log('   You start with 10 potato seeds');
    console.log('');
    console.log('🌱 FARMING:');
    console.log('   [1] - Hoe (锄头)');
    console.log('   [2] - Seeds (种子)');
    console.log('   [3] - Water Can (水壶)');
    console.log('   [Space] - Use tool / Harvest mature crops');
    console.log('');
    console.log('📖 WORKFLOW:');
    console.log('   1. Till soil (Hoe + Space)');
    console.log('   2. Plant seeds (Seeds + Space, consumes 1 seed from inventory)');
    console.log('   3. Water crops (Water Can + Space)');
    console.log('   4. Wait 3 days');
    console.log('   5. Harvest (Space on golden crop, adds to inventory)');
    console.log('');
    console.log('📊 UI:');
    console.log('   Top-left panel: Time, Energy, Tool');
    console.log('   B: Opens inventory (pauses game)');
    console.log('');
    console.log('⏰ DEBUG COMMANDS:');
    console.log('   game.timeSystem.setTime(4, 6, 0, game.state) - Skip to day 4');
    console.log('   game.inventorySystem.addItem("crop_potato", 10, game.state) - Add items');
    console.log('   game.state.inventory.slots - View inventory data');
    console.log('');
    
  } catch (error) {
    console.error('Failed to initialize game:', error);
  }
}

main();
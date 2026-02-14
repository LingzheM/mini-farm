import { Game } from './core/Game';

function main() {
  const game = new Game();
  
  try {
    game.init();    
    game.start();
    
    // 暴露到全局,方便调试
    (window as any).game = game;
    
    console.log('');
    console.log('🎮 ===== MINI FARM GAME =====');
    console.log('');
    console.log('🚶 MOVEMENT:');
    console.log('   WASD or Arrow Keys - Move');
    console.log('');
    console.log('🌱 FARMING:');
    console.log('   [1] - Equip Hoe (锄头)');
    console.log('   [2] - Equip Seeds (种子)');
    console.log('   [3] - Equip Water Can (水壶)');
    console.log('   [Space] - Use tool');
    console.log('');
    console.log('📖 HOW TO FARM:');
    console.log('   1. Face grass, press [1] then [Space] to till soil');
    console.log('   2. Press [2] then [Space] to plant seeds');
    console.log('   3. Press [3] then [Space] to water');
    console.log('   4. Wait 3 days for crops to grow');
    console.log('');
    console.log('⏰ TIME:');
    console.log('   Speed up: game.timeSystem.setTimeScale(120, game.state)');
    console.log('   Next day: game.timeSystem.setTime(2, 6, 0, game.state)');
    console.log('');

} catch (error) {
    console.error('Failed to initialize game:', error);
  }
}

main();
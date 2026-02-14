import { Game } from './core/Game';

function main() {
  const game = new Game();
  
  try {
    game.init();    
    game.start();
    
    // 暴露到全局,方便调试
    (window as any).game = game;
    
    console.log('👤 You can modify player position in console:');
    console.log('   game.state.player.gridX = 15');
    console.log('   game.state.player.direction = "up"');
        
  } catch (error) {
    console.error('Failed to initialize game:', error);
  }
}

main();
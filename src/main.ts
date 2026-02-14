import { Game } from './core/Game';

function main() {
  const game = new Game();
  
  try {
    game.init();    
    game.start();
    
    // 暴露到全局,方便调试
    (window as any).game = game;
    
    console.log('🎮 NOW YOU CAN MOVE!');
    console.log('   WASD or Arrow Keys: Move');
    console.log('   Watch the console for movement logs');
    console.log('   Watch energy decrease: game.state.player.energy');
     
  } catch (error) {
    console.error('Failed to initialize game:', error);
  }
}

main();
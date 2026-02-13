import { Game } from './core/Game';

function main() {
  const game = new Game();
  
  try {
    game.init();    
    game.start();
    
    // 暴露到全局,方便调试
    (window as any).game = game;
    
    console.log('🗺️  Use console: game.state.world.tiles to inspect the world');
    
  } catch (error) {
    console.error('Failed to initialize game:', error);
  }
}

main();
import { Game } from './core/Game';

function main() {
  const game = new Game();
  
  try {
    game.init();    
    game.start();
    
    // 暴露到全局,方便调试
    (window as any).game = game;
    
    console.log('⌨️  Press WASD or Arrow Keys to test input');
    console.log('   Press Space or E to test actions');
    console.log('   (Movement not implemented yet - see console logs)');

  } catch (error) {
    console.error('Failed to initialize game:', error);
  }
}

main();
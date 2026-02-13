import { Game } from './core/Game';
import { DebugSystem } from './core/DebugSystem';

function main() {
  const game = new Game();
  
  try {
    game.init();
    
    // 注册调试系统
    game.registerSystem(new DebugSystem(game.app));
    
    game.start();
    
    // 暴露到全局,方便调试
    (window as any).game = game;
    
    console.log('👀 Watch the red box bounce!');
    
  } catch (error) {
    console.error('Failed to initialize game:', error);
  }
}

main();
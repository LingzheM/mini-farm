import { Game } from './core/Game';

function main() {
  const game = new Game();
  
  try {
    game.init();    
    game.start();
    
    // 暴露到全局,方便调试
    (window as any).game = game;
    
    console.log('🎮 Game is running!');
    console.log('');
    console.log('⏰ TIME SYSTEM:');
    console.log('   Current time: game.state.time');
    console.log('   Speed up time: game.timeSystem.setTimeScale(120, game.state)');
    console.log('   Skip to night: game.timeSystem.setTime(1, 20, 0, game.state)');
    console.log('');
    console.log('🚶 MOVEMENT:');
    console.log('   WASD or Arrow Keys to move');
    console.log('   Current energy: game.state.player.energy');
    console.log('');
    console.log('📊 Watch the console for time updates!');

} catch (error) {
    console.error('Failed to initialize game:', error);
  }
}

main();
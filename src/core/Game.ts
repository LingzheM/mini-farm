import { Application } from 'pixi.js';
import { GAME_CONFIG } from '../utils/Constants';
import { EventBus } from './EventBus';
import type { GameState, IGameSystem } from '../types';
import { GridSystem } from '../systems/GridSystem'; // 新增
import { PlayerSystem } from '../systems/PlayerSystem'; // 新增
import { InputSystem } from '../systems/InputSystem';

export class Game {
  public app: Application;
  public eventBus: EventBus;
  public state: GameState;
  public gridSystem: GridSystem;
  public inputSystem: InputSystem;
  
  private systems: IGameSystem[] = [];
  private lastTime: number = 0;
  private accumulator: number = 0;
  private readonly fixedTimeStep = GAME_CONFIG.FIXED_TIMESTEP;
  
  constructor() {
    // PixiJS v7 的同步初始化方式
    this.app = new Application({
      width: GAME_CONFIG.CANVAS_WIDTH,
      height: GAME_CONFIG.CANVAS_HEIGHT,
      backgroundColor: GAME_CONFIG.BACKGROUND_COLOR,
    });
    
    this.eventBus = new EventBus();
    this.state = this.createInitialState();

    this.gridSystem = new GridSystem(this.app);
    this.inputSystem = new InputSystem();
  }

  private createInitialState(): GameState {
    return {
      time: {
        day: 1,
        hour: 6,
        minute: 0,
        totalMinutes: 0,
        timeScale: 60,
      },
      player: {
        gridX: 10,
        gridY: 7,
        energy: 100,
        maxEnergy: 100,
        direction: 'down',
        isMoving: false,
      },
      world: {
        tiles: [],
        width: 20,
        height: 15,
      },
    };
  }

  /**
   * 初始化游戏 - v7版本不需要async
   */
  init(): void {
    document.body.appendChild(this.app.view as HTMLCanvasElement);

    // 初始化世界地图
    this.gridSystem.initWorld(this.state);

    // 注册网格
    this.registerSystem(this.gridSystem);
    // 注册输入
    this.registerSystem(this.inputSystem);

    // 注册玩家系统
    this.registerSystem(new PlayerSystem(this.app));
    
    console.log('🎮 Game initialized');
    console.log('👤 Player spawned at grid (10, 7)');

  }

  registerSystem(system: IGameSystem): void {
    this.systems.push(system);
  }

  start(): void {
    this.lastTime = performance.now();
    this.gameLoop();
    console.log('▶️  Game started');
  }

  private gameLoop = (): void => {
    requestAnimationFrame(this.gameLoop);

    const currentTime = performance.now();
    let deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    if (deltaTime > 250) {
      deltaTime = 250;
    }

    this.accumulator += deltaTime;

    while (this.accumulator >= this.fixedTimeStep) {
      this.update(this.fixedTimeStep);
      this.accumulator -= this.fixedTimeStep;
    }
  };

  private update(deltaTime: number): void {
    for (const system of this.systems) {
      system.update(deltaTime, this.state);
    }
  }

  destroy(): void {
    this.systems.forEach(system => system.destroy?.());
    this.systems = [];
    this.eventBus.clear();
    this.app.destroy(true);
    console.log('🛑 Game destroyed');
  }
}
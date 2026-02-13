export const GAME_CONFIG = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    BACKGROUND_COLOR: 0x8BC34A,

    // 游戏循环
    TARGET_FPS: 60,
    FIXED_TIMESTEP: 1000 / 60,
} as const;

export const GRID_CONFIG = {
    TILE_SIZE: 32,
    WORLD_WIDTH: 20,
    WORLD_HEIGHT: 15,
} as const;
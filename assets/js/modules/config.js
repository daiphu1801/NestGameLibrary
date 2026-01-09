// Configuration and Constants
const GameConfig = {
    // Environment variables - can be overridden via window.ENV
    ENV: {
        R2_PUBLIC_URL: window.ENV?.R2_PUBLIC_URL
    },
    
    GAME_CATEGORIES: {
        all: { name: 'all', icon: '🎮' },
        platformer: { name: 'platformer', icon: '🏃' },
        rpg: { name: 'rpg', icon: '⚔️' },
        sports: { name: 'sports', icon: '⚽' },
        fighting: { name: 'fighting', icon: '🥊' },
        puzzle: { name: 'puzzle', icon: '🧩' },
        racing: { name: 'racing', icon: '🏎️' },
        shooter: { name: 'shooter', icon: '🔫' },
        strategy: { name: 'strategy', icon: '🎯' },
        adventure: { name: 'adventure', icon: '🗺️' },
        other: { name: 'other', icon: '📦' }
    },
    
    DEFAULT_GAMES_PER_PAGE: 60,
    RECENT_GAMES_LIMIT: 10,
    SCROLL_TOP_THRESHOLD: 500,
    LAZY_LOAD_ROOT_MARGIN: '200px',
    LAZY_LOAD_THRESHOLD: 0.01,
    EAGER_LOAD_COUNT: 12
};

// Check if running on local server
const isLocalServer = window.location.protocol !== 'file:';

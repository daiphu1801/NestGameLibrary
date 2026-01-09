// Recent Games Management
const RecentGames = {
    STORAGE_KEY: 'nesLibraryRecentGames',
    
    // Load recent games from localStorage
    load() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                AppState.recentGames = JSON.parse(saved);
            }
        } catch (e) {
            console.log('Could not load recent games:', e);
            AppState.recentGames = [];
        }
    },
    
    // Save a game to recent list
    save(game) {
        try {
            // Remove if already exists
            AppState.recentGames = AppState.recentGames.filter(g => g.id !== game.id);
            
            // Add to beginning
            AppState.recentGames.unshift({
                id: game.id,
                name: game.name,
                category: game.category,
                path: game.path,
                rating: game.rating,
                playedAt: Date.now()
            });
            
            // Keep only last N games
            AppState.recentGames = AppState.recentGames.slice(0, GameConfig.RECENT_GAMES_LIMIT);
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(AppState.recentGames));
        } catch (e) {
            console.log('Could not save recent game:', e);
        }
    },
    
    // Get recent games with full data
    get() {
        return AppState.recentGames.map(recent => {
            const fullGame = AppState.allGames.find(g => g.id === recent.id);
            return fullGame || recent;
        }).filter(Boolean);
    }
};

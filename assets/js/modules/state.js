// Application State Management
const AppState = {
    // Game data
    allGames: [],
    filteredGames: [],
    
    // Filters
    currentCategory: 'all',
    searchQuery: '',
    currentSort: 'name-asc',
    
    // Pagination
    currentPage: 1,
    gamesPerPage: GameConfig.DEFAULT_GAMES_PER_PAGE,
    
    // Emulator
    currentNostalgist: null,
    
    // Recent games
    recentGames: [],
    
    // Methods to update state
    setGames(games) {
        this.allGames = games;
    },
    
    setFilteredGames(games) {
        this.filteredGames = games;
    },
    
    setCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;
    },
    
    setSearchQuery(query) {
        this.searchQuery = query;
        this.currentPage = 1;
    },
    
    setSort(sort) {
        this.currentSort = sort;
        this.currentPage = 1;
    },
    
    setPage(page) {
        this.currentPage = page;
    },
    
    setGamesPerPage(count) {
        this.gamesPerPage = count;
        this.currentPage = 1;
    },
    
    setNostalgist(instance) {
        this.currentNostalgist = instance;
    },
    
    reset() {
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.currentPage = 1;
        this.currentSort = 'name-asc';
        this.gamesPerPage = GameConfig.DEFAULT_GAMES_PER_PAGE;
    },
    
    getTotalPages() {
        return Math.ceil(this.filteredGames.length / this.gamesPerPage);
    },
    
    getCurrentPageGames() {
        const start = (this.currentPage - 1) * this.gamesPerPage;
        const end = start + this.gamesPerPage;
        return this.filteredGames.slice(start, end);
    }
};

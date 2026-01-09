// DOM Element References
const DOM = {
    // Main containers
    gameGrid: null,
    gameModal: null,
    modalTitle: null,
    gameContainer: null,
    loadingOverlay: null,
    
    // Search elements
    searchInput: null,
    clearSearchBtn: null,
    searchBtn: null,
    gameCount: null,
    
    // Filter and sort
    sortSelect: null,
    itemsPerPageSelect: null,
    
    // Pagination
    paginationContainer: null,
    paginationBtns: null,
    pageInfo: null,
    
    // Other
    scrollTopBtn: null,
    
    // Initialize all DOM references
    init() {
        this.gameGrid = document.getElementById('gameGrid');
        this.searchInput = document.getElementById('searchInput');
        this.gameModal = document.getElementById('gameModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.gameContainer = document.getElementById('gameContainer');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.gameCount = document.getElementById('gameCount');
        this.clearSearchBtn = document.getElementById('clearSearchBtn');
        this.searchBtn = document.getElementById('searchBtn');
        this.sortSelect = document.getElementById('sortSelect');
        this.itemsPerPageSelect = document.getElementById('itemsPerPageSelect');
        this.paginationContainer = document.getElementById('paginationContainer');
        this.paginationBtns = document.getElementById('paginationBtns');
        this.pageInfo = document.getElementById('pageInfo');
        this.scrollTopBtn = document.getElementById('scrollTopBtn');
    },
    
    // Loading overlay
    showLoading() {
        if (this.loadingOverlay) this.loadingOverlay.classList.remove('hidden');
    },
    
    hideLoading() {
        if (this.loadingOverlay) this.loadingOverlay.classList.add('hidden');
    }
};

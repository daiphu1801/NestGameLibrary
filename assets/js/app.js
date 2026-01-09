// NES Game Library - Main Application
// Modular architecture with separation of concerns

/**
 * Application Entry Point
 * This file orchestrates all modules and handles initialization
 */

const App = {
    // Initialize application
    async init() {
        try {
            // 0. Check if R2_PUBLIC_URL is configured
            if (!GameConfig.ENV.R2_PUBLIC_URL) {
                this.showConfigError();
                return;
            }
            
            // 1. Initialize i18n
            await I18n.init();

            // 2. Initialize Theme (dark/light mode)
            if (typeof ThemeManager !== 'undefined') {
                ThemeManager.init();
            }

            // 3. Initialize DOM references
            DOM.init();

            // 3. Load recent games from localStorage
            RecentGames.load();

            // 4. Show loading
            DOM.showLoading();

            // 5. Load game data
            await this.loadGames();

            // 6. Setup event listeners
            this.setupEventListeners();

            // 7. Initial render
            SearchFilter.filter();
            GameRenderer.render();
            Pagination.render();

            // 8. Update welcome message
            Utils.updateWelcomeMessage(AppState.allGames.length);

            // 9. Hide loading
            DOM.hideLoading();

            console.log(`✅ App initialized with ${AppState.allGames.length} games`);
        } catch (error) {
            console.error('❌ Error initializing app:', error);
            DOM.hideLoading();
        }
    },

    // Load games from games.js
    async loadGames() {
        // Try loading from GAMES_DATA global variable
        if (typeof GAMES_DATA !== 'undefined') {
            const processedGames = this.processGamePaths(GAMES_DATA);
            AppState.setGames(processedGames);
            console.log(`Loaded ${AppState.allGames.length} games from GAMES_DATA`);
            return;
        }

        // Try loading from games.json
        try {
            const response = await fetch('assets/data/games.json');
            if (response.ok) {
                const games = await response.json();
                const processedGames = this.processGamePaths(games);
                AppState.setGames(processedGames);
                console.log(`Loaded ${AppState.allGames.length} games from games.json`);
                return;
            }
        } catch (error) {
            console.log('Could not load games.json:', error);
        }

        // Fallback to demo games
        AppState.setGames(Utils.generateDemoGames());
        console.log(`Using ${AppState.allGames.length} demo games`);
    },
    
    // Show configuration error message
    showConfigError() {
        const errorHTML = `
            <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0a; color: #fafafa; font-family: Inter, sans-serif; padding: 2rem;">
                <div style="max-width: 600px; text-align: center;">
                    <h1 style="font-size: 2rem; margin-bottom: 1rem; color: #8b5cf6;">⚙️ Cấu hình cần thiết</h1>
                    <p style="font-size: 1.125rem; margin-bottom: 2rem; color: #d1d5db;">Vui lòng cấu hình R2 URL để sử dụng ứng dụng</p>
                    
                    <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 1.5rem; text-align: left; margin-bottom: 1.5rem;">
                        <h3 style="margin-bottom: 1rem; color: #8b5cf6;">Bước 1: Tạo file env.js</h3>
                        <code style="display: block; background: #111; padding: 1rem; border-radius: 8px; color: #22c55e; font-family: monospace; white-space: pre;">copy env.example.js env.js</code>
                    </div>
                    
                    <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 1.5rem; text-align: left; margin-bottom: 1.5rem;">
                        <h3 style="margin-bottom: 1rem; color: #8b5cf6;">Bước 2: Cấu hình URL</h3>
                        <p style="margin-bottom: 0.5rem; color: #9ca3af;">Mở env.js và thêm R2 URL của bạn:</p>
                        <code style="display: block; background: #111; padding: 1rem; border-radius: 8px; color: #22c55e; font-family: monospace; white-space: pre; font-size: 0.875rem;">window.ENV = {\n  R2_PUBLIC_URL: 'https://your-r2-url.r2.dev'\n};</code>
                    </div>
                    
                    <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 1.5rem; text-align: left;">
                        <h3 style="margin-bottom: 1rem; color: #8b5cf6;">Bước 3: Load env.js</h3>
                        <p style="margin-bottom: 0.5rem; color: #9ca3af;">Thêm vào index.html (trước các script khác):</p>
                        <code style="display: block; background: #111; padding: 1rem; border-radius: 8px; color: #22c55e; font-family: monospace; white-space: pre; font-size: 0.875rem;">&lt;script src="env.js"&gt;&lt;/script&gt;</code>
                    </div>
                    
                    <p style="margin-top: 2rem; color: #6b7280; font-size: 0.875rem;">📖 Xem thêm chi tiết trong file <strong>README.md</strong></p>
                </div>
            </div>
        `;
        document.body.innerHTML = errorHTML;
    },
    
    // Process game paths to use environment variable
    processGamePaths(games) {
        const R2_BASE_URL = GameConfig.ENV.R2_PUBLIC_URL;
        
        return games.map(game => {
            const processedGame = { ...game };
            
            // If path is just a filename (no http/https), build full URL
            if (processedGame.path && !processedGame.path.startsWith('http')) {
                processedGame.path = `${R2_BASE_URL}/${processedGame.path}`;
            }
            // If path contains old hardcoded URL, replace it
            else if (processedGame.path && processedGame.path.includes('pub-87204256ff0f4764bde4d1dd64f4c380.r2.dev')) {
                const filename = processedGame.path.split('/').pop();
                processedGame.path = `${R2_BASE_URL}/${filename}`;
            }
            
            return processedGame;
        });
    },

    // Setup all event listeners
    setupEventListeners() {
        this.setupSearchListeners();
        this.setupFilterListeners();
        this.setupModalListeners();
        this.setupKeyboardShortcuts();
        this.setupScrollListener();
        this.setupLanguageListener();
    },

    // Setup search-related listeners
    setupSearchListeners() {
        // Search input - show/hide clear button
        if (DOM.searchInput) {
            DOM.searchInput.addEventListener('input', (e) => {
                if (DOM.clearSearchBtn) {
                    DOM.clearSearchBtn.classList.toggle('hidden', !e.target.value);
                }
            });

            // Enter key to search
            DOM.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    SearchFilter.performSearch();
                }
            });
        }

        // Clear search button
        if (DOM.clearSearchBtn) {
            DOM.clearSearchBtn.addEventListener('click', () => {
                SearchFilter.clear();
                if (DOM.searchInput) DOM.searchInput.focus();
            });
        }

        // Search button
        if (DOM.searchBtn) {
            DOM.searchBtn.addEventListener('click', () => SearchFilter.performSearch());
        }
    },

    // Setup filter and sort listeners
    setupFilterListeners() {
        // Sort select
        if (DOM.sortSelect) {
            DOM.sortSelect.addEventListener('change', (e) => {
                AppState.setSort(e.target.value);
                SearchFilter.filter();
                GameRenderer.render();
                Pagination.render();
            });
        }

        // Items per page select
        if (DOM.itemsPerPageSelect) {
            DOM.itemsPerPageSelect.addEventListener('change', (e) => {
                AppState.setGamesPerPage(parseInt(e.target.value));
                SearchFilter.filter();
                GameRenderer.render();
                Pagination.render();
            });
        }

        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                SearchFilter.setCategory(btn.dataset.category);
            });
        });
    },

    // Setup modal listeners
    setupModalListeners() {
        // Close modal on backdrop click
        if (DOM.gameModal) {
            DOM.gameModal.addEventListener('click', (e) => {
                if (e.target === DOM.gameModal) {
                    Modal.close();
                }
            });
        }
    },

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape - close modal
            if (e.key === 'Escape') {
                Modal.close();
            }

            // Ctrl/Cmd + K - focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (DOM.searchInput) DOM.searchInput.focus();
            }

            // Prevent browser capturing game keys when playing
            const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                'z', 'Z', 'x', 'X', 'Enter', 'Shift', ' '];
            if (DOM.gameModal && !DOM.gameModal.classList.contains('hidden') &&
                gameKeys.includes(e.key)) {
                e.preventDefault();
            }
        });
    },

    // Setup scroll listener for scroll-to-top button
    setupScrollListener() {
        if (DOM.scrollTopBtn) {
            DOM.scrollTopBtn.addEventListener('click', () => Utils.scrollToTop());

            window.addEventListener('scroll', Utils.debounce(() => {
                if (window.scrollY > GameConfig.SCROLL_TOP_THRESHOLD) {
                    DOM.scrollTopBtn.classList.remove('opacity-0', 'invisible');
                    DOM.scrollTopBtn.classList.add('opacity-100', 'visible');
                } else {
                    DOM.scrollTopBtn.classList.add('opacity-0', 'invisible');
                    DOM.scrollTopBtn.classList.remove('opacity-100', 'visible');
                }
            }, 100));
        }
    },

    // Setup language change listener
    setupLanguageListener() {
        window.addEventListener('languageChanged', () => {
            GameRenderer.render();
            Pagination.render();
            Utils.updateWelcomeMessage(AppState.allGames.length);
        });
    }
};

// Global functions for inline handlers
function closeModal() {
    Modal.close();
}

function toggleFullscreen() {
    Modal.toggleFullscreen();
}

function resetToDefault() {
    SearchFilter.reset();
}

function clearSearch() {
    SearchFilter.clear();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());

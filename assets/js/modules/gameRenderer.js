// Game Rendering Module
const GameRenderer = {
    // Render games to grid
    render() {
        if (!DOM.gameGrid) return;

        const totalPages = AppState.getTotalPages();
        // Ensure currentPage is within bounds
        if (AppState.currentPage > totalPages && totalPages > 0) {
            AppState.currentPage = totalPages;
        }

        const gamesToShow = AppState.getCurrentPageGames();

        // Update count
        if (DOM.gameCount) {
            DOM.gameCount.textContent = AppState.filteredGames.length;
        }

        DOM.gameGrid.innerHTML = '';

        if (gamesToShow.length === 0) {
            this.renderNoResults();
            return;
        }

        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            gamesToShow.forEach(game => {
                const card = this.createGameCard(game);
                DOM.gameGrid.appendChild(card);
            });
            
            // Setup eager loading for first N images
            const images = DOM.gameGrid.querySelectorAll('img');
            ImageLoader.setupEagerLoading(images, GameConfig.EAGER_LOAD_COUNT);
            
            // Initialize lazy loading for remaining images
            ImageLoader.lazyLoadImages();
        });
    },
    
    // Render no results message
    renderNoResults() {
        DOM.gameGrid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                <svg class="w-20 h-20 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-xl">${t('search.noResults')}</p>
                <p class="text-sm mt-2">${t('search.tryOther')}</p>
                ${AppState.searchQuery ? `<button onclick="SearchFilter.clear()" class="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white transition-colors">${t('search.clearSearch')}</button>` : ''}
            </div>
        `;
    },
    
    // Create game card element
    createGameCard(game) {
        const card = document.createElement('div');
        card.className = 'game-card';

        const categoryInfo = GameConfig.GAME_CATEGORIES[game.category] || GameConfig.GAME_CATEGORIES.other;
        const categoryName = t(`categories.${game.category}`) || t('categories.other');
        const stars = '★'.repeat(game.rating || 3) + '☆'.repeat(5 - (game.rating || 3));
        
        // Function to generate alternative CDN URLs
        const generateAltImageUrls = (gameName, fileName) => {
            const altUrls = [];
            
            // Clean game name for URL encoding
            const cleanName = gameName.replace(/[&*/:`<>?\\|]/g, '_');
            const encodedName = encodeURIComponent(cleanName);
            
            // Alternative CDN sources for NES covers
            // 1. Libretro thumbnails (primary - already in use)
            // 2. Archive.org NES box art collection
            altUrls.push(`https://archive.org/download/nes-box-art/${encodedName}.png`);
            altUrls.push(`https://archive.org/download/nes-box-art/${encodedName}.jpg`);
            
            // 3. Libretro GitHub raw (backup mirror)
            altUrls.push(`https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_Entertainment_System/master/Named_Boxarts/${encodedName}.png`);
            
            // 4. EmulationStation themes CDN
            altUrls.push(`https://raw.githubusercontent.com/RetroPie/es-theme-carbon/master/nes/art/${encodedName}.png`);
            
            return altUrls;
        };
        
        // Extract and validate image URLs
        const imageUrl = (game.image && game.image.trim() !== '') ? game.image : 
                        (game.thumbnail && game.thumbnail.trim() !== '') ? game.thumbnail : 
                        (game.cover && game.cover.trim() !== '') ? game.cover : null;
        
        // Extract fallback URLs with validation
        const fallbackUrls = [];
        
        // Add original fallbacks
        if (game.imageSnap && game.imageSnap.trim() !== '' && game.imageSnap !== imageUrl) {
            fallbackUrls.push(game.imageSnap);
        }
        if (game.imageTitle && game.imageTitle.trim() !== '' && game.imageTitle !== imageUrl) {
            fallbackUrls.push(game.imageTitle);
        }
        
        // Add alternative CDN sources
        const altUrls = generateAltImageUrls(game.name, game.fileName);
        fallbackUrls.push(...altUrls);

        card.innerHTML = `
            <div class="game-card__image-container">
                ${imageUrl ? `
                    <img 
                        data-src="${imageUrl}" 
                        alt="${game.name}"
                        class="game-card__image lazy-load"
                        data-fallbacks='${JSON.stringify(fallbackUrls)}'
                        data-category="${game.category}"
                        data-category-icon="${categoryInfo.icon}"
                        onerror="handleImageError(this)"
                    />
                ` : ''}
                <div class="game-card__fallback${imageUrl ? ' hidden' : ''}" data-category="${game.category}">
                    <div class="game-card__fallback-icon">${categoryInfo.icon}</div>
                    <div class="game-card__fallback-text">${categoryName}</div>
                </div>
                <div class="game-card__overlay">
                    <div class="game-card__play-icon">▶</div>
                    <div class="game-card__play-text">${t('game.playNow') || 'Chơi Ngay'}</div>
                </div>
                ${game.isFeatured ? '<div class="game-card__badge">⭐ HOT</div>' : ''}
                ${game.region ? `<div class="game-card__region">${game.region.split(',')[0]}</div>` : ''}
            </div>
            <div class="game-card__content">
                <div class="game-card__header">
                    <div class="game-card__category">
                        <span class="game-card__category-icon">${categoryInfo.icon}</span>
                        <span class="game-card__category-name">${categoryName}</span>
                    </div>
                    ${game.year ? `<span class="game-card__year">${game.year}</span>` : ''}
                </div>
                <h3 class="game-card__title">${game.name}</h3>
                ${game.description ? `<p class="game-card__description">${game.description}</p>` : ''}
                <div class="game-card__meta">
                    <div class="game-card__rating">
                        <span>${stars}</span>
                    </div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            RecentGames.save(game);
            GamePlayer.play(game);
        });

        return card;
    }
};

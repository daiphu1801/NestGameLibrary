// Search and Filter Module
const SearchFilter = {
    // Filter games based on current state
    filter() {
        AppState.filteredGames = AppState.allGames.filter(game => {
            const matchesCategory = AppState.currentCategory === 'all' || 
                                   game.category === AppState.currentCategory;
            const matchesSearch = !AppState.searchQuery ||
                game.name.toLowerCase().includes(AppState.searchQuery) ||
                (game.description && game.description.toLowerCase().includes(AppState.searchQuery));

            return matchesCategory && matchesSearch;
        });
        
        this.sort();
    },
    
    // Sort games based on current sort option
    sort() {
        switch (AppState.currentSort) {
            case 'name-asc':
                AppState.filteredGames.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                AppState.filteredGames.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'rating-desc':
                AppState.filteredGames.sort((a, b) => (b.rating || 3) - (a.rating || 3));
                break;
            case 'year-desc':
                AppState.filteredGames.sort((a, b) => (b.year || 1985) - (a.year || 1985));
                break;
            case 'year-asc':
                AppState.filteredGames.sort((a, b) => (a.year || 1985) - (b.year || 1985));
                break;
        }
    },
    
    // Perform search
    performSearch() {
        if (DOM.searchInput) {
            const query = DOM.searchInput.value.toLowerCase().trim();
            AppState.setSearchQuery(query);
            this.filter();
            GameRenderer.render();
            Pagination.render();
            
            // Scroll to game grid
            Utils.scrollToElement(DOM.gameGrid);
        }
    },
    
    // Clear search
    clear() {
        if (DOM.searchInput) {
            DOM.searchInput.value = '';
        }
        if (DOM.clearSearchBtn) {
            DOM.clearSearchBtn.classList.add('hidden');
        }
        AppState.setSearchQuery('');
        this.filter();
        GameRenderer.render();
        Pagination.render();
    },
    
    // Update category
    setCategory(category) {
        AppState.setCategory(category);
        this.updateCategoryButtons(category);
        this.filter();
        GameRenderer.render();
        Pagination.render();
    },
    
    // Update category button styles
    updateCategoryButtons(activeCategory) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            const isActive = btn.dataset.category === activeCategory;
            
            if (isActive) {
                btn.classList.remove('bg-gray-800', 'text-gray-300');
                btn.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-pink-600', 
                                 'text-white', 'shadow-lg', 'shadow-purple-500/30');
            } else {
                btn.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-pink-600', 
                                    'text-white', 'shadow-lg', 'shadow-purple-500/30');
                btn.classList.add('bg-gray-800', 'text-gray-300');
            }
        });
    },
    
    // Reset all filters
    reset() {
        AppState.reset();
        
        if (DOM.searchInput) DOM.searchInput.value = '';
        if (DOM.clearSearchBtn) DOM.clearSearchBtn.classList.add('hidden');
        if (DOM.sortSelect) DOM.sortSelect.value = 'name-asc';
        if (DOM.itemsPerPageSelect) {
            DOM.itemsPerPageSelect.value = '60';
        }
        
        this.updateCategoryButtons('all');
        Utils.scrollToTop();
        this.filter();
        GameRenderer.render();
        Pagination.render();
    }
};

// Pagination Module
const Pagination = {
    // Render pagination UI
    render() {
        if (!DOM.paginationBtns || !DOM.paginationContainer) return;

        const totalPages = AppState.getTotalPages();
        const start = (AppState.currentPage - 1) * AppState.gamesPerPage + 1;
        const end = Math.min(AppState.currentPage * AppState.gamesPerPage, AppState.filteredGames.length);

        // Hide pagination if no results
        if (AppState.filteredGames.length === 0) {
            DOM.paginationContainer.classList.add('hidden');
            return;
        }
        DOM.paginationContainer.classList.remove('hidden');

        // Update page info
        if (DOM.pageInfo) {
            DOM.pageInfo.innerHTML = `${t('pagination.showing')} <span class="font-bold text-purple-400">${start}-${end}</span> ${t('pagination.of')} <span class="font-bold text-white">${AppState.filteredGames.length}</span> ${t('pagination.games')}`;
        }

        // Generate pagination buttons
        DOM.paginationBtns.innerHTML = '';

        if (totalPages <= 1) {
            return;
        }

        // Previous button
        const prevBtn = this.createButton('←', AppState.currentPage > 1, () => this.goToPage(AppState.currentPage - 1));
        prevBtn.title = t('pagination.previous');
        DOM.paginationBtns.appendChild(prevBtn);

        // First page
        if (AppState.currentPage > 3) {
            DOM.paginationBtns.appendChild(this.createButton('1', true, () => this.goToPage(1)));
            if (AppState.currentPage > 4) {
                DOM.paginationBtns.appendChild(this.createEllipsis());
            }
        }

        // Page numbers
        for (let i = Math.max(1, AppState.currentPage - 2); i <= Math.min(totalPages, AppState.currentPage + 2); i++) {
            const btn = this.createButton(i.toString(), true, () => this.goToPage(i), i === AppState.currentPage);
            DOM.paginationBtns.appendChild(btn);
        }

        // Last page
        if (AppState.currentPage < totalPages - 2) {
            if (AppState.currentPage < totalPages - 3) {
                DOM.paginationBtns.appendChild(this.createEllipsis());
            }
            DOM.paginationBtns.appendChild(this.createButton(totalPages.toString(), true, () => this.goToPage(totalPages)));
        }

        // Next button
        const nextBtn = this.createButton('→', AppState.currentPage < totalPages, () => this.goToPage(AppState.currentPage + 1));
        nextBtn.title = t('pagination.next');
        DOM.paginationBtns.appendChild(nextBtn);
    },
    
    // Create pagination button
    createButton(text, enabled, onClick, isActive = false) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = `px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            isActive 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' 
                : enabled 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
        }`;
        
        if (enabled && !isActive) {
            btn.addEventListener('click', onClick);
        }
        
        return btn;
    },
    
    // Create ellipsis element
    createEllipsis() {
        const span = document.createElement('span');
        span.textContent = '...';
        span.className = 'px-2 text-gray-500';
        return span;
    },
    
    // Go to specific page
    goToPage(page) {
        const totalPages = AppState.getTotalPages();
        if (page >= 1 && page <= totalPages) {
            AppState.setPage(page);
            GameRenderer.render();
            this.render();
            Utils.scrollToElement(DOM.gameGrid);
        }
    }
};

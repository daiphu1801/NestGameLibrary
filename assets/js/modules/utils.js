// Utility Functions
const Utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Smooth scroll to element
    scrollToElement(element, behavior = 'smooth') {
        if (element) {
            element.scrollIntoView({ behavior, block: 'start' });
        }
    },
    
    // Smooth scroll to top
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    // Update welcome message with game count
    updateWelcomeMessage(count) {
        const welcomeDesc = document.getElementById('welcomeDescription');
        if (welcomeDesc) {
            welcomeDesc.textContent = t('welcome.description', { count });
        }
    },
    
    // Generate demo games (fallback)
    generateDemoGames() {
        const demoGames = [
            'Super Mario Bros.', 'Super Mario Bros. 2', 'Super Mario Bros. 3',
            'Mega Man', 'Mega Man 2', 'Castlevania', 'Contra',
            'The Legend of Zelda', 'Final Fantasy', 'Tetris',
            'Metroid', 'Punch-Out!!', 'Double Dragon'
        ];

        return demoGames.map((name, i) => ({
            id: i + 1,
            name: name,
            path: null,
            category: 'platformer',
            description: 'Classic NES game',
            rating: 4,
            year: 1985 + i,
            isFeatured: i < 5
        }));
    }
};

// Theme Manager Module
// Handles dark/light mode switching with smooth transitions

const ThemeManager = {
    currentTheme: 'dark',

    // Initialize theme on page load
    init() {
        // Load saved theme or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme, false);

        // Setup toggle button
        this.setupToggleButton();

        console.log(`🎨 Theme initialized: ${savedTheme}`);
    },

    // Setup theme toggle button click handler
    setupToggleButton() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    },

    // Toggle between dark and light mode
    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme, true);
    },

    // Set theme and update UI
    setTheme(theme, animate = true) {
        this.currentTheme = theme;

        // Add transition class for smooth animation
        if (animate) {
            document.documentElement.classList.add('theme-transitioning');
        }

        // Set theme attribute
        document.documentElement.setAttribute('data-theme', theme);

        // Save to localStorage
        localStorage.setItem('theme', theme);

        // Update toggle button icon
        this.updateToggleIcon();

        // Remove transition class after animation
        if (animate) {
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transitioning');
            }, 300);
        }
    },

    // Update toggle button icon based on current theme
    updateToggleIcon() {
        const toggleBtn = document.getElementById('themeToggle');
        if (!toggleBtn) return;

        if (this.currentTheme === 'dark') {
            toggleBtn.innerHTML = `
                <span class="text-xl transition-transform duration-300 hover:rotate-180">🌙</span>
            `;
            toggleBtn.setAttribute('title', 'Switch to Light Mode');
        } else {
            toggleBtn.innerHTML = `
                <span class="text-xl transition-transform duration-300 hover:rotate-180">☀️</span>
            `;
            toggleBtn.setAttribute('title', 'Switch to Dark Mode');
        }
    },

    // Get current theme
    getTheme() {
        return this.currentTheme;
    }
};

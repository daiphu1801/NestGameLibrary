// i18n - Internationalization Module
// Supports Vietnamese (vi) and English (en)

const I18n = {
    currentLang: 'vi',
    translations: {},
    supportedLangs: ['vi', 'en'],
    langNames: {
        vi: '🇻🇳 Tiếng Việt',
        en: '🇺🇸 English'
    },

    // Initialize i18n
    async init() {
        // Get saved language or detect from browser
        const savedLang = localStorage.getItem('nes-library-lang');
        const browserLang = navigator.language.slice(0, 2);

        this.currentLang = savedLang ||
            (this.supportedLangs.includes(browserLang) ? browserLang : 'vi');

        await this.loadTranslations(this.currentLang);
        this.updateUI();

        return this;
    },

    // Load translations for a language
    async loadTranslations(lang) {
        try {
            const response = await fetch(`assets/data/lang/${lang}.json`);
            if (response.ok) {
                this.translations = await response.json();
                console.log(`Loaded translations for: ${lang}`);
            } else {
                console.error(`Failed to load translations for: ${lang}`);
                // Fallback to Vietnamese
                if (lang !== 'vi') {
                    await this.loadTranslations('vi');
                }
            }
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    },

    // Get translation by key path (e.g., 'header.searchPlaceholder')
    t(keyPath, replacements = {}) {
        const keys = keyPath.split('.');
        let value = this.translations;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                console.warn(`Translation not found: ${keyPath}`);
                return keyPath;
            }
        }

        // Handle replacements like {count}
        if (typeof value === 'string') {
            for (const [placeholder, replacement] of Object.entries(replacements)) {
                value = value.replace(`{${placeholder}}`, replacement);
            }
        }

        return value;
    },

    // Set language and reload translations
    async setLanguage(lang) {
        if (!this.supportedLangs.includes(lang)) {
            console.error(`Unsupported language: ${lang}`);
            return;
        }

        this.currentLang = lang;
        localStorage.setItem('nes-library-lang', lang);

        await this.loadTranslations(lang);
        this.updateUI();

        // Emit event for app to update dynamic content
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    },

    // Toggle between languages
    toggleLanguage() {
        const currentIndex = this.supportedLangs.indexOf(this.currentLang);
        const nextIndex = (currentIndex + 1) % this.supportedLangs.length;
        this.setLanguage(this.supportedLangs[nextIndex]);
    },

    // Get current language
    getCurrentLanguage() {
        return this.currentLang;
    },

    // Update all UI elements with data-i18n attribute
    updateUI() {
        // Update text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });

        // Update titles
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            el.title = this.t(key);
        });

        // Update language toggle button
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            const nextLang = this.supportedLangs[
                (this.supportedLangs.indexOf(this.currentLang) + 1) % this.supportedLangs.length
            ];
            langToggle.innerHTML = this.currentLang === 'vi' ? '🇻🇳' : '🇺🇸';
            langToggle.title = `Switch to ${this.langNames[nextLang]}`;
        }

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;
    }
};

// Export for global use
window.I18n = I18n;
window.t = (key, replacements) => I18n.t(key, replacements);

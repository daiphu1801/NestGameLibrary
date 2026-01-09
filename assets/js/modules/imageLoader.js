// Image Lazy Loading Module
const ImageLoader = {
    // Handle image error with fallbacks
    handleImageError(img) {
        // Prevent infinite error loops
        if (img.dataset.errorHandled === 'true') {
            this.showFallbackIcon(img);
            return;
        }
        
        const fallbacks = img.dataset.fallbacks;
        if (fallbacks) {
            try {
                const fallbackUrls = JSON.parse(fallbacks);
                if (fallbackUrls && fallbackUrls.length > 0) {
                    const nextUrl = fallbackUrls.shift();
                    if (nextUrl && nextUrl.trim() !== '') {
                        img.dataset.fallbacks = JSON.stringify(fallbackUrls);
                        img.src = nextUrl;
                        return;
                    }
                }
            } catch (e) {
                console.error('Error parsing fallbacks:', e);
            }
        }
        
        // Mark as error handled and show fallback
        img.dataset.errorHandled = 'true';
        this.showFallbackIcon(img);
    },
    
    // Show fallback icon
    showFallbackIcon(img) {
        img.style.display = 'none';
        const fallbackElement = img.parentElement.querySelector('.game-card__fallback');
        if (fallbackElement) {
            fallbackElement.classList.remove('hidden');
        }
    },
    
    // Initialize lazy loading for images
    lazyLoadImages() {
        const lazyImages = document.querySelectorAll('img.lazy-load');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const dataSrc = img.dataset.src;
                        
                        // Validate data-src before loading
                        if (dataSrc && dataSrc.trim() !== '' && dataSrc !== 'null' && dataSrc !== 'undefined') {
                            img.loading = 'lazy';
                            img.src = dataSrc;
                            img.classList.remove('lazy-load');
                            img.classList.add('loaded');
                        } else {
                            // No valid image URL, show fallback immediately
                            this.showFallbackIcon(img);
                            img.classList.remove('lazy-load');
                        }
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: GameConfig.LAZY_LOAD_ROOT_MARGIN,
                threshold: GameConfig.LAZY_LOAD_THRESHOLD
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(img => {
                const dataSrc = img.dataset.src;
                if (dataSrc && dataSrc.trim() !== '' && dataSrc !== 'null' && dataSrc !== 'undefined') {
                    img.src = dataSrc;
                    img.classList.remove('lazy-load');
                    img.classList.add('loaded');
                } else {
                    this.showFallbackIcon(img);
                    img.classList.remove('lazy-load');
                }
            });
        }
    },
    
    // Setup eager loading for first N images
    setupEagerLoading(images, count) {
        // Convert NodeList to Array
        const imageArray = Array.from(images);
        
        imageArray.slice(0, count).forEach(img => {
            const dataSrc = img.dataset.src;
            
            // Validate data-src before loading
            if (dataSrc && dataSrc.trim() !== '' && dataSrc !== 'null' && dataSrc !== 'undefined') {
                img.loading = 'eager';
                img.src = dataSrc;
                img.classList.remove('lazy-load');
                img.classList.add('loaded');
            } else {
                // No valid image URL, show fallback immediately
                this.showFallbackIcon(img);
                img.classList.remove('lazy-load');
            }
        });
    }
};

// Global function for inline onerror attribute
function handleImageError(img) {
    ImageLoader.handleImageError(img);
}

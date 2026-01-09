// Modal Management Module
const Modal = {
    // Show modal
    show(game) {
        if (!DOM.modalTitle || !DOM.gameModal) return;

        DOM.modalTitle.textContent = game.name;
        DOM.gameModal.classList.remove('hidden');
        DOM.gameModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    },
    
    // Close modal
    close() {
        if (!DOM.gameModal) return;

        DOM.gameModal.classList.add('hidden');
        DOM.gameModal.classList.remove('flex');
        document.body.style.overflow = '';

        // Stop emulator
        if (AppState.currentNostalgist) {
            try {
                AppState.currentNostalgist.exit();
            } catch (e) {
                console.log('Error stopping emulator:', e);
            }
            AppState.setNostalgist(null);
        }

        // Clear container
        if (DOM.gameContainer) {
            DOM.gameContainer.innerHTML = '';
        }
    },
    
    // Toggle fullscreen
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            DOM.gameModal.requestFullscreen().catch(err => {
                console.log('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
};

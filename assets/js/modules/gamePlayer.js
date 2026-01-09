// Game Player Module (Nostalgist Integration)
const GamePlayer = {
    // Play game
    async play(game) {
        Modal.show(game);

        DOM.gameContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-white">
                <div class="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
                <p class="text-lg mb-2">${t('game.loading')} ${game.name}...</p>
                <p class="text-sm text-gray-400">${t('game.waitMessage')}</p>
            </div>
        `;

        try {
            // Exit previous emulator
            if (AppState.currentNostalgist) {
                try {
                    await AppState.currentNostalgist.exit();
                } catch (e) {
                    console.log('Could not exit previous emulator:', e);
                }
                AppState.setNostalgist(null);
            }

            DOM.gameContainer.innerHTML = '';

            if (isLocalServer && game.path) {
                const encodedPath = encodeURI(game.path);
                console.log(`Loading game from: ${encodedPath}`);

                // Use respondToGlobalEvents to capture keyboard input globally
                const nostalgist = await Nostalgist.nes({
                    rom: encodedPath,
                    respondToGlobalEvents: true
                });
                
                AppState.setNostalgist(nostalgist);

                const canvas = nostalgist.getCanvas();
                DOM.gameContainer.appendChild(canvas);
                canvas.style.cssText = 'width:100%;height:100%;object-fit:contain;image-rendering:pixelated;';
                canvas.tabIndex = 0;
                canvas.focus();

                console.log('Game loaded successfully!');
            } else {
                this.showServerHint();
            }
        } catch (error) {
            console.error('Error loading game:', error);
            this.showError(error);
        }
    },
    
    // Pick file and play (fallback)
    async pickAndPlay() {
        try {
            DOM.gameContainer.innerHTML = '';

            const nostalgist = await Nostalgist.nes({
                rom: showOpenFilePicker,
                respondToGlobalEvents: true
            });
            
            AppState.setNostalgist(nostalgist);

            const canvas = nostalgist.getCanvas();
            DOM.gameContainer.appendChild(canvas);
            canvas.style.cssText = 'width:100%;height:100%;object-fit:contain;image-rendering:pixelated;';

            // Focus canvas for keyboard input
            canvas.tabIndex = 0;
            canvas.focus();
        } catch (error) {
            console.error('Error with file picker:', error);
            DOM.gameContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-white p-8 text-center">
                    <p class="text-red-400">${error.message}</p>
                </div>
            `;
        }
    },
    
    // Show server hint message
    showServerHint() {
        DOM.gameContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-white p-8">
                <div class="text-6xl mb-4">📁</div>
                <p class="text-lg mb-4 text-center">${t('game.runServerHint')}</p>
                <code class="bg-gray-800 px-4 py-2 rounded-lg text-purple-400 mb-6">npx serve .</code>
                <p class="text-gray-400 mb-4">${t('game.orSelectManually')}</p>
                <button onclick="GamePlayer.pickAndPlay()" class="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-bold transition-colors">
                    📂 ${t('game.selectRom')}
                </button>
            </div>
        `;
    },
    
    // Show error message
    showError(error) {
        DOM.gameContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-white p-8 text-center">
                <svg class="w-16 h-16 mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <p class="text-xl mb-2">${t('game.loadError')}</p>
                <p class="text-gray-400 mb-4">${error.message || t('game.tryAgain')}</p>
                <button onclick="GamePlayer.pickAndPlay()" class="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-bold transition-colors">
                    📂 ${t('game.selectRom')}
                </button>
            </div>
        `;
    }
};

// Global function for inline onclick
function pickAndPlayGame() {
    GamePlayer.pickAndPlay();
}

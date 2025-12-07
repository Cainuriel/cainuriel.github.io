/**
 * AUDIO SYSTEM MODULE
 * ====================
 * Real audio system implementation using HTML5 Audio API
 * This file should be loaded BEFORE script.js
 *
 * Audio files structure:
 * - assets/interactions/ (6 files)
 * - assets/bgm/ (2 files)
 * - assets/narration/ (3 files)
 */

(function() {
    'use strict';

    console.log('%c[AUDIO SYSTEM] Initializing real audio module...', 'color: #00FF3C; font-weight: bold; font-size: 16px');

    // Audio file configuration
    const AUDIO_FILES = {
        buttonMouseOver: { path: 'assets/interactions/buttonMouseOverHk.wav', type: 'effect' },
        clickEffect: { path: 'assets/interactions/clickEffectHk.wav', type: 'effect' },
        closeClick: { path: 'assets/interactions/closeClickHk.wav', type: 'effect' },
        linkGlitch: { path: 'assets/interactions/linkGlitchHk.wav', type: 'effect' },
        playBtnHover: { path: 'assets/interactions/playBtnHoverHk.wav', type: 'effect' },
        projectsClick: { path: 'assets/interactions/projectsClickHk.wav', type: 'effect' },
        hariBgm: { path: 'assets/bgm/cainuriel.mp3', type: 'music' },
        alarmBgm: { path: 'assets/bgm/alarm.wav', type: 'music' },
        aboutNarration: { path: 'assets/narration/about_narration.mp3', type: 'narration' },
        experienceNarration: { path: 'assets/narration/experience_narration.mp3', type: 'narration' },
        contactNarration: { path: 'assets/narration/contact_narration.mp3', type: 'narration' }
    };

    // Initialize UI_AUDIO object
    window.UI_AUDIO = {};
    window.AUDIO_UNLOCKED = false;
    window.AUDIO_VIZ_INITIALIZED = false;
    let loadedCount = 0;
    const totalCount = Object.keys(AUDIO_FILES).length;

    // Create real audio elements
    Object.entries(AUDIO_FILES).forEach(([label, config]) => {
        const audio = new Audio();
        audio.src = config.path;
        audio.volume = 1;
        audio.preload = 'auto';

        // Handle successful load
        audio.addEventListener('loadeddata', function() {
            loadedCount++;
            console.log(
                `%c[AUDIO] Loaded ${loadedCount}/${totalCount}: ${label}`,
                'color: lime; font-weight: bold'
            );

            if (loadedCount === totalCount) {
                console.log(
                    '%c[AUDIO SUCCESS] All audio files loaded and ready! 🎵',
                    'color: lime; font-weight: bold; font-size: 18px'
                );
                console.log('%c[AUDIO] Available:', 'color: cyan', Object.keys(window.UI_AUDIO));
            }
        });

        // Handle errors
        audio.addEventListener('error', function(e) {
            console.error(
                `%c[AUDIO ERROR] Failed to load: ${label}`,
                'color: red; font-weight: bold',
                config.path,
                e
            );
        });

        // Wrap play method to handle autoplay restrictions silently
        const originalPlay = audio.play.bind(audio);
        audio.play = function() {
            return originalPlay().catch(err => {
                // Silently ignore autoplay restrictions
                if (err.name === 'NotAllowedError') {
                    console.log(`[AUDIO] Autoplay blocked for ${label} - user interaction required`);
                } else {
                    console.error(`[AUDIO] Play error for ${label}:`, err);
                }
                return Promise.resolve(); // Return resolved promise to avoid uncaught errors
            });
        };

        // Store in global object
        window.UI_AUDIO[label] = audio;
    });

    // Unlock audio on first user interaction
    function unlockAudio() {
        if (window.AUDIO_UNLOCKED) return;
        
        console.log('%c[AUDIO] Unlocking audio context on user interaction...', 'color: yellow; font-weight: bold');
        
        // Try to play and pause each audio to unlock them
        Object.values(window.UI_AUDIO).forEach(audio => {
            audio.play().then(() => {
                audio.pause();
                audio.currentTime = 0;
            }).catch(() => {
                // Silently fail - some audio might not be ready yet
            });
        });
        
        window.AUDIO_UNLOCKED = true;
        console.log('%c[AUDIO] Audio unlocked! Ready to play. ✓', 'color: lime; font-weight: bold');
        
        // Remove listeners after first interaction
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('mousedown', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
    }

    // Add listeners for user interaction (any gesture unlocks audio)
    document.addEventListener('click', unlockAudio);
    document.addEventListener('mousedown', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    console.log('%c[AUDIO SYSTEM] Initialization complete - loading files...', 'color: #00FF3C; font-weight: bold');
    console.log('%c[AUDIO] Created ' + totalCount + ' audio elements', 'color: cyan');

})();

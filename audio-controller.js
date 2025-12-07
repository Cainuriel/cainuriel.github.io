/**
 * AUDIO CONTROLLER
 * ================
 * Sistema de audio INDEPENDIENTE de script.js
 *
 * Este controlador crea sus propios elementos Audio para evitar
 * el problema de createMediaElementSource() que "secuestra" los audios.
 *
 * Carga ANTES de script.js para que UI_AUDIO esté disponible para el visualizador,
 * pero este controlador usa elementos SEPARADOS para reproducir audio.
 */

(function() {
    'use strict';

    console.log('%c[AUDIO CONTROLLER] Initializing...', 'color: #00FF3C; font-weight: bold; font-size: 14px');

    // =============================================
    // CONFIGURACIÓN DE ARCHIVOS DE AUDIO
    // =============================================
    const AUDIO_CONFIG = {
        // Música de fondo
        music: {
            path: 'assets/bgm/cainuriel.mp3',
            volume: 0.4,
            loop: true
        },
        // Alarma (transmisión corrupta)
        alarm: {
            path: 'assets/bgm/alarm.wav',
            volume: 0.5,
            loop: true
        },
        // Efectos de interacción
        effects: {
            buttonHover: { path: 'assets/interactions/buttonMouseOverHk.wav', volume: 0.6 },
            click: { path: 'assets/interactions/clickEffectHk.wav', volume: 0.7 },
            close: { path: 'assets/interactions/closeClickHk.wav', volume: 0.7 },
            glitch: { path: 'assets/interactions/linkGlitchHk.wav', volume: 0.5 },
            playHover: { path: 'assets/interactions/playBtnHoverHk.wav', volume: 0.6 },
            projectClick: { path: 'assets/interactions/projectsClickHk.wav', volume: 0.7 }
        }
    };

    // =============================================
    // ESTADO INTERNO
    // =============================================
    let musicAudio = null;
    let alarmAudio = null;
    let effectsAudio = {};
    let isUnlocked = false;
    let isMusicPlaying = false;
    let isAlarmPlaying = false;
    
    // AudioContext para visualización (osciloscopio)
    let audioContext = null;
    let analyserNode = null;
    let musicSource = null;

    // =============================================
    // CREAR ELEMENTOS DE AUDIO
    // =============================================
    function createAudioElement(config) {
        const audio = new Audio();
        audio.src = config.path;
        audio.volume = config.volume || 1;
        audio.loop = config.loop || false;
        audio.preload = 'auto';
        return audio;
    }

    // Crear audio de música (separado de UI_AUDIO)
    musicAudio = createAudioElement(AUDIO_CONFIG.music);
    musicAudio.addEventListener('loadeddata', () => {
        console.log('%c[AUDIO CONTROLLER] Music loaded: cainuriel.mp3', 'color: lime');
    });

    // Crear audio de alarma (separado de UI_AUDIO)
    alarmAudio = createAudioElement(AUDIO_CONFIG.alarm);
    alarmAudio.addEventListener('loadeddata', () => {
        console.log('%c[AUDIO CONTROLLER] Alarm loaded: alarm.wav', 'color: lime');
    });

    // Crear efectos de sonido
    Object.entries(AUDIO_CONFIG.effects).forEach(([name, config]) => {
        effectsAudio[name] = createAudioElement(config);
    });

    // =============================================
    // DESBLOQUEAR AUDIO (requiere interacción del usuario)
    // =============================================
    function unlockAudio() {
        if (isUnlocked) return;

        console.log('%c[AUDIO CONTROLLER] Unlocking audio...', 'color: yellow');

        // Intentar reproducir y pausar para desbloquear (con delay para evitar AbortError)
        const unlockPromises = [musicAudio, alarmAudio, ...Object.values(effectsAudio)].map(audio => {
            return audio.play().then(() => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        audio.pause();
                        audio.currentTime = 0;
                        resolve();
                    }, 100);
                });
            }).catch(() => {});
        });

        Promise.all(unlockPromises).then(() => {
            isUnlocked = true;
            console.log('%c[AUDIO CONTROLLER] Audio unlocked!', 'color: lime; font-weight: bold');
        });

        // Remover listeners
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
    }

    // DISABLED: Manual unlock via playEffect() is now preferred
    // This prevents double-unlock attempts
    // document.addEventListener('click', unlockAudio);
    // document.addEventListener('touchstart', unlockAudio);
    // document.addEventListener('keydown', unlockAudio);

    // =============================================
    // API PÚBLICA
    // =============================================
    const AudioController = {
        // --- MÚSICA ---
        playMusic: function() {
            if (isAlarmPlaying) {
                console.log('[AUDIO CONTROLLER] Cannot play music while alarm is active');
                return false;
            }

            // Initialize audio context and analyser on first play
            if (!audioContext) {
                try {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    analyserNode = audioContext.createAnalyser();
                    analyserNode.fftSize = 2048;
                    analyserNode.smoothingTimeConstant = 0.9;
                    
                    musicSource = audioContext.createMediaElementSource(musicAudio);
                    musicSource.connect(analyserNode);
                    analyserNode.connect(audioContext.destination);
                    
                    // Expose for oscilloscope
                    window.AUDIO_CONTEXT = audioContext;
                    window.AUDIO_ANALYSER = analyserNode;
                    
                    console.log('%c[AUDIO CONTROLLER] AudioContext and Analyser initialized for oscilloscope', 'color: lime; font-weight: bold');
                } catch (error) {
                    console.error('[AUDIO CONTROLLER] Failed to create audio context:', error);
                }
            }

            // Resume AudioContext if suspended
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }

            musicAudio.loop = true;
            musicAudio.volume = AUDIO_CONFIG.music.volume;

            return musicAudio.play().then(() => {
                isMusicPlaying = true;
                console.log('%c[AUDIO CONTROLLER] Music playing', 'color: lime');
                return true;
            }).catch(err => {
                console.warn('[AUDIO CONTROLLER] Music play failed:', err.message);
                return false;
            });
        },

        pauseMusic: function() {
            musicAudio.pause();
            isMusicPlaying = false;
            console.log('[AUDIO CONTROLLER] Music paused');
            return Promise.resolve(false); // Return Promise for consistency
        },

        toggleMusic: function() {
            if (isMusicPlaying) {
                return this.pauseMusic();
            } else {
                return this.playMusic();
            }
        },

        isMusicPlaying: function() {
            return isMusicPlaying;
        },

        // --- ALARMA ---
        playAlarm: function(volume) {
            // Pausar música primero
            if (isMusicPlaying) {
                musicAudio.pause();
                isMusicPlaying = false;
            }

            alarmAudio.loop = true;
            // Usar volumen personalizado o el por defecto
            alarmAudio.volume = volume !== undefined ? volume : AUDIO_CONFIG.alarm.volume;
            alarmAudio.currentTime = 0;

            return alarmAudio.play().then(() => {
                isAlarmPlaying = true;
                console.log('%c[AUDIO CONTROLLER] ALARM PLAYING! Volume: ' + (alarmAudio.volume * 100) + '%', 'color: red; font-weight: bold; font-size: 16px');
                return true;
            }).catch(err => {
                console.error('[AUDIO CONTROLLER] Alarm play failed:', err.message);
                return false;
            });
        },

        stopAlarm: function() {
            alarmAudio.pause();
            alarmAudio.currentTime = 0;
            isAlarmPlaying = false;
            console.log('[AUDIO CONTROLLER] Alarm stopped');
        },

        isAlarmPlaying: function() {
            return isAlarmPlaying;
        },

        // --- EFECTOS ---
        playEffect: function(effectName) {
            const effect = effectsAudio[effectName];
            if (!effect) {
                console.warn('[AUDIO CONTROLLER] Effect not found:', effectName);
                return Promise.resolve(false);
            }

            effect.currentTime = 0;
            
            return effect.play().then(() => {
                // If this play succeeds and we weren't unlocked, mark as unlocked
                if (!isUnlocked) {
                    isUnlocked = true;
                    console.log('%c[AUDIO CONTROLLER] Audio unlocked via effect!', 'color: lime; font-weight: bold');
                    
                    // Remove unlock listeners since we're now unlocked
                    document.removeEventListener('click', unlockAudio);
                    document.removeEventListener('touchstart', unlockAudio);
                    document.removeEventListener('keydown', unlockAudio);
                }
                return true;
            }).catch((err) => {
                console.log('[AUDIO CONTROLLER] Effect play blocked (normal if not unlocked yet)');
                return false;
            });
        },

        // --- UTILIDADES ---
        setMusicVolume: function(vol) {
            musicAudio.volume = Math.max(0, Math.min(1, vol));
        },

        setAlarmVolume: function(vol) {
            alarmAudio.volume = Math.max(0, Math.min(1, vol));
        },

        isUnlocked: function() {
            return isUnlocked;
        }
    };

    // =============================================
    // EXPONER GLOBALMENTE
    // =============================================
    window.AudioController = AudioController;

    // También mantener UI_AUDIO para compatibilidad con script.js (visualizador)
    // Pero estos serán "secuestrados" por createMediaElementSource
    window.UI_AUDIO = window.UI_AUDIO || {};
    window.UI_AUDIO.hariBgm = window.UI_AUDIO.hariBgm || createAudioElement(AUDIO_CONFIG.music);
    window.UI_AUDIO.alarmBgm = window.UI_AUDIO.alarmBgm || createAudioElement(AUDIO_CONFIG.alarm);
    window.UI_AUDIO.buttonMouseOver = window.UI_AUDIO.buttonMouseOver || effectsAudio.buttonHover;
    window.UI_AUDIO.clickEffect = window.UI_AUDIO.clickEffect || effectsAudio.click;
    window.UI_AUDIO.closeClick = window.UI_AUDIO.closeClick || effectsAudio.close;
    window.UI_AUDIO.linkGlitch = window.UI_AUDIO.linkGlitch || effectsAudio.glitch;
    window.UI_AUDIO.playBtnHover = window.UI_AUDIO.playBtnHover || effectsAudio.playHover;
    window.UI_AUDIO.projectsClick = window.UI_AUDIO.projectsClick || effectsAudio.projectClick;

    // Narraciones (para el visualizador)
    window.UI_AUDIO.aboutNarration = window.UI_AUDIO.aboutNarration || createAudioElement({ path: 'assets/narration/about_narration.mp3', volume: 1 });
    window.UI_AUDIO.experienceNarration = window.UI_AUDIO.experienceNarration || createAudioElement({ path: 'assets/narration/experience_narration.mp3', volume: 1 });
    window.UI_AUDIO.contactNarration = window.UI_AUDIO.contactNarration || createAudioElement({ path: 'assets/narration/contact_narration.mp3', volume: 1 });

    // Flags de compatibilidad
    window.AUDIO_UNLOCKED = false;
    window.MUSIC_PLAYING = false;

    console.log('%c[AUDIO CONTROLLER] Ready! API: window.AudioController', 'color: #00FF3C; font-weight: bold');
    console.log('[AUDIO CONTROLLER] Methods: playMusic(), pauseMusic(), toggleMusic(), playAlarm(), stopAlarm(), playEffect(name)');

})();

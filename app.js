document.addEventListener('DOMContentLoaded', () => {
    // Enhanced logging configuration
    const debugMode = document.querySelector('meta[name="debug"]').content === 'enabled';
    const log = (component, type, message, data = {}) => {
        if (debugMode) {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}][${component}][${type}] ${message}`, {
                systemTime: performance.now(),
                userAgent: navigator.userAgent,
                ...data
            });
        }
    };

    log('SYSTEM', 'INIT', 'Application starting', {
        version: document.querySelector('meta[name="version"]').content,
        debugMode: debugMode
    });

    // Intro screen functionality
    const startButton = document.getElementById('startButton');
    const introScreen = document.querySelector('.intro-screen');
    
    startButton.addEventListener('click', () => {
        log('UI', 'Start button clicked');
        introScreen.classList.add('hidden');
        setTimeout(() => {
            introScreen.style.display = 'none';
            log('SCENE', 'Intro screen hidden');
        }, 1000);
    });

    // Scene initialization
    const scene = AFRAME.scenes[0];
    
    // Camera controls
    const camera = document.querySelector('[camera]');
    const moveSpeed = 0.1;
    let moveDirection = { x: 0, z: 0 };

    // Control system with logging
    const controlMap = {
        'ArrowUp': 'forward',
        'w': 'forward',
        'ArrowDown': 'backward', 
        's': 'backward',
        'ArrowLeft': 'left',
        'a': 'left',
        'ArrowRight': 'right',
        'd': 'right'
    };

    document.addEventListener('keydown', (e) => {
        if (controlMap[e.key]) {
            const direction = controlMap[e.key];
            log('CONTROL', `Keyboard input: ${direction}`);
            
            switch(direction) {
                case 'forward': moveDirection.z = -moveSpeed; break;
                case 'backward': moveDirection.z = moveSpeed; break;
                case 'left': moveDirection.x = -moveSpeed; break;
                case 'right': moveDirection.x = moveSpeed; break;
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (controlMap[e.key]) {
            log('CONTROL', `Keyboard release: ${controlMap[e.key]}`);
            moveDirection = { x: 0, z: 0 };
        }
    });

    // Touch controls implementation
    document.querySelectorAll('.touch-button').forEach(button => {
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const action = button.getAttribute('data-action');
            log('CONTROL', `Touch input: ${action}`);
            
            switch(action) {
                case 'forward': moveDirection.z = -moveSpeed; break;
                case 'left': moveDirection.x = -moveSpeed; break;
                case 'right': moveDirection.x = moveSpeed; break;
            }
        });

        button.addEventListener('mouseup', (e) => {
            e.preventDefault();
            log('CONTROL', 'Touch release');
            moveDirection = { x: 0, z: 0 };
        });
    });

    // Optimized animation loop with performance safeguards
    const perf = {
        frameCount: 0,
        lastFpsUpdate: performance.now(),
        currentFps: 0,
        maxFps: 60,
        lastFrameTime: performance.now()
    };

    const animationLoop = () => {
        const now = performance.now();
        const delta = now - perf.lastFrameTime;
        const frameInterval = 1000 / perf.maxFps;
        
        // Throttle frame rate
        if (delta >= frameInterval) {
            perf.frameCount++;
            perf.lastFrameTime = now - (delta % frameInterval);

            // FPS tracking
            if (now - perf.lastFpsUpdate >= 1000) {
                perf.currentFps = perf.frameCount;
                perf.frameCount = 0;
                perf.lastFpsUpdate = now;
                log('PERF', `FPS: ${perf.currentFps}`);
            }

            // Camera movement with bounds checking
            if (camera) {
                const position = camera.getAttribute('position');
                const newPos = {
                    x: position.x + moveDirection.x,
                    y: Math.max(0, position.y),
                    z: position.z + moveDirection.z
                };
                
                if (Math.abs(newPos.x) < 100 && Math.abs(newPos.z) < 100) {
                    camera.setAttribute('position', newPos);
                }
            }
        }
        
        requestAnimationFrame(animationLoop);
    };

    // Start optimized loop
    animationLoop();

    // Initial performance log
    log('SYSTEM', 'Scene initialized', {
        renderer: scene.renderer.info.render,
        memory: scene.renderer.info.memory
    });

    // Interactive info points with debug
    const infoPoints = document.querySelectorAll('.info-point');
    log('SYSTEM', `Found ${infoPoints.length} info points in DOM`);
    
    infoPoints.forEach((point, index) => {
        log('INFO_POINT', `Setting up info point #${index}`, { element: point });
        const sphere = point.querySelector('a-sphere');
        
        point.addEventListener('click', (e) => {
            log('INFO_POINT', `Click event on point #${index}`, { target: e.target });
            if (e.target === point || e.target === sphere) {
                log('INFO_POINT', 'Valid click target');
                e.stopPropagation();
                const info = point.getAttribute('data-info') || 
                    'This interactive element provides information about the experience.';
                log('MODAL', 'Showing modal with info', { content: info });
                showModal(info);
            } else {
                log('INFO_POINT', 'Invalid click target - ignoring');
            }
        });
    });

    function showModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h3 class="text-lg font-bold mb-2">Guidance:</h3>
                <p>${content}</p>
                <div class="mt-4 text-sm">
                    <p>Next actions:</p>
                    <ul class="list-disc pl-5 mt-2">
                        <li>Use WASD or arrow keys to move</li>
                        <li>Click other interactive elements</li>
                        <li>Change weather effects above</li>
                    </ul>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', () => {
            log('MODAL', 'Modal closed');
            modal.remove();
        });
    }

    // Weather system with proper presets
    const weatherSelect = document.getElementById('weather-select');
    const weather = document.getElementById('weather');
    
    if (!weatherSelect) {
        log('ERROR', 'Weather select element not found!');
    } else {
        log('WEATHER', 'Weather select element found', { element: weatherSelect });
    }
    
    weatherSelect.addEventListener('change', (e) => {
        try {
            const preset = e.target.value.toLowerCase();
            const particleCount = window.innerWidth > 768 ? 1000 : 250;
            const presets = {
                rain: {
                    color: '#A0C0FF',
                    velocity: {x: 0, y: -5, z: 0},
                    acceleration: {x: 0, y: -0.2, z: 0},
                    size: 0.05,
                    opacity: 0.8
                },
                snow: {
                    color: '#FFFFFF', 
                    velocity: {x: 0, y: -1, z: 0},
                    acceleration: {x: 0.1, y: 0, z: 0.1},
                    size: 0.1,
                    opacity: 0.9
                },
                dust: {
                    color: '#C2B280',
                    velocity: {x: 0.5, y: 0.1, z: 0.5},
                    acceleration: {x: 0, y: 0, z: 0},
                    size: 0.03,
                    opacity: 0.6
                }
            };

            const config = presets[preset] 
                ? `preset: ${preset};
                   color: ${presets[preset].color};
                   particleCount: ${particleCount};
                   velocity: ${JSON.stringify(presets[preset].velocity).replace(/"/g, '')};
                   acceleration: ${JSON.stringify(presets[preset].acceleration).replace(/"/g, '')};
                   size: ${presets[preset].size};
                   opacity: ${presets[preset].opacity}`
                : 'preset: none; particleCount: 0';
            
            weather.setAttribute('particle-system', config);
            log('WEATHER', `Changed to ${preset}`, { particleCount });
        } catch (err) {
            log('ERROR', 'Weather system failed', { error: err.message });
            showModal('Weather effect failed to update.');
        }
    });

    // Error handling
    document.querySelector('#city').addEventListener('error', (e) => {
        log('ERROR', 'Model load error', { error: e });
        showModal('3D model failed to load. Please check your connection.');
    });

    // Performance optimization
    window.addEventListener('resize', () => {
        scene.renderer.setPixelRatio(window.devicePixelRatio);
        log('PERF', 'Window resized', { pixelRatio: window.devicePixelRatio });
    });
});

// Register optimized render component
AFRAME.registerComponent('optimized-render', {
    init() {
        this.el.sceneEl.renderer.autoClear = false;
        this.el.sceneEl.renderer.sortObjects = true;
        console.log('[RENDER] Optimized renderer initialized');
    }
});
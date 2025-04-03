// Optimized version with debug logging
document.addEventListener('DOMContentLoaded', () => {
    console.log('[SYSTEM] Initializing optimized application v0.0.2');

    // Debug configuration
    const debugMode = true; // Force debug on
    const log = (type, message, data = {}) => {
        console.log(`[${type}] ${message}`, data);
    };

    // Verify DOM elements exist
    console.log('Checking for required elements...');
    const weatherSelect = document.getElementById('weather-select');
    const weatherElement = document.getElementById('weather');
    const infoPoints = document.querySelectorAll('.info-point');
    
    if (!weatherSelect) console.error('Weather select not found!');
    if (!weatherElement) console.error('Weather element not found!');
    console.log(`Found ${infoPoints.length} info points`);

    // Weather system with enhanced debug
    const weatherSystem = {
        select: weatherSelect,
        element: weatherElement,
        update(preset) {
            console.log('Updating weather to:', preset);
            const configs = {
                rain: `preset: rain; color: #A0C0FF; particleCount: 1000`,
                snow: `preset: snow; color: #FFFFFF; particleCount: 1000`, 
                dust: `preset: dust; color: #C2B280; particleCount: 1000`
            };
            this.element.setAttribute('particle-system', configs[preset] || 'preset: none');
        }
    };

    if (weatherSystem.select && weatherSystem.element) {
        console.log('Weather select element:', weatherSystem.select);
        console.log('Weather element:', weatherSystem.element);
        
        weatherSystem.select.addEventListener('change', (e) => {
            console.log('Change event triggered on select');
            console.log('Event target:', e.target);
            console.log('Selected value:', e.target.value);
            weatherSystem.update(e.target.value.toLowerCase());
        });
        
        // Add click debug directly to select
        weatherSystem.select.addEventListener('click', (e) => {
            console.log('Click event on select', e);
        });
        
        weatherSystem.update(weatherSystem.select.value.toLowerCase());
    } else {
        console.error('Weather system elements missing!');
        console.log('Document body:', document.body.innerHTML);
    }

    // Info points with click debugging
    infoPoints.forEach((point, i) => {
        const sphere = point.querySelector('a-sphere');
        console.log(`Setting up info point ${i} with sphere:`, sphere);
        
        point.addEventListener('click', (e) => {
            console.log(`Click detected on point ${i}`, e.target);
            if (e.target === point || e.target === sphere) {
                const info = point.getAttribute('data-info') || 'Default info';
                console.log('Showing modal:', info);
                alert(`DEBUG: Would show modal with: ${info}`); // Simple fallback
            }
        });
    });

    console.log('Optimized initialization complete');
});
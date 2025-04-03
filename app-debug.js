// Enhanced debug version
document.addEventListener('DOMContentLoaded', () => {
    console.log('[DEBUG] Starting enhanced debug version');

    // Debug all elements
    const debugElement = (name, el) => {
        if (!el) {
            console.error(`${name} element not found!`);
            return false;
        }
        console.log(`${name} element found:`, el);
        return true;
    };

    // Weather system debug
    const weatherSelect = document.getElementById('weather-select');
    const weatherElement = document.getElementById('weather');
    debugElement('Weather select', weatherSelect);
    debugElement('Weather element', weatherElement);

    if (weatherSelect && weatherElement) {
        weatherSelect.addEventListener('change', (e) => {
            console.log('Weather change event:', {
                value: e.target.value,
                event: e
            });
            // Simple visual feedback
            weatherElement.setAttribute('color', 'yellow');
            setTimeout(() => {
                weatherElement.removeAttribute('color');
            }, 500);
        });

        // Add click test
        // Enhanced weather select handling
        weatherSelect.addEventListener('click', (e) => {
            console.log('Weather select click:', {
                x: e.clientX,
                y: e.clientY,
                target: e.target
            });
            e.target.style.border = '2px solid red';
            setTimeout(() => {
                e.target.style.border = '';
            }, 500);
        });

        // Add touch support
        weatherSelect.addEventListener('touchstart', (e) => {
            e.preventDefault();
            console.log('Weather select touch:', e.changedTouches[0]);
            weatherSelect.click();
        });
    }

    // Info points debug
    document.querySelectorAll('.info-point').forEach((point, i) => {
        const sphere = point.querySelector('a-sphere');
        console.log(`Info point ${i}:`, point);
        console.log(`Sphere ${i}:`, sphere);

        // Visual feedback
        sphere.addEventListener('mouseenter', () => {
            sphere.setAttribute('scale', '1.2 1.2 1.2');
        });
        sphere.addEventListener('mouseleave', () => {
            sphere.setAttribute('scale', '1 1 1');
        });

        // Add multiple interaction methods
        const handleInteraction = (type, e) => {
            console.log(`${type} on point ${i}`, {
                target: e.target,
                screenX: e.screenX,
                screenY: e.screenY,
                clientX: e.clientX, 
                clientY: e.clientY
            });
            
            // Visual feedback
            sphere.setAttribute('color', 'red');
            setTimeout(() => {
                sphere.setAttribute('color', '#2196F3');
            }, 200);

            alert(`DEBUG: ${type} detected on point ${i}`);
        };

        // Mouse events
        point.addEventListener('click', (e) => handleInteraction('Click', e));
        point.addEventListener('mousedown', (e) => handleInteraction('MouseDown', e));
        
        // Touch events
        point.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleInteraction('TouchStart', e.changedTouches[0]);
        });
    });

    console.log('[DEBUG] Setup complete');
});
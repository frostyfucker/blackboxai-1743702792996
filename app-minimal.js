// Minimal interaction test version
document.addEventListener('DOMContentLoaded', () => {
    console.log('[MINIMAL TEST] Starting basic interaction test');

    // Test weather select
    const weatherSelect = document.getElementById('weather-select');
    if (weatherSelect) {
        weatherSelect.addEventListener('change', function(e) {
            alert(`Weather changed to: ${e.target.value}`);
            console.log('Weather select worked:', e.target.value);
        });
        console.log('Weather select element:', weatherSelect);
    } else {
        console.error('Weather select not found!');
    }

    // Test sphere click
    const spheres = document.querySelectorAll('a-sphere');
    spheres.forEach((sphere, i) => {
        sphere.addEventListener('click', function(e) {
            alert(`Sphere ${i} clicked`);
            console.log('Sphere click worked:', e.target);
        });
        console.log(`Sphere ${i} found:`, sphere);
    });

    console.log('[MINIMAL TEST] Setup complete');
});
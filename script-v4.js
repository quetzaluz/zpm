// Version 4: Multiple hex SVGs that expand on scroll
let hexes = [];
let scrollProgress = 0;

function createHexes() {
    const container = document.getElementById('hexContainer');
    container.innerHTML = '';
    hexes = [];
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const hexCount = 7; // Central hex + 6 surrounding hexes
    const baseRadius = 150;
    
    // Create central hex
    const centerHex = createHexElement(centerX, centerY, 0, 0);
    hexes.push({
        element: centerHex,
        x: centerX,
        y: centerY,
        ring: 0,
        baseSize: 200
    });
    container.appendChild(centerHex);
    
    // Create 6 surrounding hexes
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = centerX + baseRadius * Math.cos(angle);
        const y = centerY + baseRadius * Math.sin(angle);
        
        const hex = createHexElement(x, y, i, 1);
        hexes.push({
            element: hex,
            x,
            y,
            ring: 1,
            baseSize: 150,
            baseX: x,
            baseY: y
        });
        container.appendChild(hex);
    }
    
    // Create outer ring of 12 hexes
    const outerRadius = baseRadius * 2;
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const x = centerX + outerRadius * Math.cos(angle);
        const y = centerY + outerRadius * Math.sin(angle);
        
        const hex = createHexElement(x, y, i, 2);
        hexes.push({
            element: hex,
            x,
            y,
            ring: 2,
            baseSize: 120,
            baseX: x,
            baseY: y
        });
        container.appendChild(hex);
    }
}

function createHexElement(x, y, index, ring) {
    const hexWrapper = document.createElement('div');
    hexWrapper.className = 'hex-wrapper';
    hexWrapper.style.left = `${x}px`;
    hexWrapper.style.top = `${y}px`;
    hexWrapper.style.transform = 'translate(-50%, -50%)';
    
    const hexObject = document.createElement('object');
    hexObject.type = 'image/svg+xml';
    hexObject.data = 'assets/svg/hex.svg';
    hexObject.className = 'hex-svg';
    hexObject.setAttribute('data-ring', ring);
    hexObject.setAttribute('data-index', index);
    
    hexWrapper.appendChild(hexObject);
    return hexWrapper;
}

function updateHexes() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    hexes.forEach(hex => {
        // Calculate scale based on ring and scroll progress
        // Outer rings scale more
        const ringScale = 1 + (hex.ring * 0.2);
        const scrollScale = 1 + (scrollProgress * (0.5 + hex.ring * 0.3));
        const totalScale = ringScale * scrollScale;
        
        // Update position for outer hexes (they move outward as they scale)
        if (hex.ring > 0 && hex.baseX !== undefined) {
            const dx = hex.baseX - centerX;
            const dy = hex.baseY - centerY;
            const newX = centerX + dx * scrollScale;
            const newY = centerY + dy * scrollScale;
            
            hex.element.style.left = `${newX}px`;
            hex.element.style.top = `${newY}px`;
        }
        
        // Update scale
        const hexObject = hex.element.querySelector('.hex-svg');
        if (hexObject) {
            hexObject.style.transform = `scale(${totalScale})`;
            hexObject.style.opacity = 0.7 + (scrollProgress * 0.3);
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const pageLoadTime = Date.now();
    window.pageLoadTime = pageLoadTime;
    
    createHexes();
    window.addEventListener('resize', () => {
        createHexes();
        updateHexes();
    });
    
    // Show text after 2 seconds
    const textOverlay = document.getElementById('textOverlay');
    setTimeout(() => {
        if (window.scrollY <= 10) {
            textOverlay.classList.add('visible');
        }
    }, 2000);
    
    // Scroll handler
    let ticking = false;
    
    function handleScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        scrollProgress = Math.min(scrollY / windowHeight, 1);
        
        updateHexes();
        
        // Show/hide text
        if (scrollY > 10) {
            textOverlay.classList.remove('visible');
        } else {
            if (window.pageLoadTime && Date.now() - window.pageLoadTime > 2000) {
                textOverlay.classList.add('visible');
            }
        }
        
        // Show nav menu
        const navMenu = document.querySelector('.nav-menu');
        if (scrollY > windowHeight * 0.5) {
            navMenu.classList.add('visible');
        } else {
            navMenu.classList.remove('visible');
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });
    
    handleScroll();
});

// Version 3: Grid-based particle mandala with hexagons (original version 4 style)
const colors = ['#FF3333', '#FFEB00', '#00FF66', '#00D9FF', '#FF00CC'];
let cells = [];
let scrollProgress = 0;

function createGrid() {
    const container = document.getElementById('gridContainer');
    container.innerHTML = '';
    cells = [];
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const maxRadius = Math.min(window.innerWidth, window.innerHeight) * 0.5;
    const cellSize = 15;
    const spacing = 25;
    
    // Create radial grid pattern
    for (let ring = 0; ring < 20; ring++) {
        const radius = (ring / 20) * maxRadius;
        const cellCount = Math.floor((2 * Math.PI * radius) / spacing);
        
        for (let i = 0; i < cellCount; i++) {
            const angle = (i / cellCount) * Math.PI * 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.style.left = `${x}px`;
            cell.style.top = `${y}px`;
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            
            // Create hexagon shape using clip-path
            const points = [];
            for (let j = 0; j < 6; j++) {
                const hexAngle = (Math.PI / 3) * j;
                const px = 50 + 50 * Math.cos(hexAngle);
                const py = 50 + 50 * Math.sin(hexAngle);
                points.push(`${px}% ${py}%`);
            }
            cell.style.clipPath = `polygon(${points.join(', ')})`;
            cell.style.backgroundColor = colors[ring % colors.length];
            cell.style.animationDelay = `${(ring + i) * 0.1}s`;
            
            cells.push({
                element: cell,
                x,
                y,
                radius,
                angle,
                ring
            });
            
            container.appendChild(cell);
        }
    }
}

function updateGrid() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const scale = 1 + scrollProgress * 0.5;
    
    cells.forEach((cell, index) => {
        const newRadius = cell.radius * scale;
        const rotation = scrollProgress * 360;
        const newAngle = cell.angle + (rotation * Math.PI / 180);
        const x = centerX + newRadius * Math.cos(newAngle);
        const y = centerY + newRadius * Math.sin(newAngle);
        
        cell.element.style.left = `${x}px`;
        cell.element.style.top = `${y}px`;
        cell.element.style.transform = `scale(${1 + scrollProgress * 0.3})`;
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const pageLoadTime = Date.now();
    window.pageLoadTime = pageLoadTime;
    
    createGrid();
    window.addEventListener('resize', () => {
        createGrid();
        updateGrid();
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
        
        updateGrid();
        
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

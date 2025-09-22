// Generate radiating diamond pattern
function generateRadiatingPattern() {
    const svg = document.getElementById('mandalaSvg');
    const patternGroup = document.getElementById('radiatingPattern');
    const centerX = 500;
    const centerY = 500;
    const maxRadius = 700;
    const innerRadius = 120; // Radius of central white circle
    
    // Color sequence matching the image
    const colors = ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF'];
    
    // Create more rings for denser pattern
    const ringCount = 60;
    const baseSpokes = 20; // Base number of spokes, increases with radius
    
    for (let ring = 0; ring < ringCount; ring++) {
        const ringProgress = ring / ringCount;
        const ringRadius = innerRadius + (ringProgress * (maxRadius - innerRadius));
        const nextRingRadius = innerRadius + (((ring + 1) / ringCount) * (maxRadius - innerRadius));
        const ringWidth = nextRingRadius - ringRadius;
        
        // Increase spokes as we move outward for better coverage
        const spokes = Math.floor(baseSpokes + (ringProgress * 30));
        
        // Calculate diamond dimensions for this ring
        const avgRadius = (ringRadius + nextRingRadius) / 2;
        const circumference = 2 * Math.PI * avgRadius;
        const diamondWidth = circumference / spokes;
        const diamondHeight = ringWidth * 1.2; // Slightly elongated
        
        for (let spoke = 0; spoke < spokes; spoke++) {
            const angle = (spoke * 360 / spokes) * (Math.PI / 180);
            const x = centerX + avgRadius * Math.cos(angle);
            const y = centerY + avgRadius * Math.sin(angle);
            
            // Create diamond shape (rotated rhombus)
            const diamond = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            
            // Calculate diamond points - aligned radially
            const halfWidth = diamondWidth / 2;
            const halfHeight = diamondHeight / 2;
            
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            
            // Create elongated diamond aligned with radial direction
            const points = [
                [x + halfWidth * cos, y + halfWidth * sin],
                [x - halfHeight * sin, y + halfHeight * cos],
                [x - halfWidth * cos, y - halfWidth * sin],
                [x + halfHeight * sin, y - halfHeight * cos]
            ];
            
            const pointsString = points.map(p => `${p[0]},${p[1]}`).join(' ');
            diamond.setAttribute('points', pointsString);
            
            // Color based on position for repeating pattern
            const colorIndex = (ring * 5 + spoke) % colors.length;
            diamond.setAttribute('fill', colors[colorIndex]);
            diamond.setAttribute('class', 'diamond');
            diamond.setAttribute('data-color-index', colorIndex);
            diamond.setAttribute('data-ring', ring);
            diamond.setAttribute('data-spoke', spoke);
            
            patternGroup.appendChild(diamond);
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    generateRadiatingPattern();
    
    // Show text after 2 seconds, hide when scrolling
    const textOverlay = document.getElementById('textOverlay');
    setTimeout(() => {
        textOverlay.classList.add('visible');
    }, 2000);
    
    // Hide text when user starts scrolling
    let hasScrolled = false;
    window.addEventListener('scroll', () => {
        if (!hasScrolled && window.scrollY > 50) {
            textOverlay.classList.remove('visible');
            hasScrolled = true;
        }
    }, { once: false });
    
    // Scroll animation handler
    let lastScrollY = 0;
    let ticking = false;
    
    function handleScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const scrollProgress = Math.min(scrollY / windowHeight, 1);
        
        // Animate white circle growth
        const whiteCircle = document.getElementById('whiteCircle');
        const maxCircleSize = Math.max(window.innerWidth, window.innerHeight) * 2;
        
        if (scrollProgress > 0.1) {
            whiteCircle.classList.add('growing');
            const circleSize = 240 + ((scrollProgress - 0.1) * (maxCircleSize - 240) / 0.9);
            whiteCircle.style.width = `${circleSize}px`;
            whiteCircle.style.height = `${circleSize}px`;
        } else {
            whiteCircle.classList.remove('growing');
            whiteCircle.style.width = '240px';
            whiteCircle.style.height = '240px';
        }
        
        // Animate diamonds to black and white
        const diamonds = document.querySelectorAll('.diamond');
        const threshold = 0.2; // Start transition at 20% scroll
        
        if (scrollProgress > threshold) {
            const bwProgress = Math.min((scrollProgress - threshold) / (1 - threshold), 1);
            diamonds.forEach((diamond) => {
                const ring = parseInt(diamond.getAttribute('data-ring'));
                const spoke = parseInt(diamond.getAttribute('data-spoke'));
                
                // Create checkerboard pattern: alternate black and white
                // Based on ring and spoke position
                const isWhite = (ring + spoke) % 2 === 0;
                
                if (bwProgress > 0.1) {
                    // Gradually transition
                    if (bwProgress >= 0.5) {
                        diamond.classList.add(isWhite ? 'bw' : 'bw-alt');
                    } else {
                        // Partial transition - mix color and BW
                        const originalColor = diamond.getAttribute('fill');
                        const targetColor = isWhite ? '#ffffff' : '#000000';
                        // For smooth transition, we'll use opacity on a filter or just switch classes
                        diamond.style.opacity = 1 - (bwProgress * 2);
                        if (bwProgress > 0.3) {
                            diamond.classList.add(isWhite ? 'bw' : 'bw-alt');
                            diamond.style.opacity = 1;
                        }
                    }
                }
            });
        } else {
            // Reset to colors
            diamonds.forEach(diamond => {
                diamond.classList.remove('bw', 'bw-alt');
                diamond.style.opacity = 1;
            });
        }
        
        // Show navigation menu when scrolled past splash
        const navMenu = document.getElementById('navMenu');
        if (scrollY > windowHeight * 0.5) {
            navMenu.classList.add('visible');
        } else {
            navMenu.classList.remove('visible');
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });
    
    // Initial call
    handleScroll();
});


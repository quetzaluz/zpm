// Generate radiating diamond pattern - redesigned to match actual artwork geometry
function generateRadiatingPattern() {
    const svg = document.getElementById('mandalaSvg');
    const patternGroup = document.getElementById('radiatingPattern');
    const centerX = 500;
    const centerY = 500;
    const maxRadius = 700;
    const innerRadius = 120; // Radius of central white circle
    
    // Color sequence matching the image - vibrant, saturated colors
    const colors = ['#FF3333', '#FFEB00', '#00FF66', '#00D9FF', '#FF00CC'];
    
    // Create pattern to match artwork - proper density and spacing
    const ringCount = 50;
    const baseSpokes = 12; // Base number of spokes near center
    
    for (let ring = 0; ring < ringCount; ring++) {
        const ringProgress = ring / ringCount;
        const ringRadius = innerRadius + (ringProgress * (maxRadius - innerRadius));
        const nextRingRadius = innerRadius + (((ring + 1) / ringCount) * (maxRadius - innerRadius));
        const ringWidth = nextRingRadius - ringRadius;
        
        // Increase spokes gradually from 12 to 30 as we move outward
        const spokes = Math.floor(baseSpokes + (ringProgress * 18));
        
        // Calculate diamond dimensions for this ring
        const avgRadius = (ringRadius + nextRingRadius) / 2;
        const circumference = 2 * Math.PI * avgRadius;
        const anglePerSpoke = 360 / spokes;
        
        // Make diamonds more elongated - they should be longer than wide
        const diamondHeight = ringWidth * 1.2; // More elongation to match artwork
        const diamondWidth = circumference / spokes;
        const halfPerp = diamondWidth * 0.4; // Narrower width for proper spacing
        
        // Stagger: odd rings are offset by half a spoke angle to create checkerboard
        const isStaggered = (ring % 2 === 1);
        const staggerOffset = isStaggered ? (anglePerSpoke / 2) : 0;
        
        // Create a group for this ring so we can rotate it
        const ringGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        ringGroup.setAttribute('class', 'ring-group');
        ringGroup.setAttribute('data-ring', ring);
        ringGroup.setAttribute('data-ring-progress', ringProgress);
        ringGroup.setAttribute('transform', `translate(${centerX}, ${centerY})`);
        
        // Place diamonds at all positions - the stagger creates the checkerboard naturally
        // The offset positioning prevents straight radial color lines
        for (let spoke = 0; spoke < spokes; spoke++) {
            // Calculate angle with stagger
            const baseAngle = (spoke * anglePerSpoke) + staggerOffset;
            const angle = baseAngle * (Math.PI / 180);
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            
            // Position relative to center (will be transformed by ring group)
            const x = avgRadius * cos;
            const y = avgRadius * sin;
            
            // Create diamond shape - elongated along radial direction
            const diamond = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            
            // Calculate diamond points
            const halfRadial = diamondHeight / 2; // Length along radial direction
            
            // Create a diamond that points outward from center
            const points = [
                // Outer point (further from center)
                [x + halfRadial * cos, y + halfRadial * sin],
                // Right point (perpendicular to radial)
                [x + halfPerp * (-sin), y + halfPerp * cos],
                // Inner point (closer to center)
                [x - halfRadial * cos, y - halfRadial * sin],
                // Left point (perpendicular to radial)
                [x - halfPerp * (-sin), y - halfPerp * cos]
            ];
            
            const pointsString = points.map(p => `${p[0]},${p[1]}`).join(' ');
            diamond.setAttribute('points', pointsString);
            
            // Add thin black stroke for separation
            diamond.setAttribute('stroke', '#000');
            diamond.setAttribute('stroke-width', '0.3');
            
            // Color based on position - creates spiral color bands
            // The key is to create bands that spiral outward
            // Combine ring position with angular position to create spirals
            const normalizedAngle = (spoke * anglePerSpoke + staggerOffset) / 360;
            const spiralValue = ring + normalizedAngle * 2; // Creates spiral bands
            const colorIndex = Math.floor(spiralValue) % colors.length;
            const originalColor = colors[colorIndex];
            diamond.setAttribute('fill', originalColor);
            diamond.setAttribute('class', 'diamond');
            diamond.setAttribute('data-original-color', originalColor);
            diamond.setAttribute('data-color-index', colorIndex);
            diamond.setAttribute('data-ring', ring);
            diamond.setAttribute('data-spoke', spoke);
            
            // Determine if this diamond should be black or white in checkerboard mode
            // Create proper checkerboard accounting for stagger
            const checkerboardIndex = ring + (isStaggered ? (spoke + Math.floor(spokes/2)) : spoke);
            const isWhite = checkerboardIndex % 2 === 0;
            diamond.setAttribute('data-bw-color', isWhite ? '#ffffff' : '#000000');
            
            // Add to ring group instead of pattern group directly
            ringGroup.appendChild(diamond);
        }
        
        // Add ring group to pattern group
        patternGroup.appendChild(ringGroup);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const pageLoadTime = Date.now();
    window.pageLoadTime = pageLoadTime; // Store globally for scroll handler
    
    generateRadiatingPattern();
    
    // Show text after 2 seconds
    const textOverlay = document.getElementById('textOverlay');
    setTimeout(() => {
        // Only show if still at top of page
        if (window.scrollY <= 10) {
            textOverlay.classList.add('visible');
        }
    }, 2000);
    
    // Scroll animation handler
    let lastScrollY = 0;
    let ticking = false;
    
    function handleScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const scrollProgress = Math.min(scrollY / windowHeight, 1);
        
        // Show/hide text overlay based on scroll position
        // Fade out if not at top, fade in if at top
        if (scrollY > 10) {
            textOverlay.classList.remove('visible');
        } else {
            // Only show if it was already shown (after 2 second delay)
            if (window.pageLoadTime && Date.now() - window.pageLoadTime > 2000) {
                textOverlay.classList.add('visible');
            }
        }
        
        // Scale outer rings based on scroll progress
        // Outer rings grow larger as user scrolls
        const ringGroups = document.querySelectorAll('.ring-group');
        ringGroups.forEach(ringGroup => {
            const ringProgress = parseFloat(ringGroup.getAttribute('data-ring-progress'));
            
            // Calculate scale based on ring position and scroll
            // Outer rings (higher ringProgress) scale more
            const baseScale = 1;
            const maxScale = 1 + (ringProgress * 0.5); // Outer rings can grow up to 50% larger
            const scale = baseScale + (scrollProgress * (maxScale - baseScale) * ringProgress);
            
            // Update CSS variable for scale (works with CSS animation)
            ringGroup.style.setProperty('--ring-scale', scale);
        });
        
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


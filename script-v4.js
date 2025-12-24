// Version 4: 6 hexes in a hexagonal arrangement using hex.svg
let hexes = [];
let scrollProgress = 0;
let rotationIntervals = [];

function createHexes() {
    const container = document.getElementById('hexContainer');
    container.innerHTML = '';
    hexes = [];
    
    // Clear any existing rotation intervals
    rotationIntervals.forEach(interval => clearInterval(interval));
    rotationIntervals = [];
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // All hexes are the same size
    const hexSize = 200;
    
    // For hexagons to tile properly with parallel sides:
    // Horizontal spacing = hex width = size * sqrt(3) ≈ size * 1.732
    // Vertical spacing = hex height * 0.75 = size * 1.5
    const horizontalSpacing = hexSize * 1.732;
    const verticalSpacing = hexSize * 1.5;
    
    // 7 hexes in this arrangement:
    //     O
    //   O O
    //   O O
    //     O
    //   (center hex in middle of the 4)
    const positions = [
        // Top hex
        { x: centerX, y: centerY - verticalSpacing, index: 0 },
        // Middle row - left
        { x: centerX - horizontalSpacing / 2, y: centerY - verticalSpacing / 2, index: 1 },
        // Middle row - right
        { x: centerX + horizontalSpacing / 2, y: centerY - verticalSpacing / 2, index: 2 },
        // Bottom row - left
        { x: centerX - horizontalSpacing / 2, y: centerY + verticalSpacing / 2, index: 3 },
        // Bottom row - right
        { x: centerX + horizontalSpacing / 2, y: centerY + verticalSpacing / 2, index: 4 },
        // Bottom hex
        { x: centerX, y: centerY + verticalSpacing, index: 5 },
        // Center hex (in the middle of the 4 hexes)
        { x: centerX, y: centerY, index: 6 }
    ];
    
    positions.forEach((pos, i) => {
        const hex = createHexElement(pos.x, pos.y, pos.index, 1);
        hexes.push({
            element: hex,
            x: pos.x,
            y: pos.y,
            ring: 1,
            baseSize: hexSize,
            baseX: pos.x,
            baseY: pos.y,
            rotation: 0
        });
        container.appendChild(hex);
    });
    
    // Create spiritual pattern overlay with circles and lines
    createSpiritualPattern(container, positions, centerX, centerY);
    
    // Animate pattern sequentially
    animatePatternSequence();
    
    // Start random rotation animations
    startRandomRotations();
}

function createSpiritualPattern(container, positions, centerX, centerY) {
    // Create SVG overlay for the spiritual pattern
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'spiritual-pattern');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '5';
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);
    
    // Create gradient for circles
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'circleGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', 'rgba(255, 255, 255, 0.8)');
    gradient.appendChild(stop1);
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', 'rgba(255, 255, 255, 0.3)');
    gradient.appendChild(stop2);
    
    defs.appendChild(gradient);
    
    const patternGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    patternGroup.setAttribute('class', 'pattern-group');
    
    // Store elements for sequential animation
    window.patternElements = [];
    
    // Draw circles at each hex position
    positions.forEach((pos, i) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', pos.x);
        circle.setAttribute('cy', pos.y);
        circle.setAttribute('r', '15');
        circle.setAttribute('fill', 'url(#circleGradient)');
        circle.setAttribute('stroke', 'rgba(255, 255, 255, 0.6)');
        circle.setAttribute('stroke-width', '1.5');
        circle.setAttribute('class', 'spiritual-circle');
        circle.setAttribute('data-index', i);
        circle.setAttribute('opacity', '0');
        circle.style.transition = 'opacity 0.6s ease';
        patternGroup.appendChild(circle);
    });
    
    // Draw lines connecting hexes in a spiritual pattern
    // Connect center hex (index 6) to all 4 surrounding hexes
    const centerIndex = 6;
    const surroundingIndices = [1, 2, 3, 4]; // The 4 hexes around the center
    
    surroundingIndices.forEach((index, i) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', positions[centerIndex].x);
        line.setAttribute('y1', positions[centerIndex].y);
        line.setAttribute('x2', positions[index].x);
        line.setAttribute('y2', positions[index].y);
        line.setAttribute('stroke', 'rgba(255, 255, 255, 0.4)');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('class', 'spiritual-line');
        line.setAttribute('opacity', '0');
        line.style.transition = 'opacity 0.6s ease';
        patternGroup.appendChild(line);
        // Store for animation: line, then circle
        window.patternElements.push({ element: line, type: 'line' });
        const circle = patternGroup.querySelector(`circle[data-index="${index}"]`);
        if (circle) {
            window.patternElements.push({ element: circle, type: 'circle' });
        }
    });
    
    // Connect the 4 surrounding hexes to form a square/diamond
    // Connect: 1-2, 2-4, 4-3, 3-1
    const connections = [
        [1, 2], // Middle left to middle right
        [2, 4], // Middle right to bottom right
        [4, 3], // Bottom right to bottom left
        [3, 1]  // Bottom left to middle left
    ];
    
    connections.forEach(([start, end]) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', positions[start].x);
        line.setAttribute('y1', positions[start].y);
        line.setAttribute('x2', positions[end].x);
        line.setAttribute('y2', positions[end].y);
        line.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
        line.setAttribute('stroke-width', '0.8');
        line.setAttribute('class', 'spiritual-line');
        line.setAttribute('opacity', '0');
        line.style.transition = 'opacity 0.6s ease';
        patternGroup.appendChild(line);
        window.patternElements.push({ element: line, type: 'line' });
    });
    
    // Connect top hex to the two middle hexes
    const topToMiddle = [
        [0, 1], // Top to middle left
        [0, 2]  // Top to middle right
    ];
    
    topToMiddle.forEach(([start, end]) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', positions[start].x);
        line.setAttribute('y1', positions[start].y);
        line.setAttribute('x2', positions[end].x);
        line.setAttribute('y2', positions[end].y);
        line.setAttribute('stroke', 'rgba(255, 255, 255, 0.25)');
        line.setAttribute('stroke-width', '0.8');
        line.setAttribute('class', 'spiritual-line');
        line.setAttribute('opacity', '0');
        line.style.transition = 'opacity 0.6s ease';
        patternGroup.appendChild(line);
        window.patternElements.push({ element: line, type: 'line' });
        // Add circle if not already added
        const circle = patternGroup.querySelector(`circle[data-index="${start}"]`);
        if (circle && !window.patternElements.find(p => p.element === circle)) {
            window.patternElements.push({ element: circle, type: 'circle' });
        }
    });
    
    // Connect bottom hex to the two bottom hexes
    const bottomToBottom = [
        [5, 3], // Bottom to bottom left
        [5, 4]  // Bottom to bottom right
    ];
    
    bottomToBottom.forEach(([start, end]) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', positions[start].x);
        line.setAttribute('y1', positions[start].y);
        line.setAttribute('x2', positions[end].x);
        line.setAttribute('y2', positions[end].y);
        line.setAttribute('stroke', 'rgba(255, 255, 255, 0.25)');
        line.setAttribute('stroke-width', '0.8');
        line.setAttribute('class', 'spiritual-line');
        line.setAttribute('opacity', '0');
        line.style.transition = 'opacity 0.6s ease';
        patternGroup.appendChild(line);
        window.patternElements.push({ element: line, type: 'line' });
    });
    
    // Add diagonal connections for more complexity
    const diagonals = [
        [0, 6], // Top to center
        [5, 6]  // Bottom to center
    ];
    
    diagonals.forEach(([start, end]) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', positions[start].x);
        line.setAttribute('y1', positions[start].y);
        line.setAttribute('x2', positions[end].x);
        line.setAttribute('y2', positions[end].y);
        line.setAttribute('stroke', 'rgba(255, 255, 255, 0.2)');
        line.setAttribute('stroke-width', '0.6');
        line.setAttribute('stroke-dasharray', '3,3');
        line.setAttribute('class', 'spiritual-line');
        line.setAttribute('opacity', '0');
        line.style.transition = 'opacity 0.6s ease';
        patternGroup.appendChild(line);
        window.patternElements.push({ element: line, type: 'line' });
    });
    
    // Add center circle if not already added
    const centerCircle = patternGroup.querySelector(`circle[data-index="6"]`);
    if (centerCircle && !window.patternElements.find(p => p.element === centerCircle)) {
        window.patternElements.push({ element: centerCircle, type: 'circle' });
    }
    
    // Add any remaining circles that weren't added yet
    positions.forEach((pos, i) => {
        const circle = patternGroup.querySelector(`circle[data-index="${i}"]`);
        if (circle && !window.patternElements.find(p => p.element === circle)) {
            window.patternElements.push({ element: circle, type: 'circle' });
        }
    });
    
    svg.appendChild(patternGroup);
    container.appendChild(svg);
    
    // Store reference for updates
    hexes.forEach((hex, i) => {
        hex.patternCircle = svg.querySelector(`circle[data-index="${i}"]`);
    });
}

function animatePatternSequence() {
    if (!window.patternElements || window.patternElements.length === 0) return;
    
    let currentIndex = 0;
    const delayBetweenElements = 150; // milliseconds between each element
    const holdDuration = 2000; // How long to hold at full opacity before fading out
    
    function showNextElement() {
        if (currentIndex >= window.patternElements.length) {
            // All elements shown, wait then fade out
            setTimeout(fadeOutSequence, holdDuration);
            return;
        }
        
        const item = window.patternElements[currentIndex];
        item.element.setAttribute('opacity', '1');
        
        currentIndex++;
        if (currentIndex < window.patternElements.length) {
            setTimeout(showNextElement, delayBetweenElements);
        } else {
            // All elements shown, wait then fade out
            setTimeout(fadeOutSequence, holdDuration);
        }
    }
    
    function fadeOutSequence() {
        let fadeIndex = window.patternElements.length - 1; // Start from the last element
        
        function hideNextElement() {
            if (fadeIndex < 0) {
                // All elements hidden, restart the cycle
                setTimeout(showNextElement, 500);
                currentIndex = 0;
                return;
            }
            
            const item = window.patternElements[fadeIndex];
            item.element.setAttribute('opacity', '0');
            
            fadeIndex--;
            if (fadeIndex >= 0) {
                setTimeout(hideNextElement, delayBetweenElements);
            } else {
                // All elements hidden, restart the cycle
                setTimeout(showNextElement, 500);
                currentIndex = 0;
            }
        }
        
        hideNextElement();
    }
    
    // Start animation after a short delay
    setTimeout(showNextElement, 300);
}

function createHexElement(x, y, index, ring) {
    const hexWrapper = document.createElement('div');
    hexWrapper.className = 'hex-wrapper';
    hexWrapper.style.left = `${x}px`;
    hexWrapper.style.top = `${y}px`;
    hexWrapper.style.transform = 'translate(-50%, -50%)';
    
    // Use the hex.svg file
    const hexObject = document.createElement('object');
    hexObject.type = 'image/svg+xml';
    hexObject.data = 'assets/svg/hex.svg';
    hexObject.className = 'hex-svg';
    hexObject.setAttribute('data-ring', ring);
    hexObject.setAttribute('data-index', index);
    
    hexWrapper.appendChild(hexObject);
    return hexWrapper;
}

function startRandomRotations() {
    // Rotation options: 1/6, 1/3, 1/2, or 2/3 turn (60°, 120°, 180°, 240°)
    const rotationOptions = [60, 120, 180, 240];
    
    hexes.forEach((hex, index) => {
        // Each hex rotates independently
        const rotateHex = () => {
            const randomRotation = rotationOptions[Math.floor(Math.random() * rotationOptions.length)];
            hex.rotation += randomRotation;
            
            // Apply rotation to the hex SVG
            const hexObject = hex.element.querySelector('.hex-svg');
            if (hexObject) {
                const currentScale = hexObject.style.transform.match(/scale\(([^)]+)\)/);
                const scale = currentScale ? currentScale[1] : 1;
                hexObject.style.transform = `scale(${scale}) rotate(${hex.rotation}deg)`;
            }
        };
        
        // Initial random delay for each hex (0-500ms)
        const initialDelay = Math.random() * 500;
        
        // Set up interval for each hex (1-2 seconds)
        const interval = setInterval(() => {
            rotateHex();
        }, 1000 + Math.random() * 1000 + initialDelay);
        
        rotationIntervals.push(interval);
        
        // First rotation after initial delay
        setTimeout(rotateHex, initialDelay);
    });
}

function updateHexes() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    hexes.forEach((hex, index) => {
        // Calculate scale based on scroll progress
        const scrollScale = 1 + (scrollProgress * 0.4);
        
        // Update position (they move outward as they scale)
        if (hex.baseX !== undefined && hex.baseY !== undefined) {
            const dx = hex.baseX - centerX;
            const dy = hex.baseY - centerY;
            const newX = centerX + dx * scrollScale;
            const newY = centerY + dy * scrollScale;
            
            hex.element.style.left = `${newX}px`;
            hex.element.style.top = `${newY}px`;
            
            // Update circle position in pattern
            if (hex.patternCircle) {
                hex.patternCircle.setAttribute('cx', newX);
                hex.patternCircle.setAttribute('cy', newY);
            }
        }
        
        // Update scale and maintain rotation
        const hexObject = hex.element.querySelector('.hex-svg');
        if (hexObject) {
            hexObject.style.transform = `scale(${scrollScale}) rotate(${hex.rotation}deg)`;
            hexObject.style.opacity = 0.6 + (scrollProgress * 0.4);
        }
    });
    
    // Update all line positions in the pattern
    const patternGroup = document.querySelector('.pattern-group');
    if (patternGroup) {
        const lines = patternGroup.querySelectorAll('.spiritual-line');
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const scrollScale = 1 + (scrollProgress * 0.4);
        
        // Recalculate positions for lines
        const positions = hexes.map(hex => ({
            x: hex.baseX !== undefined ? centerX + (hex.baseX - centerX) * scrollScale : hex.x,
            y: hex.baseY !== undefined ? centerY + (hex.baseY - centerY) * scrollScale : hex.y
        }));
        
        // Update lines based on their connection type
        let lineIndex = 0;
        
        // Center to surrounding (4 lines)
        const surroundingIndices = [1, 2, 3, 4];
        surroundingIndices.forEach(index => {
            if (lines[lineIndex]) {
                lines[lineIndex].setAttribute('x1', positions[6].x);
                lines[lineIndex].setAttribute('y1', positions[6].y);
                lines[lineIndex].setAttribute('x2', positions[index].x);
                lines[lineIndex].setAttribute('y2', positions[index].y);
                lineIndex++;
            }
        });
        
        // Square connections (4 lines)
        const connections = [[1, 2], [2, 4], [4, 3], [3, 1]];
        connections.forEach(([start, end]) => {
            if (lines[lineIndex]) {
                lines[lineIndex].setAttribute('x1', positions[start].x);
                lines[lineIndex].setAttribute('y1', positions[start].y);
                lines[lineIndex].setAttribute('x2', positions[end].x);
                lines[lineIndex].setAttribute('y2', positions[end].y);
                lineIndex++;
            }
        });
        
        // Top to middle (2 lines)
        const topToMiddle = [[0, 1], [0, 2]];
        topToMiddle.forEach(([start, end]) => {
            if (lines[lineIndex]) {
                lines[lineIndex].setAttribute('x1', positions[start].x);
                lines[lineIndex].setAttribute('y1', positions[start].y);
                lines[lineIndex].setAttribute('x2', positions[end].x);
                lines[lineIndex].setAttribute('y2', positions[end].y);
                lineIndex++;
            }
        });
        
        // Bottom to bottom (2 lines)
        const bottomToBottom = [[5, 3], [5, 4]];
        bottomToBottom.forEach(([start, end]) => {
            if (lines[lineIndex]) {
                lines[lineIndex].setAttribute('x1', positions[start].x);
                lines[lineIndex].setAttribute('y1', positions[start].y);
                lines[lineIndex].setAttribute('x2', positions[end].x);
                lines[lineIndex].setAttribute('y2', positions[end].y);
                lineIndex++;
            }
        });
        
        // Diagonals (2 lines)
        const diagonals = [[0, 6], [5, 6]];
        diagonals.forEach(([start, end]) => {
            if (lines[lineIndex]) {
                lines[lineIndex].setAttribute('x1', positions[start].x);
                lines[lineIndex].setAttribute('y1', positions[start].y);
                lines[lineIndex].setAttribute('x2', positions[end].x);
                lines[lineIndex].setAttribute('y2', positions[end].y);
                lineIndex++;
            }
        });
    }
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

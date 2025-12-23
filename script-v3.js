// Version 3: Blurry transparent shapes with evolving gradient and rotating angular pattern + Metatron overlay
const colors = ['#FF3333', '#FFEB00', '#00FF66', '#00D9FF', '#FF00CC'];
let shapes = [];
let scrollProgress = 0;

function createShapes() {
    const container = document.getElementById('gridContainer');
    container.innerHTML = '';
    shapes = [];
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const maxRadius = Math.min(window.innerWidth, window.innerHeight) * 0.6;
    
    // Create multiple layers of blurry transparent shapes with more complexity
    const layers = 5;
    const shapesPerLayer = 10;
    
    for (let layer = 0; layer < layers; layer++) {
        const layerRadius = (layer / layers) * maxRadius;
        const layerOpacity = 0.25 - (layer * 0.04);
        const layerBlur = 50 + (layer * 25);
        
        for (let i = 0; i < shapesPerLayer; i++) {
            const angle = (i / shapesPerLayer) * Math.PI * 2;
            const radius = layerRadius + (Math.random() * 80 - 40);
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            // Create more complex shapes - mix of circles and polygons
            const shape = document.createElement('div');
            shape.className = 'gradient-shape';
            
            // Alternate between circular and polygonal shapes
            if (i % 3 === 0) {
                // Star-like shape using clip-path
                const points = [];
                const sides = 6;
                const outerRadius = 100 + layer * 20;
                const innerRadius = outerRadius * 0.5;
                
                for (let j = 0; j < sides * 2; j++) {
                    const angle = (j * Math.PI) / sides;
                    const r = j % 2 === 0 ? outerRadius : innerRadius;
                    const px = 50 + (r / 2) * Math.cos(angle);
                    const py = 50 + (r / 2) * Math.sin(angle);
                    points.push(`${px}% ${py}%`);
                }
                shape.style.clipPath = `polygon(${points.join(', ')})`;
                shape.style.borderRadius = '0';
            } else if (i % 3 === 1) {
                // Hexagon shape
                const points = [];
                const sides = 6;
                const radius = 50;
                for (let j = 0; j < sides; j++) {
                    const angle = (j * 2 * Math.PI) / sides;
                    const px = 50 + radius * Math.cos(angle);
                    const py = 50 + radius * Math.sin(angle);
                    points.push(`${px}% ${py}%`);
                }
                shape.style.clipPath = `polygon(${points.join(', ')})`;
                shape.style.borderRadius = '0';
            } else {
                // Circular shape
                shape.style.borderRadius = '50%';
            }
            
            shape.style.left = `${x}px`;
            shape.style.top = `${y}px`;
            shape.style.width = `${180 + layer * 40}px`;
            shape.style.height = `${180 + layer * 40}px`;
            shape.style.opacity = layerOpacity;
            shape.style.filter = `blur(${layerBlur}px)`;
            
            // Create gradient with multiple color stops for more complexity
            const color1 = colors[i % colors.length];
            const color2 = colors[(i + 1) % colors.length];
            const color3 = colors[(i + 2) % colors.length];
            shape.style.background = `radial-gradient(circle, ${color1} 0%, ${color2} 40%, ${color3} 70%, transparent 85%)`;
            shape.style.transform = 'translate(-50%, -50%)';
            shape.style.animationDelay = `${(layer + i) * 0.15}s`;
            
            shapes.push({
                element: shape,
                x,
                y,
                layer,
                angle,
                baseRadius: radius,
                colorIndex: i % colors.length,
                shapeType: i % 3
            });
            
            container.appendChild(shape);
        }
    }
    
    // Create angular pattern overlay
    createAngularPattern(container, centerX, centerY, maxRadius);
    
    // Add Metatron pattern overlay
    createMetatronOverlay(container, centerX, centerY, maxRadius);
}

function createAngularPattern(container, centerX, centerY, maxRadius) {
    const patternContainer = document.createElement('div');
    patternContainer.className = 'angular-pattern';
    patternContainer.style.left = `${centerX}px`;
    patternContainer.style.top = `${centerY}px`;
    patternContainer.style.transform = 'translate(-50%, -50%)';
    
    // Create angular lines/spokes
    const spokes = 16;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', maxRadius * 2);
    svg.setAttribute('height', maxRadius * 2);
    svg.setAttribute('viewBox', `0 0 ${maxRadius * 2} ${maxRadius * 2}`);
    svg.style.position = 'absolute';
    svg.style.left = '50%';
    svg.style.top = '50%';
    svg.style.transform = 'translate(-50%, -50%)';
    
    for (let i = 0; i < spokes; i++) {
        const angle = (i / spokes) * Math.PI * 2;
        const color = colors[i % colors.length];
        
        // Create angular shape (triangle/polygon)
        const points = [];
        const innerRadius = maxRadius * 0.25;
        const outerRadius = maxRadius * 0.95;
        
        // Inner point
        const innerX = maxRadius + innerRadius * Math.cos(angle);
        const innerY = maxRadius + innerRadius * Math.sin(angle);
        points.push(`${innerX},${innerY}`);
        
        // Outer point 1
        const angle1 = angle - (Math.PI / spokes);
        const outerX1 = maxRadius + outerRadius * Math.cos(angle1);
        const outerY1 = maxRadius + outerRadius * Math.sin(angle1);
        points.push(`${outerX1},${outerY1}`);
        
        // Outer point 2
        const angle2 = angle + (Math.PI / spokes);
        const outerX2 = maxRadius + outerRadius * Math.cos(angle2);
        const outerY2 = maxRadius + outerRadius * Math.sin(angle2);
        points.push(`${outerX2},${outerY2}`);
        
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', points.join(' '));
        polygon.setAttribute('fill', color);
        polygon.setAttribute('opacity', '0.5');
        polygon.setAttribute('class', 'angular-segment');
        svg.appendChild(polygon);
    }
    
    patternContainer.appendChild(svg);
    container.appendChild(patternContainer);
    
    shapes.push({
        element: patternContainer,
        isPattern: true
    });
}

function createMetatronOverlay(container, centerX, centerY, maxRadius) {
    const metatronWrapper = document.createElement('div');
    metatronWrapper.className = 'metatron-overlay';
    metatronWrapper.style.left = `${centerX}px`;
    metatronWrapper.style.top = `${centerY}px`;
    metatronWrapper.style.transform = 'translate(-50%, -50%)';
    metatronWrapper.style.width = `${maxRadius * 0.6}px`;
    metatronWrapper.style.height = `${maxRadius * 0.6}px`;
    
    const metatronObject = document.createElement('object');
    metatronObject.type = 'image/svg+xml';
    metatronObject.data = 'assets/svg/metatron.svg';
    metatronObject.className = 'metatron-svg';
    metatronObject.style.width = '100%';
    metatronObject.style.height = '100%';
    metatronObject.style.opacity = '0.4';
    metatronObject.style.filter = 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))';
    
    metatronWrapper.appendChild(metatronObject);
    container.appendChild(metatronWrapper);
    
    shapes.push({
        element: metatronWrapper,
        isMetatron: true
    });
}

function updateShapes() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const rotation = scrollProgress * 360;
    
    shapes.forEach((shape, index) => {
        if (shape.isMetatron) {
            // Rotate and scale the Metatron pattern
            const scale = 1 + scrollProgress * 0.3;
            shape.element.style.transform = `translate(-50%, -50%) rotate(${rotation * 0.5}deg) scale(${scale})`;
            const svg = shape.element.querySelector('.metatron-svg');
            if (svg) {
                svg.style.opacity = 0.3 + (scrollProgress * 0.3);
            }
        } else if (shape.isPattern) {
            // Rotate the angular pattern
            shape.element.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            
            // Change colors based on scroll
            const svg = shape.element.querySelector('svg');
            if (svg) {
                const polygons = svg.querySelectorAll('.angular-segment');
                polygons.forEach((poly, i) => {
                    const colorShift = Math.floor(scrollProgress * colors.length * 2) % colors.length;
                    const newColorIndex = (i + colorShift) % colors.length;
                    poly.setAttribute('fill', colors[newColorIndex]);
                    const opacity = 0.3 + (Math.sin(scrollProgress * Math.PI * 2 + i) * 0.3);
                    poly.setAttribute('opacity', opacity);
                });
            }
        } else {
            // Animate gradient shapes
            const newRadius = shape.baseRadius * (1 + scrollProgress * 0.4);
            const newAngle = shape.angle + (scrollProgress * Math.PI * 1.5);
            const x = centerX + newRadius * Math.cos(newAngle);
            const y = centerY + newRadius * Math.sin(newAngle);
            
            shape.element.style.left = `${x}px`;
            shape.element.style.top = `${y}px`;
            
            // Evolve gradient colors with more complexity
            const colorShift = Math.floor(scrollProgress * colors.length * 1.5) % colors.length;
            const newColorIndex = (shape.colorIndex + colorShift) % colors.length;
            const nextColorIndex = (newColorIndex + 1) % colors.length;
            const thirdColorIndex = (newColorIndex + 2) % colors.length;
            const colorProgress = (scrollProgress * colors.length * 1.5) % 1;
            
            // More complex gradient with three colors
            shape.element.style.background = `radial-gradient(circle, ${colors[newColorIndex]} 0%, ${colors[nextColorIndex]} 35%, ${colors[thirdColorIndex]} 65%, transparent 85%)`;
            shape.element.style.opacity = 0.15 + (Math.sin(scrollProgress * Math.PI * 2 + shape.layer) * 0.25);
            
            // Rotate complex shapes
            if (shape.shapeType === 0 || shape.shapeType === 1) {
                shape.element.style.transform = `translate(-50%, -50%) rotate(${scrollProgress * 180}deg)`;
            }
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const pageLoadTime = Date.now();
    window.pageLoadTime = pageLoadTime;
    
    createShapes();
    window.addEventListener('resize', () => {
        createShapes();
        updateShapes();
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
        
        updateShapes();
        
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

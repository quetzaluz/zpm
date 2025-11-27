// Version 2: Canvas-based animated mandala with particle effects
let canvas, ctx;
let animationId;
let particles = [];
let scrollProgress = 0;

function initCanvas() {
    canvas = document.getElementById('mandalaCanvas');
    ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particle system
    createParticles();
    animate();
}

function createParticles() {
    particles = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
    
    // Create concentric circles of particles
    for (let ring = 0; ring < 30; ring++) {
        const radius = (ring / 30) * maxRadius;
        const particleCount = Math.floor(8 + ring * 2);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            particles.push({
                x,
                y,
                radius: radius,
                angle: angle,
                baseAngle: angle,
                ring: ring,
                size: 3 + (ring % 3),
                color: getColorForRing(ring),
                rotationSpeed: (ring % 2 === 0 ? 1 : -1) * (0.5 + ring * 0.1)
            });
        }
    }
}

function getColorForRing(ring) {
    const colors = ['#FF3333', '#FFEB00', '#00FF66', '#00D9FF', '#FF00CC'];
    return colors[ring % colors.length];
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Update and draw particles
    particles.forEach(particle => {
        // Rotate particles
        particle.angle += particle.rotationSpeed * 0.01;
        
        // Calculate position with rotation
        const x = centerX + particle.radius * Math.cos(particle.angle);
        const y = centerY + particle.radius * Math.sin(particle.angle);
        
        // Scale based on scroll
        const scale = 1 + (scrollProgress * 0.5 * (particle.ring / 30));
        const scaledSize = particle.size * scale;
        const scaledRadius = particle.radius * scale;
        const scaledX = centerX + scaledRadius * Math.cos(particle.angle);
        const scaledY = centerY + scaledRadius * Math.sin(particle.angle);
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(scaledX, scaledY, scaledSize, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Draw connecting lines
        if (particle.ring > 0) {
            const prevParticle = particles.find(p => 
                p.ring === particle.ring - 1 && 
                Math.abs(p.angle - particle.angle) < 0.3
            );
            if (prevParticle) {
                const prevScaledRadius = prevParticle.radius * (1 + scrollProgress * 0.5 * (prevParticle.ring / 30));
                const prevX = centerX + prevScaledRadius * Math.cos(prevParticle.angle);
                const prevY = centerY + prevScaledRadius * Math.sin(prevParticle.angle);
                
                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(scaledX, scaledY);
                ctx.strokeStyle = particle.color;
                ctx.globalAlpha = 0.3;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    });
    
    // Draw central mandala
    drawCentralMandala(centerX, centerY);
    
    animationId = requestAnimationFrame(animate);
}

function drawCentralMandala(x, y) {
    const baseRadius = 80 + scrollProgress * 40;
    
    // Draw concentric circles
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(x, y, baseRadius - i * 15, 0, Math.PI * 2);
        ctx.strokeStyle = `hsl(${i * 60}, 70%, 60%)`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // Draw geometric pattern
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    
    // Hexagon
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const px = x + baseRadius * Math.cos(angle);
        const py = y + baseRadius * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const pageLoadTime = Date.now();
    window.pageLoadTime = pageLoadTime;
    
    initCanvas();
    
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


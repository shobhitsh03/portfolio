// Navbar Toggle
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };
}

// -------------------------------------------------------------
// Moving Particles Canvas System
// -------------------------------------------------------------
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationFrameId;

    // Mouse interactive tracker
    const mouse = {
        x: null,
        y: null,
        radius: 150
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function setCanvasDimensions() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    setCanvasDimensions();

    window.addEventListener('resize', () => {
        setCanvasDimensions();
        initParticles();
    });

    const colors = [
        'rgba(59, 130, 246, ',   // Blue
        'rgba(96, 165, 250, ',   // Light Blue
        'rgba(147, 197, 253, ',  // Soft Sky Blue
        'rgba(37, 99, 235, '     // Deep Blue
    ];

    class Particle {
        constructor(x, y, vx, vy, size, colorBase) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.size = size;
            this.baseSize = size;
            this.colorBase = colorBase;
            this.alpha = Math.random() * 0.5 + 0.3;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.colorBase + this.alpha + ')';
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(96, 165, 250, 0.8)';
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow for line rendering efficiency
        }

        update() {
            // Pulse opacity
            this.alpha += Math.sin(Date.now() * this.pulseSpeed) * 0.005;
            if (this.alpha < 0.2) this.alpha = 0.2;
            if (this.alpha > 0.8) this.alpha = 0.8;

            // Bounce off boundaries
            if (this.x > canvas.width || this.x < 0) {
                this.vx = -this.vx;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.vy = -this.vy;
            }

            // Mouse proximity interaction
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const maxDistance = mouse.radius;
                    const force = (maxDistance - distance) / maxDistance;
                    const directionX = forceDirectionX * force * 1.5;
                    const directionY = forceDirectionY * force * 1.5;

                    this.x -= directionX;
                    this.y -= directionY;
                }
            }

            // Move particle
            this.x += this.vx;
            this.y += this.vy;

            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        // Calculate particle count relative to screen area
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 10000);
        for (let i = 0; i < numberOfParticles; i++) {
            let size = Math.random() * 2.5 + 1;
            let x = Math.random() * (canvas.width - size * 2) + size;
            let y = Math.random() * (canvas.height - size * 2) + size;
            let vx = (Math.random() - 0.5) * 0.8;
            let vy = (Math.random() - 0.5) * 0.8;
            let colorBase = colors[Math.floor(Math.random() * colors.length)];

            particlesArray.push(new Particle(x, y, vx, vy, size, colorBase));
        }
    }

    function connectParticles() {
        let maxDistance = 120;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    let opacity = 1 - (distance / maxDistance);
                    ctx.strokeStyle = `rgba(96, 165, 250, ${opacity * 0.25})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }

            // Connect particles to mouse cursor if near
            if (mouse.x !== null && mouse.y !== null) {
                let dxMouse = particlesArray[a].x - mouse.x;
                let dyMouse = particlesArray[a].y - mouse.y;
                let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                if (distanceMouse < mouse.radius) {
                    let opacityMouse = 1 - (distanceMouse / mouse.radius);
                    ctx.strokeStyle = `rgba(96, 165, 250, ${opacityMouse * 0.5})`;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
        animationFrameId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
}

// -------------------------------------------------------------
// Dynamic Typewriter Effect
// -------------------------------------------------------------
const typeTarget = document.querySelector('.multiple-text');
if (typeTarget) {
    const roles = ['Web Developer', 'Frontend Engineer', 'Full Stack Developer', 'UI/UX Specialist'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    function typeEffect() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typeTarget.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeTarget.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let currentDelay = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            currentDelay = pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            currentDelay = 500;
        }

        setTimeout(typeEffect, currentDelay);
    }

    typeEffect();
}

// -------------------------------------------------------------
// Scroll Reveal & Skill Bar Animation (IntersectionObserver)
// -------------------------------------------------------------
const revealElements = document.querySelectorAll('.reveal');

if (revealElements.length > 0) {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Animate skill bars inside revealed element if present
                const skillFills = entry.target.querySelectorAll('.skill-fill');
                skillFills.forEach(fill => {
                    const targetWidth = fill.getAttribute('data-width');
                    if (targetWidth) {
                        fill.style.width = targetWidth;
                    }
                });

                if (entry.target.classList.contains('skill-fill')) {
                    const targetWidth = entry.target.getAttribute('data-width');
                    if (targetWidth) {
                        entry.target.style.width = targetWidth;
                    }
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
}

// -------------------------------------------------------------
// Scroll Progress Bar, Back-To-Top & Active Nav Highlight
// -------------------------------------------------------------
const progressBar = document.querySelector('.scroll-progress-bar');
const scrollTopBtn = document.querySelector('.scroll-top-btn');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
    // 1. Update Scroll Progress Bar
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && progressBar) {
        const progressPercentage = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    // 2. Toggle Back-to-Top Button
    if (scrollTopBtn) {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    // 3. Highlight Active Navbar Link based on Scroll Section
    let currentSectionId = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
        }
    });

    if (currentSectionId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
// -------------------------------------------------------------
// Thor Lightning Animation System (#about section)
// -------------------------------------------------------------
const thorCanvas = document.getElementById('thor-lightning-canvas');
const aboutSection = document.getElementById('about');

if (thorCanvas && aboutSection) {
    const tCtx = thorCanvas.getContext('2d');
    let bolts = [];
    let aboutMouse = { x: null, y: null, isHovered: false };

    function resizeThorCanvas() {
        thorCanvas.width = aboutSection.clientWidth;
        thorCanvas.height = aboutSection.clientHeight;
    }

    resizeThorCanvas();
    window.addEventListener('resize', resizeThorCanvas);

    aboutSection.addEventListener('mousemove', (e) => {
        const rect = aboutSection.getBoundingClientRect();
        aboutMouse.x = e.clientX - rect.left;
        aboutMouse.y = e.clientY - rect.top;
        aboutMouse.isHovered = true;
    });

    aboutSection.addEventListener('mouseleave', () => {
        aboutMouse.isHovered = false;
    });

    aboutSection.addEventListener('click', (e) => {
        const rect = aboutSection.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        // Unleash multi-bolt Thor strike on click
        for (let i = 0; i < 4; i++) {
            const startX = Math.random() * thorCanvas.width;
            const startY = 0;
            createLightningBolt(startX, startY, clickX, clickY, 40, 5, true);
        }
    });

    // Helper: Generate procedural jagged line points for lightning bolt
    function generateLightningPoints(x1, y1, x2, y2, displacement, iterations) {
        let points = [{ x: x1, y: y1 }, { x: x2, y: y2 }];

        for (let i = 0; i < iterations; i++) {
            let newPoints = [];
            for (let j = 0; j < points.length - 1; j++) {
                let p1 = points[j];
                let p2 = points[j + 1];

                let midX = (p1.x + p2.x) / 2;
                let midY = (p1.y + p2.y) / 2;

                let dx = p2.x - p1.x;
                let dy = p2.y - p1.y;
                let len = Math.sqrt(dx * dx + dy * dy);

                // Perpendicular offset for electrical jitter
                let nx = -dy / len;
                let ny = dx / len;
                let offset = (Math.random() - 0.5) * displacement;

                newPoints.push(p1);
                newPoints.push({
                    x: midX + nx * offset,
                    y: midY + ny * offset
                });
            }
            newPoints.push(points[points.length - 1]);
            points = newPoints;
            displacement *= 0.5; // Scale down jitter displacement for sub-segments
        }
        return points;
    }

    class LightningBolt {
        constructor(points, isMain = true, colorHue = 190) {
            this.points = points;
            this.life = 1.0;
            this.decay = Math.random() * 0.08 + 0.04;
            this.isMain = isMain;
            this.colorHue = colorHue; // Cyan (190), Electric Purple (260), Neon Sky (200)
        }

        draw() {
            if (this.points.length < 2) return;

            // Outer Glow Path
            tCtx.save();
            tCtx.beginPath();
            tCtx.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 1; i < this.points.length; i++) {
                tCtx.lineTo(this.points[i].x, this.points[i].y);
            }

            tCtx.lineWidth = this.isMain ? Math.random() * 3 + 3 : 1.5;
            tCtx.strokeStyle = `hsla(${this.colorHue}, 100%, 70%, ${this.life})`;
            tCtx.shadowBlur = this.isMain ? 25 : 12;
            tCtx.shadowColor = `hsl(${this.colorHue}, 100%, 65%)`;
            tCtx.stroke();

            // Intense Bright White Core
            tCtx.beginPath();
            tCtx.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 1; i < this.points.length; i++) {
                tCtx.lineTo(this.points[i].x, this.points[i].y);
            }
            tCtx.lineWidth = this.isMain ? 1.5 : 0.8;
            tCtx.strokeStyle = `rgba(255, 255, 255, ${this.life})`;
            tCtx.stroke();
            tCtx.restore();
        }

        update() {
            this.life -= this.decay;
        }
    }

    function createLightningBolt(x1, y1, x2, y2, displacement = 35, iterations = 4, isMain = true) {
        const points = generateLightningPoints(x1, y1, x2, y2, displacement, iterations);
        const hues = [190, 205, 260, 280]; // Cyan to Thor Electric Violet
        const colorHue = hues[Math.floor(Math.random() * hues.length)];

        bolts.push(new LightningBolt(points, isMain, colorHue));

        // Randomly spawn smaller branching arcs off main lightning
        if (isMain) {
            for (let i = 1; i < points.length - 1; i++) {
                if (Math.random() < 0.25) {
                    let p = points[i];
                    let branchAngle = (Math.random() - 0.5) * Math.PI;
                    let branchLength = Math.random() * 80 + 30;
                    let branchX = p.x + Math.cos(branchAngle) * branchLength;
                    let branchY = p.y + Math.sin(branchAngle) * branchLength;

                    let branchPoints = generateLightningPoints(p.x, p.y, branchX, branchY, 20, 3);
                    bolts.push(new LightningBolt(branchPoints, false, colorHue));
                }
            }
        }
    }

    // Auto-trigger periodic random Thor lightning discharges
    let lastAutoStrike = 0;
    function animateThorLightning(timestamp) {
        tCtx.clearRect(0, 0, thorCanvas.width, thorCanvas.height);

        // Random ambient lightning strike every 1.5s
        if (timestamp - lastAutoStrike > 1400) {
            if (Math.random() < 0.7) {
                const aboutImg = document.querySelector('.about-img');
                let targetX = Math.random() * thorCanvas.width;
                let targetY = Math.random() * thorCanvas.height;

                if (aboutImg) {
                    const imgRect = aboutImg.getBoundingClientRect();
                    const sectionRect = aboutSection.getBoundingClientRect();
                    targetX = (imgRect.left - sectionRect.left) + imgRect.width / 2;
                    targetY = (imgRect.top - sectionRect.top) + imgRect.height / 2;
                }

                const startX = Math.random() * thorCanvas.width;
                const startY = Math.random() < 0.5 ? 0 : thorCanvas.height;

                createLightningBolt(startX, startY, targetX, targetY, 45, 5, true);
            }
            lastAutoStrike = timestamp;
        }

        // Interactive crackling electrical arcs toward cursor
        if (aboutMouse.isHovered && Math.random() < 0.3) {
            const aboutImg = document.querySelector('.about-img');
            let originX = thorCanvas.width / 2;
            let originY = thorCanvas.height / 2;

            if (aboutImg) {
                const imgRect = aboutImg.getBoundingClientRect();
                const sectionRect = aboutSection.getBoundingClientRect();
                originX = (imgRect.left - sectionRect.left) + imgRect.width / 2;
                originY = (imgRect.top - sectionRect.top) + imgRect.height / 2;
            }

            createLightningBolt(originX, originY, aboutMouse.x, aboutMouse.y, 25, 4, false);
        }

        // Update and render active lightning bolts
        for (let i = bolts.length - 1; i >= 0; i--) {
            bolts[i].update();
            bolts[i].draw();
            if (bolts[i].life <= 0) {
                bolts.splice(i, 1);
            }
        }

        requestAnimationFrame(animateThorLightning);
    }

    requestAnimationFrame(animateThorLightning);
}




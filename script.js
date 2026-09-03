// -------------------------------------------------------------
// Mobile Menu Toggle & Navigation Active Observer
// -------------------------------------------------------------
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };
}

const progressBar = document.querySelector('.scroll-progress-bar');
const scrollTopBtn = document.querySelector('.scroll-top-btn');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && progressBar) {
        const progressPercentage = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    if (scrollTopBtn) {
        if (window.scrollY > 350) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

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
});

// -------------------------------------------------------------
// Global Fixed Constellation Background Canvas
// -------------------------------------------------------------
const bgCanvas = document.getElementById('particles-canvas');
if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let particles = [];
    const bgMouse = { x: null, y: null, radius: 140 };

    window.addEventListener('mousemove', (e) => {
        bgMouse.x = e.x;
        bgMouse.y = e.y;
    });

    window.addEventListener('mouseleave', () => {
        bgMouse.x = null;
        bgMouse.y = null;
    });

    function resizeBgCanvas() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
    }
    resizeBgCanvas();
    window.addEventListener('resize', () => {
        resizeBgCanvas();
        initBgParticles();
    });

    class BgParticle {
        constructor() {
            this.x = Math.random() * bgCanvas.width;
            this.y = Math.random() * bgCanvas.height;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.size = Math.random() * 2.2 + 1;
            this.color = 'rgba(0, 240, 255, ';
            this.alpha = Math.random() * 0.5 + 0.3;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.fill();
        }

        update() {
            if (this.x > bgCanvas.width || this.x < 0) this.vx = -this.vx;
            if (this.y > bgCanvas.height || this.y < 0) this.vy = -this.vy;

            if (bgMouse.x && bgMouse.y) {
                let dx = bgMouse.x - this.x;
                let dy = bgMouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < bgMouse.radius) {
                    let force = (bgMouse.radius - dist) / bgMouse.radius;
                    this.x -= (dx / dist) * force * 1.5;
                    this.y -= (dy / dist) * force * 1.5;
                }
            }

            this.x += this.vx;
            this.y += this.vy;
            this.draw();
        }
    }

    function initBgParticles() {
        particles = [];
        let count = Math.floor((bgCanvas.width * bgCanvas.height) / 12000);
        for (let i = 0; i < count; i++) {
            particles.push(new BgParticle());
        }
    }

    function animateBgParticles() {
        ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        requestAnimationFrame(animateBgParticles);
    }

    initBgParticles();
    animateBgParticles();
}

// -------------------------------------------------------------
// REUSABLE ALTERNATE ANIMATION HELPER CLASSES & RENDERERS
// -------------------------------------------------------------
class ShootingComet {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvasWidth * 0.9;
        this.y = -30;
        this.length = Math.random() * 90 + 60;
        this.speed = Math.random() * 4.5 + 3.5;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.size = Math.random() * 2 + 1.5;
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * (this.length / this.speed), this.y - this.vy * (this.length / this.speed));

        let grad = ctx.createLinearGradient(this.x, this.y, this.x - this.vx * (this.length / this.speed), this.y - this.vy * (this.length / this.speed));
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(0.3, 'rgba(0, 240, 255, 0.6)');
        grad.addColorStop(1, 'rgba(0, 240, 255, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = this.size;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00f0ff';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
    }

    update(ctx) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x > this.canvasWidth + 120 || this.y > this.canvasHeight + 120) {
            this.reset();
        }
        this.draw(ctx);
    }
}

function drawAuroraRibbons(ctx, width, height, time) {
    ctx.save();
    for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        const baseOffsetY = height * (0.25 + j * 0.22);
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 15) {
            const wave1 = Math.sin(x * 0.005 + time * 0.6 + j * 1.5) * 45;
            const wave2 = Math.cos(x * 0.009 - time * 0.4) * 28;
            const y = baseOffsetY + wave1 + wave2;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();

        let grad = ctx.createLinearGradient(0, baseOffsetY - 60, 0, height);
        if (j === 0) {
            grad.addColorStop(0, 'rgba(0, 240, 255, 0.18)');
            grad.addColorStop(0.5, 'rgba(59, 130, 246, 0.08)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (j === 1) {
            grad.addColorStop(0, 'rgba(59, 130, 246, 0.14)');
            grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.06)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
            grad.addColorStop(0, 'rgba(0, 240, 255, 0.10)');
            grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.05)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }

        ctx.fillStyle = grad;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00f0ff';
        ctx.fill();
    }
    ctx.restore();
}

function drawCyberGrid(ctx, width, height, time) {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.14)';
    ctx.lineWidth = 1;

    const horizonY = height * 0.55;
    const gridStep = 45;
    const scroll = (time * 25) % gridStep;

    for (let y = horizonY; y < height; y += gridStep * 0.5) {
        let perspectiveY = y + scroll * ((y - horizonY) / (height - horizonY));
        if (perspectiveY <= height) {
            ctx.beginPath();
            ctx.moveTo(0, perspectiveY);
            ctx.lineTo(width, perspectiveY);
            ctx.stroke();
        }
    }

    const centerX = width / 2;
    for (let x = -width; x <= width * 2; x += 60) {
        ctx.beginPath();
        ctx.moveTo(centerX, horizonY);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    ctx.restore();
}

// -------------------------------------------------------------
// SECTION 1: HOME CANVAS (#home-canvas) - BREAKING METEOR GAME & COSMIC NEBULAE
// -------------------------------------------------------------
const homeCanvas = document.getElementById('home-canvas');
const homeSection = document.getElementById('home');

if (homeCanvas && homeSection) {
    const hCtx = homeCanvas.getContext('2d');
    let homeParticles = [];
    let homeComets = [];
    let activeMeteors = [];
    let meteorDebris = [];
    let meteorScore = 0;
    let isMeteorGameActive = false;
    let lastMeteorSpawnTime = 0;
    let homeMouse = { x: 0, y: 0, isHovered: false };

    const scoreDisplay = document.getElementById('meteor-score');
    const gameToggleBtn = document.getElementById('meteor-game-toggle');

    if (gameToggleBtn) {
        gameToggleBtn.onclick = (e) => {
            e.stopPropagation();
            isMeteorGameActive = !isMeteorGameActive;
            if (isMeteorGameActive) {
                gameToggleBtn.innerHTML = "<i class='bx bx-pause'></i> Pause";
            } else {
                gameToggleBtn.innerHTML = "<i class='bx bx-play'></i> Play";
            }
        };
    }

    function resizeHomeCanvas() {
        homeCanvas.width = homeSection.clientWidth;
        homeCanvas.height = homeSection.clientHeight;
        initHomeComets();
    }

    homeSection.addEventListener('mousemove', (e) => {
        const rect = homeSection.getBoundingClientRect();
        homeMouse.x = e.clientX - rect.left;
        homeMouse.y = e.clientY - rect.top;
        homeMouse.isHovered = true;
    });

    homeSection.addEventListener('mouseleave', () => { homeMouse.isHovered = false; });

    // Interactive Meteor Click & Shatter Handler
    homeSection.addEventListener('click', (e) => {
        if (!isMeteorGameActive) return;
        const rect = homeSection.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        for (let i = activeMeteors.length - 1; i >= 0; i--) {
            let m = activeMeteors[i];
            let dx = clickX - m.x;
            let dy = clickY - m.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            // Generous hit box detection: Radius + 35px padding
            if (dist <= m.radius + 35) {
                m.shatter(meteorDebris);
                activeMeteors.splice(i, 1);
                meteorScore++;
                if (scoreDisplay) scoreDisplay.textContent = meteorScore;
                break;
            }
        }
    });

    class FallingMeteor {
        constructor(w, h) {
            this.x = Math.random() * w * 0.85 + 40;
            this.y = -40;
            this.radius = Math.random() * 14 + 22; // Larger meteor rocks
            this.speed = Math.random() * 0.9 + 0.9; // Smooth, relaxed speed (0.9 - 1.8)
            this.angle = Math.PI / 3 + (Math.random() - 0.5) * 0.2;
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.rotation = Math.random() * Math.PI * 2;
            this.vRot = (Math.random() - 0.5) * 0.03;

            this.isCyan = Math.random() < 0.6;
            this.glowColor = this.isCyan ? '#00f0ff' : '#f97316';
        }

        draw() {
            hCtx.save();

            // 1. Fiery / Cyan Meteor Flame Tail
            const tailLength = this.radius * 3.5;
            const tailGrad = hCtx.createLinearGradient(this.x, this.y, this.x - this.vx * (tailLength / this.speed), this.y - this.vy * (tailLength / this.speed));
            tailGrad.addColorStop(0, this.glowColor);
            tailGrad.addColorStop(0.5, 'rgba(234, 88, 12, 0.4)');
            tailGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            hCtx.beginPath();
            hCtx.moveTo(this.x, this.y);
            hCtx.lineTo(this.x - this.vx * (tailLength / this.speed), this.y - this.vy * (tailLength / this.speed));
            hCtx.lineWidth = this.radius * 1.6;
            hCtx.strokeStyle = tailGrad;
            hCtx.lineCap = 'round';
            hCtx.shadowBlur = 20;
            hCtx.shadowColor = this.glowColor;
            hCtx.stroke();

            // 2. Rocky Meteor Core Body
            hCtx.translate(this.x, this.y);
            hCtx.rotate(this.rotation);

            let bodyGrad = hCtx.createRadialGradient(0, 0, 2, 0, 0, this.radius);
            bodyGrad.addColorStop(0, '#ffffff');
            bodyGrad.addColorStop(0.4, this.glowColor);
            bodyGrad.addColorStop(1, '#1e293b');

            hCtx.beginPath();
            hCtx.arc(0, 0, this.radius, 0, Math.PI * 2);
            hCtx.fillStyle = bodyGrad;
            hCtx.shadowBlur = 25;
            hCtx.shadowColor = this.glowColor;
            hCtx.fill();
            hCtx.strokeStyle = '#ffffff';
            hCtx.lineWidth = 1.5;
            hCtx.stroke();

            hCtx.restore();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.vRot;
            this.draw();
        }

        shatter(debrisArray) {
            // Explode into 22 glowing rock fragments
            for (let i = 0; i < 22; i++) {
                debrisArray.push(new MeteorFragment(this.x, this.y, this.glowColor));
            }
        }
    }

    class MeteorFragment {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            let angle = Math.random() * Math.PI * 2;
            let speed = Math.random() * 8 + 3;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.size = Math.random() * 4 + 2;
            this.life = 1.0;
            this.decay = Math.random() * 0.04 + 0.025;
            this.color = color;
        }

        draw() {
            hCtx.save();
            hCtx.beginPath();
            hCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            hCtx.fillStyle = this.color;
            hCtx.shadowBlur = 15;
            hCtx.shadowColor = this.color;
            hCtx.globalAlpha = this.life;
            hCtx.fill();
            hCtx.restore();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.12; // Gravity fall
            this.life -= this.decay;
            this.draw();
        }
    }

    class HomeParticle {
        constructor() {
            this.x = Math.random() * homeCanvas.width;
            this.y = Math.random() * homeCanvas.height;
            this.vx = (Math.random() - 0.5) * 1.2;
            this.vy = (Math.random() - 0.5) * 1.2;
            this.size = Math.random() * 3 + 1;
            this.alpha = Math.random() * 0.7 + 0.3;
        }

        draw() {
            hCtx.beginPath();
            hCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            hCtx.fillStyle = `rgba(0, 240, 255, ${this.alpha})`;
            hCtx.shadowBlur = 12;
            hCtx.shadowColor = '#00f0ff';
            hCtx.fill();
        }

        update() {
            if (this.x > homeCanvas.width || this.x < 0) this.vx = -this.vx;
            if (this.y > homeCanvas.height || this.y < 0) this.vy = -this.vy;

            if (homeMouse.isHovered) {
                let dx = homeMouse.x - this.x;
                let dy = homeMouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    this.x -= (dx / dist) * 2;
                    this.y -= (dy / dist) * 2;
                }
            }

            this.x += this.vx;
            this.y += this.vy;
            this.draw();
        }
    }

    function initHomeParticles() {
        homeParticles = [];
        for (let i = 0; i < 45; i++) {
            homeParticles.push(new HomeParticle());
        }
    }

    function initHomeComets() {
        homeComets = [
            new ShootingComet(homeCanvas.width, homeCanvas.height),
            new ShootingComet(homeCanvas.width, homeCanvas.height)
        ];
    }

    resizeHomeCanvas();
    window.addEventListener('resize', resizeHomeCanvas);

    function animateHomeCanvas() {
        hCtx.clearRect(0, 0, homeCanvas.width, homeCanvas.height);

        // 1. Cosmic dust constellation mesh
        for (let i = 0; i < homeParticles.length; i++) {
            homeParticles[i].update();
            for (let j = i + 1; j < homeParticles.length; j++) {
                let dx = homeParticles[i].x - homeParticles[j].x;
                let dy = homeParticles[i].y - homeParticles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    hCtx.beginPath();
                    hCtx.moveTo(homeParticles[i].x, homeParticles[i].y);
                    hCtx.lineTo(homeParticles[j].x, homeParticles[j].y);
                    hCtx.strokeStyle = `rgba(0, 240, 255, ${0.2 * (1 - dist / 100)})`;
                    hCtx.stroke();
                }
            }
        }

        // 2. Shooting comets
        for (let i = 0; i < homeComets.length; i++) {
            homeComets[i].update(hCtx);
        }

        // 3. Falling Meteors Minigame Loop
        if (isMeteorGameActive) {
            const now = Date.now();
            if (now - lastMeteorSpawnTime > 2500) { // Relaxed spawn every 2.5s
                if (activeMeteors.length < 4) {
                    activeMeteors.push(new FallingMeteor(homeCanvas.width, homeCanvas.height));
                }
                lastMeteorSpawnTime = now;
            }

            for (let i = activeMeteors.length - 1; i >= 0; i--) {
                activeMeteors[i].update();
                if (activeMeteors[i].y > homeCanvas.height + 60 || activeMeteors[i].x > homeCanvas.width + 60) {
                    activeMeteors.splice(i, 1);
                }
            }

            for (let i = meteorDebris.length - 1; i >= 0; i--) {
                meteorDebris[i].update();
                if (meteorDebris[i].life <= 0) {
                    meteorDebris.splice(i, 1);
                }
            }
        }

        requestAnimationFrame(animateHomeCanvas);
    }

    initHomeParticles();
    animateHomeCanvas();
}

// -------------------------------------------------------------
// SECTION 2: ABOUT CANVAS (#about-canvas) - STYLE 2: QUANTUM CYBER GRID & AURORA RIBBONS
// -------------------------------------------------------------
const aboutCanvas = document.getElementById('about-canvas') || document.getElementById('thor-lightning-canvas');
const aboutSection = document.getElementById('about');

if (aboutCanvas && aboutSection) {
    const aCtx = aboutCanvas.getContext('2d');
    let aboutStartTime = Date.now();

    function resizeAboutCanvas() {
        aboutCanvas.width = aboutSection.clientWidth;
        aboutCanvas.height = aboutSection.clientHeight;
    }
    resizeAboutCanvas();
    window.addEventListener('resize', resizeAboutCanvas);

    function animateAboutCanvas() {
        aCtx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
        const elapsedTime = (Date.now() - aboutStartTime) * 0.001;

        // Render Quantum Cyber Grid
        drawCyberGrid(aCtx, aboutCanvas.width, aboutCanvas.height, elapsedTime);

        // Render Undulating Aurora Ribbons
        drawAuroraRibbons(aCtx, aboutCanvas.width, aboutCanvas.height, elapsedTime);

        requestAnimationFrame(animateAboutCanvas);
    }

    animateAboutCanvas();
}

// -------------------------------------------------------------
// SECTION 3: SKILLS CANVAS (#skills-canvas) - STYLE 1: COSMIC NEBULAE & SHOOTING COMETS
// -------------------------------------------------------------
const skillsCanvas = document.getElementById('skills-canvas');
const skillsSection = document.getElementById('skills');

if (skillsCanvas && skillsSection) {
    const sCtx = skillsCanvas.getContext('2d');
    let skillNodes = [];
    let skillComets = [];

    function resizeSkillsCanvas() {
        skillsCanvas.width = skillsSection.clientWidth;
        skillsCanvas.height = skillsSection.clientHeight;
        initSkillComets();
    }

    class SkillNode {
        constructor() {
            this.x = Math.random() * skillsCanvas.width;
            this.y = Math.random() * skillsCanvas.height;
            this.vy = -(Math.random() * 0.8 + 0.3);
            this.size = Math.random() * 3 + 1.5;
            this.alpha = Math.random() * 0.6 + 0.3;
        }

        draw() {
            sCtx.beginPath();
            sCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            sCtx.fillStyle = `rgba(0, 240, 255, ${this.alpha})`;
            sCtx.shadowBlur = 10;
            sCtx.shadowColor = '#00f0ff';
            sCtx.fill();
        }

        update() {
            this.y += this.vy;
            if (this.y < 0) {
                this.y = skillsCanvas.height;
                this.x = Math.random() * skillsCanvas.width;
            }
            this.draw();
        }
    }

    function initSkillNodes() {
        skillNodes = [];
        for (let i = 0; i < 35; i++) {
            skillNodes.push(new SkillNode());
        }
    }

    function initSkillComets() {
        skillComets = [
            new ShootingComet(skillsCanvas.width, skillsCanvas.height)
        ];
    }

    resizeSkillsCanvas();
    window.addEventListener('resize', resizeSkillsCanvas);

    function animateSkillsCanvas() {
        sCtx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);
        for (let i = 0; i < skillNodes.length; i++) {
            skillNodes[i].update();
        }
        for (let i = 0; i < skillComets.length; i++) {
            skillComets[i].update(sCtx);
        }
        requestAnimationFrame(animateSkillsCanvas);
    }

    initSkillNodes();
    animateSkillsCanvas();
}

// -------------------------------------------------------------
// SECTION 4: SERVICES CANVAS (#services-canvas) - STYLE 2: QUANTUM CYBER GRID & AURORA RIBBONS
// -------------------------------------------------------------
const servicesCanvas = document.getElementById('services-canvas');
const servicesSection = document.getElementById('services');

if (servicesCanvas && servicesSection) {
    const svCtx = servicesCanvas.getContext('2d');
    let servicesStartTime = Date.now();

    function resizeServicesCanvas() {
        servicesCanvas.width = servicesSection.clientWidth;
        servicesCanvas.height = servicesSection.clientHeight;
    }
    resizeServicesCanvas();
    window.addEventListener('resize', resizeServicesCanvas);

    function animateServicesCanvas() {
        svCtx.clearRect(0, 0, servicesCanvas.width, servicesCanvas.height);
        const elapsedTime = (Date.now() - servicesStartTime) * 0.001;

        drawCyberGrid(svCtx, servicesCanvas.width, servicesCanvas.height, elapsedTime);
        drawAuroraRibbons(svCtx, servicesCanvas.width, servicesCanvas.height, elapsedTime);

        requestAnimationFrame(animateServicesCanvas);
    }

    animateServicesCanvas();
}

// -------------------------------------------------------------
// SECTION 5: PROJECTS CANVAS (#projects-canvas) - STYLE 1: COSMIC NEBULAE & SHOOTING COMETS
// -------------------------------------------------------------
const projectsCanvas = document.getElementById('projects-canvas');
const projectsSection = document.getElementById('projects');

if (projectsCanvas && projectsSection) {
    const pCtx = projectsCanvas.getContext('2d');
    let projectStars = [];
    let projectComets = [];

    function resizeProjectsCanvas() {
        projectsCanvas.width = projectsSection.clientWidth;
        projectsCanvas.height = projectsSection.clientHeight;
        initProjectComets();
    }

    class ProjectStar {
        constructor() {
            this.x = Math.random() * projectsCanvas.width;
            this.y = Math.random() * projectsCanvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.alpha = Math.random() * 0.8 + 0.2;
            this.vAlpha = (Math.random() - 0.5) * 0.02;
        }

        draw() {
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            pCtx.fillStyle = `rgba(248, 250, 252, ${this.alpha})`;
            pCtx.shadowBlur = 8;
            pCtx.shadowColor = '#ffffff';
            pCtx.fill();
        }

        update() {
            this.alpha += this.vAlpha;
            if (this.alpha > 0.9 || this.alpha < 0.2) this.vAlpha = -this.vAlpha;
            this.draw();
        }
    }

    function initProjectStars() {
        projectStars = [];
        for (let i = 0; i < 45; i++) {
            projectStars.push(new ProjectStar());
        }
    }

    function initProjectComets() {
        projectComets = [
            new ShootingComet(projectsCanvas.width, projectsCanvas.height)
        ];
    }

    resizeProjectsCanvas();
    window.addEventListener('resize', resizeProjectsCanvas);

    function animateProjectsCanvas() {
        pCtx.clearRect(0, 0, projectsCanvas.width, projectsCanvas.height);
        for (let i = 0; i < projectStars.length; i++) {
            projectStars[i].update();
        }
        for (let i = 0; i < projectComets.length; i++) {
            projectComets[i].update(pCtx);
        }
        requestAnimationFrame(animateProjectsCanvas);
    }

    initProjectStars();
    animateProjectsCanvas();
}

// -------------------------------------------------------------
// SECTION 6: CONTACT CANVAS (#contact-canvas) - STYLE 2: QUANTUM CYBER GRID & AURORA RIBBONS
// -------------------------------------------------------------
const contactCanvas = document.getElementById('contact-canvas') || document.getElementById('widow-canvas');
const contactSection = document.getElementById('contact');

if (contactCanvas && contactSection) {
    const cCtx = contactCanvas.getContext('2d');
    let contactStartTime = Date.now();

    function resizeContactCanvas() {
        contactCanvas.width = contactSection.clientWidth;
        contactCanvas.height = contactSection.clientHeight;
    }
    resizeContactCanvas();
    window.addEventListener('resize', resizeContactCanvas);

    function animateContactCanvas() {
        cCtx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);
        const elapsedTime = (Date.now() - contactStartTime) * 0.001;

        drawCyberGrid(cCtx, contactCanvas.width, contactCanvas.height, elapsedTime);
        drawAuroraRibbons(cCtx, contactCanvas.width, contactCanvas.height, elapsedTime);

        requestAnimationFrame(animateContactCanvas);
    }

    animateContactCanvas();
}

// -------------------------------------------------------------
// IntersectionObserver Scroll Reveal & Skill Bar Animation
// -------------------------------------------------------------
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                const skillFills = entry.target.querySelectorAll('.skill-fill');
                skillFills.forEach(fill => {
                    const targetWidth = fill.getAttribute('data-width');
                    if (targetWidth) fill.style.width = targetWidth;
                });

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));
}

// -------------------------------------------------------------
// Typewriter Subtitle Animation
// -------------------------------------------------------------
const multipleTextSpan = document.querySelector('.multiple-text');
if (multipleTextSpan) {
    const phrases = ["Web Developer", "Frontend Engineer", "UI/UX Developer", "Problem Solver"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            multipleTextSpan.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            multipleTextSpan.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 60 : 120;
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();
}

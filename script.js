// Smart Home Dashboard - Enhanced Animated Background Version
// Complete IoT simulation with fast animations

// Global State Management
const state = {
    theme: 'dark',
    devices: {
        lights: {
            id: 'lights',
            name: 'Main Lights',
            status: false,
            brightness: 0,
            color: 'warm',
            energyRate: 0.05,
            energyUsage: 0,
            uptime: 0,
            lastChange: null,
            rooms: {
                living: false,
                bedroom: false,
                kitchen: false
            }
        },
        thermostat: {
            id: 'thermostat',
            name: 'Climate Control',
            temperature: 22.2,
            setpoint: 22.2,
            mode: 'heat',
            status: 'idle',
            energyRate: 0.5,
            energyUsage: 0,
            humidity: 45,
            lastChange: null
        },
        security: {
            id: 'security',
            name: 'Security System',
            armed: true,
            mode: 'home',
            sensors: {
                'front-door': { active: false, status: 'secure', lastTrigger: null },
                'back-door': { active: true, status: 'open', lastTrigger: null },
                'living-room': { active: false, status: 'secure', lastTrigger: null },
                'motion': { active: false, status: 'active', lastTrigger: null }
            },
            lastAlert: null
        },
        camera: {
            id: 'camera',
            name: 'Surveillance Camera',
            status: false,
            recording: false,
            live: false,
            energyRate: 0.1,
            energyUsage: 0,
            uptime: 0,
            storage: 2.4,
            maxStorage: 10,
            lastSnapshot: null,
            motionDetected: false
        },
        devices: {
            'plug1': { id: 'plug1', name: 'Living Room Lamp', status: false, power: 0, energyUsage: 0 },
            'plug2': { id: 'plug2', name: 'TV & Entertainment', status: true, power: 120, energyUsage: 0.8 },
            'ac': { id: 'ac', name: 'Air Conditioner', status: true, power: 1500, energyUsage: 3.2 }
        }
    },
    analytics: {
        period: 'day',
        data: {
            day: Array.from({length: 24}, () => Math.random() * 2 + 0.5),
            week: Array.from({length: 7}, () => Math.random() * 2.5 + 0.5),
            month: Array.from({length: 30}, () => Math.random() * 3 + 0.5)
        },
        peakUsage: 2.4,
        todayCost: 1050.85,
        carbonSaved: 4.2,
        efficiency: 87
    },
    activity: [],
    notifications: [],
    animation: {
        particles: [],
        connections: [],
        streams: [],
        canvas: null,
        ctx: null,
        animationId: null,
        mouse: { x: 0, y: 0 },
        lastTime: 0
    }
};

// DOM Elements
const DOM = {
    // Theme
    themeToggle: document.getElementById('theme-toggle'),
    
    // Header
    connectionStatus: document.getElementById('connection-status'),
    currentTime: document.getElementById('current-time'),
    currentDate: document.getElementById('current-date'),
    
    // Quick Stats
    currentEnergy: document.getElementById('current-energy'),
    energyProgress: document.getElementById('energy-progress'),
    homeTemp: document.getElementById('home-temp'),
    tempFill: document.getElementById('temp-fill'),
    securityStatus: document.getElementById('security-status'),
    networkHealth: document.getElementById('network-health'),
    
    // Lights
    lightStatus: document.getElementById('light-status'),
    toggleMainLight: document.getElementById('toggle-main-light'),
    lightBrightness: document.getElementById('light-brightness'),
    brightnessValue: document.getElementById('brightness-value'),
    lightEnergy: document.getElementById('light-energy'),
    lightUptime: document.getElementById('light-uptime'),
    lightCost: document.getElementById('light-cost'),
    lightGlow: document.getElementById('light-glow'),
    roomToggles: document.querySelectorAll('.room-toggle'),
    colorPresets: document.querySelectorAll('.color-preset'),
    lightsAllOn: document.getElementById('lights-all-on'),
    
    // Thermostat
    temperatureValue: document.getElementById('temperature-value'),
    setpointValue: document.getElementById('setpoint-value'),
    decreaseTemp: document.getElementById('decrease-temp'),
    increaseTemp: document.getElementById('increase-temp'),
    tempSlider: document.getElementById('temp-slider'),
    thermostatMode: document.getElementById('thermostat-mode'),
    thermostatEnergy: document.getElementById('thermostat-energy'),
    humidityValue: document.getElementById('humidity-value'),
    modeButtons: document.querySelectorAll('.mode-btn'),
    climateAuto: document.getElementById('climate-auto'),
    
    // Security
    securitySystemStatus: document.getElementById('security-system-status'),
    panicButton: document.getElementById('panic-button'),
    armHome: document.getElementById('arm-home'),
    armAway: document.getElementById('arm-away'),
    disarmSystem: document.getElementById('disarm-system'),
    toggleCamera: document.getElementById('toggle-camera'),
    cameraRecord: document.getElementById('camera-record'),
    cameraSnapshot: document.getElementById('camera-snapshot'),
    cameraTimestamp: document.getElementById('camera-timestamp'),
    recordingStatus: document.getElementById('recording-status'),
    cameraUptime: document.getElementById('camera-uptime'),
    cameraStorage: document.getElementById('camera-storage'),
    motionDetected: document.getElementById('motion-detected'),
    cameraPreview: document.getElementById('camera-preview'),
    
    // Analytics
    peakUsage: document.getElementById('peak-usage'),
    todayCost: document.getElementById('today-cost'),
    carbonSaved: document.getElementById('carbon-saved'),
    breakdownList: document.getElementById('breakdown-list'),
    energyChart: document.getElementById('energy-chart'),
    timeButtons: document.querySelectorAll('.time-btn'),
    
    // Devices
    deviceToggles: document.querySelectorAll('.device-toggle'),
    devicesAllOn: document.getElementById('devices-all-on'),
    
    // Activity
    activityFeed: document.getElementById('activity-feed'),
    clearActivity: document.getElementById('clear-activity'),
    
    // Notifications
    notificationsContainer: document.getElementById('notifications-container'),
    
    // Modal
    modal: document.getElementById('device-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalBody: document.getElementById('modal-body'),
    modalClose: document.getElementById('modal-close'),
    
    // Background Canvas
    bgCanvas: document.getElementById('bg-canvas')
};

// Animation Objects
class Particle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.color = Math.random() > 0.5 ? state.theme === 'dark' ? '#4d94ff' : '#0066ff' : '#ff3366';
        this.opacity = Math.random() * 0.5 + 0.2;
        this.life = 1;
        this.decay = 5;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > window.innerWidth) this.x = 0;
        if (this.x < 0) this.x = window.innerWidth;
        if (this.y > window.innerHeight) this.y = 0;
        if (this.y < 0) this.y = window.innerHeight;
        
        this.life -= this.decay;
        this.opacity = this.life * 0.5;
        
        return this.life > 0;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Connection {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.progress = 0;
        this.speed = Math.random() * 0.02 + 0.01;
        this.width = Math.random() * 1.5 + 0.5;
        this.color = state.theme === 'dark' ? 'rgba(77, 148, 255, 0.3)' : 'rgba(0, 102, 255, 0.3)';
        this.pulse = 0;
    }
    
    update() {
        this.progress = (this.progress + this.speed) % 1;
        this.pulse = (this.pulse + 0.05) % (Math.PI * 2);
    }
    
    draw(ctx) {
        const x = this.x1 + (this.x2 - this.x1) * this.progress;
        const y = this.y1 + (this.y2 - this.y1) * this.progress;
        
        const pulseWidth = this.width + Math.sin(this.pulse) * 0.5;
        
        ctx.save();
        ctx.globalAlpha = 0.3 + Math.sin(this.pulse) * 0.2;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = pulseWidth;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Draw moving dot
        ctx.beginPath();
        ctx.arc(x, y, pulseWidth * 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

class DataStream {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.length = Math.random() * 100 + 50;
        this.speed = Math.random() * 2 + 1;
        this.width = Math.random() * 2 + 1;
        this.color = state.theme === 'dark' ? 'rgba(77, 148, 255, 0.5)' : 'rgba(0, 102, 255, 0.5)';
        this.particles = [];
        this.particleRate = 5;
    }
    
    update() {
        this.y -= this.speed;
        if (this.y < -this.length) {
            this.y = window.innerHeight + this.length;
            this.x = Math.random() * window.innerWidth;
        }
        
        // Add particles
        if (Math.random() < this.particleRate / 60) {
            this.particles.push({
                x: this.x + (Math.random() - 0.5) * 20,
                y: this.y,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 1 + 0.5,
                life: 1
            });
        }
        
        // Update particles
        this.particles = this.particles.filter(p => {
            p.y -= p.speed;
            p.life -= 0.02;
            return p.life > 0;
        });
    }
    
    draw(ctx) {
        // Draw main stream
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
        
        // Draw particles
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        ctx.restore();
    }
}

// Initialize Application
function initDashboard() {
    console.log('🚀 Initializing Enhanced Smart Home Dashboard...');
    
    // Initialize animation
    initAnimation();
    
    // Initialize theme
    initTheme();
    
    // Initialize device states
    initDevices();
    
    // Initialize charts
    initCharts();
    
    // Set up event listeners
    initEventListeners();
    
    // Start simulation
    startSimulation();
    
    // Update current time
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // Show welcome notification
    showNotification('Dashboard Online', 'All systems connected and ready.', 'success');
    addActivity('System initialized', 'Dashboard is now online', 'success');
    
    // Initial update
    updateAllDevices();
    
    console.log('✅ Dashboard initialized successfully');
}

// Initialize Animation
function initAnimation() {
    // Setup canvas
    const canvas = DOM.bgCanvas;
    const ctx = canvas.getContext('2d');
    
    state.animation.canvas = canvas;
    state.animation.ctx = ctx;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create initial particles
    for (let i = 0; i < 100; i++) {
        state.animation.particles.push(new Particle());
    }
    
    // Create connections
    for (let i = 0; i < 20; i++) {
        const x1 = Math.random() * window.innerWidth;
        const y1 = Math.random() * window.innerHeight;
        const x2 = x1 + (Math.random() - 0.5) * 200;
        const y2 = y1 + (Math.random() - 0.5) * 200;
        state.animation.connections.push(new Connection(x1, y1, x2, y2));
    }
    
    // Create data streams
    for (let i = 0; i < 5; i++) {
        state.animation.streams.push(new DataStream());
    }
    
    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
        state.animation.mouse.x = e.clientX;
        state.animation.mouse.y = e.clientY;
    });
    
    // Click effects
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.container')) {
            createClickEffect(e.clientX, e.clientY);
        }
    });
    
    // Start animation loop
    animate();
}

function animate(timestamp) {
    const ctx = state.animation.ctx;
    const canvas = state.animation.canvas;
    
    // Clear with fade effect
    ctx.fillStyle = state.theme === 'dark' ? 'rgba(10, 14, 23, 0.1)' : 'rgba(248, 250, 252, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculate delta time
    const deltaTime = timestamp - state.animation.lastTime;
    state.animation.lastTime = timestamp;
    const speedMultiplier = Math.min(deltaTime / 16, 2); // Normalize to 60fps
    
    // Update and draw particles
    state.animation.particles = state.animation.particles.filter(p => p.update());
    
    // Add new particles occasionally
    if (Math.random() < 0.1) {
        state.animation.particles.push(new Particle());
    }
    
    // Draw particles
    state.animation.particles.forEach(p => p.draw(ctx));
    
    // Update and draw connections
    state.animation.connections.forEach(c => {
        c.update();
        c.draw(ctx);
    });
    
    // Update and draw data streams
    state.animation.streams.forEach(s => {
        s.update();
        s.draw(ctx);
    });
    
    // Draw mouse interaction
    drawMouseInteraction(ctx);
    
    state.animation.animationId = requestAnimationFrame(animate);
}

function drawMouseInteraction(ctx) {
    const mouse = state.animation.mouse;
    
    // Draw mouse ripple if recently clicked
    if (state.lastClick && Date.now() - state.lastClick < 1000) {
        const time = Date.now() - state.lastClick;
        const radius = time * 0.2;
        const alpha = 1 - time / 1000;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = state.theme === 'dark' ? '#4d94ff' : '#0066ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
    
    // Draw connection to mouse from nearby particles
    const maxDistance = 150;
    state.animation.particles.forEach(p => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
            ctx.save();
            ctx.globalAlpha = 0.1 * (1 - distance / maxDistance);
            ctx.strokeStyle = state.theme === 'dark' ? '#4d94ff' : '#0066ff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            ctx.restore();
        }
    });
}

function createClickEffect(x, y) {
    state.lastClick = Date.now();
    
    // Create ripple particles
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        const particle = new Particle();
        particle.x = x;
        particle.y = y;
        particle.speedX = Math.cos(angle) * speed;
        particle.speedY = Math.sin(angle) * speed;
        particle.color = state.theme === 'dark' ? '#ff3366' : '#ff6699';
        particle.size = Math.random() * 2 + 1;
        particle.life = 1;
        particle.decay = 0.02;
        state.animation.particles.push(particle);
    }
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('smartHomeTheme') || 'dark';
    state.theme = savedTheme;
    document.documentElement.setAttribute('data-theme', state.theme);
    
    DOM.themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('smartHomeTheme', state.theme);
    
    // Update animation colors
    state.animation.particles.forEach(p => {
        p.color = Math.random() > 0.5 ? state.theme === 'dark' ? '#4d94ff' : '#0066ff' : '#ff3366';
    });
    
    state.animation.connections.forEach(c => {
        c.color = state.theme === 'dark' ? 'rgba(77, 148, 255, 0.3)' : 'rgba(0, 102, 255, 0.3)';
    });
    
    state.animation.streams.forEach(s => {
        s.color = state.theme === 'dark' ? 'rgba(77, 148, 255, 0.5)' : 'rgba(0, 102, 255, 0.5)';
    });
    
    showNotification('Theme Changed', `Switched to ${state.theme} mode`, 'info');
    addActivity('Theme changed', `Switched to ${state.theme} mode`, 'info');
}

// Device Initialization
function initDevices() {
    // Set initial timestamps
    const now = new Date();
    Object.values(state.devices).forEach(device => {
        if (device.lastChange !== undefined) {
            device.lastChange = now;
        }
    });
}

// Charts
let energyChart = null;
function initCharts() {
    const ctx = DOM.energyChart.getContext('2d');
    
    energyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 24}, (_, i) => `${i}:00`),
            datasets: [{
                label: 'Energy Usage',
                data: state.analytics.data.day,
                borderColor: '#0066ff',
                backgroundColor: 'rgba(0, 102, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#0066ff',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(25, 30, 50, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#a0a7c2',
                    borderColor: '#0066ff',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(160, 167, 194, 0.1)'
                    },
                    ticks: {
                        color: '#a0a7c2',
                        maxRotation: 0,
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(160, 167, 194, 0.1)'
                    },
                    ticks: {
                        color: '#a0a7c2',
                        callback: function(value) {
                            return value + ' kW';
                        },
                        font: {
                            size: 11
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'nearest'
            },
            elements: {
                line: {
                    tension: 0.4
                }
            }
        }
    });
}

// Event Listeners
function initEventListeners() {
    // Theme toggle
    DOM.themeToggle.addEventListener('click', toggleTheme);
    
    // Lights
    DOM.toggleMainLight.addEventListener('change', toggleLights);
    DOM.lightBrightness.addEventListener('input', updateBrightness);
    DOM.roomToggles.forEach(toggle => {
        toggle.addEventListener('change', toggleRoomLight);
    });
    DOM.colorPresets.forEach(preset => {
        preset.addEventListener('click', changeLightColor);
    });
    DOM.lightsAllOn.addEventListener('click', toggleAllLights);
    
    // Thermostat
    DOM.decreaseTemp.addEventListener('click', () => adjustTemperature(-1));
    DOM.increaseTemp.addEventListener('click', () => adjustTemperature(1));
    DOM.tempSlider.addEventListener('input', updateTemperatureSlider);
    DOM.modeButtons.forEach(btn => {
        btn.addEventListener('click', changeThermostatMode);
    });
    DOM.climateAuto.addEventListener('click', setAutoClimate);
    
    // Security
    DOM.panicButton.addEventListener('click', triggerPanic);
    DOM.armHome.addEventListener('click', () => armSecurity('home'));
    DOM.armAway.addEventListener('click', () => armSecurity('away'));
    DOM.disarmSystem.addEventListener('click', () => armSecurity('disarm'));
    DOM.toggleCamera.addEventListener('click', toggleCamera);
    DOM.cameraRecord.addEventListener('click', toggleRecording);
    DOM.cameraSnapshot.addEventListener('click', takeSnapshot);
    
    // Analytics
    DOM.timeButtons.forEach(btn => {
        btn.addEventListener('click', changeAnalyticsPeriod);
    });
    
    // Devices
    DOM.deviceToggles.forEach(toggle => {
        toggle.addEventListener('change', toggleDevice);
    });
    DOM.devicesAllOn.addEventListener('click', toggleAllDevices);
    
    // Activity
    DOM.clearActivity.addEventListener('click', clearActivity);
    
    // Modal
    DOM.modalClose.addEventListener('click', () => {
        DOM.modal.classList.remove('active');
    });
    
    // Device card clicks
    document.querySelectorAll('.device-card, .stat-card, .device-item').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button, input, .switch')) {
                const deviceId = card.dataset.device || card.dataset.stat;
                if (deviceId) {
                    openDeviceModal(deviceId);
                }
            }
        });
    });
}

// Device Control Functions
function toggleLights() {
    const lights = state.devices.lights;
    lights.status = DOM.toggleMainLight.checked;
    lights.lastChange = new Date();
    
    if (lights.status && lights.brightness === 0) {
        lights.brightness = 50;
        DOM.lightBrightness.value = 50;
    }
    
    updateLights();
    
    const message = lights.status 
        ? `Main lights turned ON at ${lights.brightness}% brightness`
        : 'Main lights turned OFF';
    
    showNotification('Lighting Control', message, lights.status ? 'success' : 'info');
    addActivity('Main lights', lights.status ? 'Turned ON' : 'Turned OFF', lights.status ? 'success' : 'info');
}

function updateBrightness() {
    const lights = state.devices.lights;
    lights.brightness = parseInt(DOM.lightBrightness.value);
    
    if (!lights.status && lights.brightness > 0) {
        lights.status = true;
        DOM.toggleMainLight.checked = true;
    }
    
    if (lights.status && lights.brightness === 0) {
        lights.status = false;
        DOM.toggleMainLight.checked = false;
    }
    
    updateLights();
    
    if (lights.status) {
        addActivity('Light brightness', `Set to ${lights.brightness}%`, 'info');
    }
}

function toggleRoomLight(e) {
    const room = e.target.dataset.room;
    const lights = state.devices.lights;
    lights.rooms[room] = e.target.checked;
    
    showNotification(
        'Room Lighting',
        `${room.replace('-', ' ').toUpperCase()} lights ${lights.rooms[room] ? 'ON' : 'OFF'}`,
        lights.rooms[room] ? 'success' : 'info'
    );
    
    addActivity(
        `${room.replace('-', ' ')} lights`,
        lights.rooms[room] ? 'Turned ON' : 'Turned OFF',
        lights.rooms[room] ? 'success' : 'info'
    );
}

function changeLightColor(e) {
    const color = e.currentTarget.dataset.color;
    const lights = state.devices.lights;
    lights.color = color;
    
    // Update active state
    DOM.colorPresets.forEach(p => p.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    showNotification('Lighting Color', `Set to ${color} white`, 'info');
    addActivity('Light color', `Changed to ${color}`, 'info');
}

function toggleAllLights() {
    const lights = state.devices.lights;
    const allOn = !lights.status;
    
    lights.status = allOn;
    DOM.toggleMainLight.checked = allOn;
    
    if (allOn && lights.brightness === 0) {
        lights.brightness = 50;
        DOM.lightBrightness.value = 50;
    }
    
    // Turn on all rooms
    Object.keys(lights.rooms).forEach(room => {
        lights.rooms[room] = allOn;
        const toggle = document.querySelector(`.room-toggle[data-room="${room}"]`);
        if (toggle) toggle.checked = allOn;
    });
    
    updateLights();
    
    showNotification(
        'All Lights',
        allOn ? 'All lights turned ON' : 'All lights turned OFF',
        allOn ? 'success' : 'info'
    );
    
    addActivity(
        'All lights',
        allOn ? 'Turned all lights ON' : 'Turned all lights OFF',
        allOn ? 'success' : 'info'
    );
}

function adjustTemperature(change) {
    const thermo = state.devices.thermostat;
    const newTemp = thermo.temperature + change;
    
    if (newTemp >= 60 && newTemp <= 85) {
        thermo.temperature = newTemp;
        thermo.setpoint = newTemp;
        DOM.tempSlider.value = newTemp;
        
        updateThermostat();
        
        showNotification('Temperature Adjusted', `Set to ${newTemp}°C`, 'info');
        addActivity('Temperature', `Adjusted to ${newTemp}°C`, 'info');
        
        checkTemperatureThresholds(newTemp);
    }
}

function updateTemperatureSlider() {
    const thermo = state.devices.thermostat;
    thermo.temperature = parseInt(DOM.tempSlider.value);
    thermo.setpoint = thermo.temperature;
    
    updateThermostat();
    
    addActivity('Temperature', `Set to ${thermo.temperature}°C via slider`, 'info');
}

function changeThermostatMode(e) {
    const mode = e.currentTarget.dataset.mode;
    const thermo = state.devices.thermostat;
    thermo.mode = mode;
    
    // Update active state
    DOM.modeButtons.forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    updateThermostat();
    
    showNotification('Thermostat Mode', `Changed to ${mode.toUpperCase()} mode`, 'info');
    addActivity('Thermostat mode', `Set to ${mode}`, 'info');
}

function setAutoClimate() {
    const thermo = state.devices.thermostat;
    thermo.mode = 'auto';
    thermo.temperature = 72;
    thermo.setpoint = 72;
    DOM.tempSlider.value = 72;
    
    // Update active state
    DOM.modeButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.mode-btn[data-mode="auto"]').classList.add('active');
    
    updateThermostat();
    
    showNotification('Climate Control', 'Set to AUTO mode at 22.2°C', 'success');
    addActivity('Climate control', 'Set to AUTO mode', 'success');
}

function armSecurity(mode) {
    const security = state.devices.security;
    
    if (mode === 'disarm') {
        security.armed = false;
        security.mode = 'disarmed';
        showNotification('Security System', 'System disarmed', 'info');
        addActivity('Security system', 'Disarmed', 'info');
    } else {
        security.armed = true;
        security.mode = mode;
        const message = mode === 'home' ? 'Armed (Home Mode)' : 'Armed (Away Mode)';
        showNotification('Security System', message, 'success');
        addActivity('Security system', message, 'success');
    }
    
    updateSecurity();
}

function triggerPanic() {
    showNotification('PANIC ALERT', 'Emergency alert triggered! Authorities notified.', 'danger');
    addActivity('PANIC BUTTON', 'Emergency alert activated', 'danger');
    
    // Flash red animation
    document.body.style.backgroundColor = '#ff3366';
    setTimeout(() => {
        document.body.style.backgroundColor = '';
    }, 500);
    
    // Send simulated alert
    setTimeout(() => {
        showNotification('Emergency Services', 'Alert received. Help is on the way.', 'warning');
    }, 2000);
}

function toggleCamera() {
    const camera = state.devices.camera;
    camera.status = !camera.status;
    camera.lastChange = new Date();
    
    if (camera.status) {
        camera.live = false;
        setTimeout(() => {
            camera.live = true;
            camera.recording = true;
            updateCamera();
            showNotification('Security Camera', 'Camera activated and recording', 'success');
        }, 1500);
    } else {
        camera.live = false;
        camera.recording = false;
    }
    
    updateCamera();
    
    const message = camera.status 
        ? 'Camera activated. Live feed starting...'
        : 'Camera deactivated';
    
    showNotification('Security Camera', message, camera.status ? 'success' : 'info');
    addActivity('Security camera', camera.status ? 'Activated' : 'Deactivated', camera.status ? 'success' : 'info');
}

function toggleRecording() {
    const camera = state.devices.camera;
    if (!camera.status) {
        showNotification('Camera Offline', 'Please activate camera first', 'warning');
        return;
    }
    
    camera.recording = !camera.recording;
    
    showNotification(
        'Recording',
        camera.recording ? 'Recording started' : 'Recording stopped',
        camera.recording ? 'success' : 'info'
    );
    
    addActivity(
        'Camera recording',
        camera.recording ? 'Started' : 'Stopped',
        camera.recording ? 'success' : 'info'
    );
    
    updateCamera();
}

function takeSnapshot() {
    const camera = state.devices.camera;
    
    if (!camera.status) {
        showNotification('Camera Offline', 'Please activate camera first', 'warning');
        return;
    }
    
    camera.lastSnapshot = new Date();
    camera.storage += 0.1;
    
    if (camera.storage > camera.maxStorage) {
        showNotification('Storage Warning', 'Camera storage almost full', 'warning');
    }
    
    showNotification('Snapshot', 'Photo captured and saved', 'success');
    addActivity('Camera snapshot', 'Photo captured', 'success');
    
    updateCamera();
}

function toggleDevice(e) {
    const deviceId = e.target.dataset.device;
    const device = state.devices.devices[deviceId];
    
    if (device) {
        device.status = e.target.checked;
        
        showNotification(
            device.name,
            device.status ? 'Turned ON' : 'Turned OFF',
            device.status ? 'success' : 'info'
        );
        
        addActivity(
            device.name,
            device.status ? 'Turned ON' : 'Turned OFF',
            device.status ? 'success' : 'info'
        );
        
        updateDevice(deviceId);
    }
}

function toggleAllDevices() {
    const devices = state.devices.devices;
    const allOn = !Object.values(devices).every(d => d.status === true);
    
    Object.values(devices).forEach(device => {
        device.status = allOn;
        const toggle = document.querySelector(`.device-toggle[data-device="${device.id}"]`);
        if (toggle) toggle.checked = allOn;
        updateDevice(device.id);
    });
    
    showNotification(
        'All Devices',
        allOn ? 'All smart devices turned ON' : 'All smart devices turned OFF',
        allOn ? 'success' : 'info'
    );
    
    addActivity(
        'All smart devices',
        allOn ? 'Turned all ON' : 'Turned all OFF',
        allOn ? 'success' : 'info'
    );
}

function changeAnalyticsPeriod(e) {
    const period = e.currentTarget.dataset.period;
    state.analytics.period = period;
    
    // Update active state
    DOM.timeButtons.forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    // Update chart
    if (energyChart) {
        energyChart.data.datasets[0].data = state.analytics.data[period];
        energyChart.update();
    }
    
    showNotification('Analytics Period', `Switched to ${period} view`, 'info');
    addActivity('Analytics view', `Changed to ${period}`, 'info');
}

function clearActivity() {
    state.activity = [];
    updateActivityFeed();
    showNotification('Activity Feed', 'All activity logs cleared', 'info');
}

// Update Functions
function updateAllDevices() {
    updateLights();
    updateThermostat();
    updateSecurity();
    updateCamera();
    updateDevices();
    updateAnalytics();
    updateQuickStats();
}

function updateLights() {
    const lights = state.devices.lights;
    
    // Update UI
    DOM.lightStatus.textContent = lights.status ? 'ONLINE' : 'OFFLINE';
    DOM.lightStatus.style.color = lights.status ? '#00d68f' : '#ff3366';
    DOM.brightnessValue.textContent = `${lights.brightness}%`;
    DOM.lightEnergy.textContent = lights.energyUsage.toFixed(1);
    DOM.lightUptime.textContent = formatUptime(lights.uptime);
    DOM.lightCost.textContent = `${(lights.energyUsage * 100.12).toFixed(2)}Tshs`;
    
    // Update glow effect
    if (lights.status && lights.brightness > 0) {
        DOM.lightGlow.style.opacity = (lights.brightness / 100) * 0.5;
        DOM.lightGlow.style.animation = `lightPulse ${2 - (lights.brightness / 100)}s ease-in-out infinite`;
    } else {
        DOM.lightGlow.style.opacity = '0';
    }
    
    // Update color preset active state
    DOM.colorPresets.forEach(p => {
        p.classList.toggle('active', p.dataset.color === lights.color);
    });
}

function updateThermostat() {
    const thermo = state.devices.thermostat;
    
    // Update UI
    DOM.temperatureValue.textContent = thermo.temperature;
    DOM.setpointValue.textContent = `${thermo.setpoint}°C`;
    DOM.homeTemp.textContent = `${thermo.temperature}°C`;
    DOM.tempFill.style.width = `${((thermo.temperature - 60) / 25) * 100}%`;
    DOM.thermostatMode.textContent = thermo.mode.toUpperCase();
    DOM.thermostatEnergy.textContent = thermo.energyUsage.toFixed(1);
    DOM.humidityValue.textContent = `${thermo.humidity}%`;
    
    // Update thermostat mode color
    let modeColor;
    switch(thermo.mode) {
        case 'heat': modeColor = '#ff3366'; break;
        case 'cool': modeColor = '#4d94ff'; break;
        case 'fan': modeColor = '#00d68f'; break;
        default: modeColor = '#ffaa00';
    }
    DOM.thermostatMode.style.color = modeColor;
}

function updateSecurity() {
    const security = state.devices.security;
    
    // Update UI
    DOM.securitySystemStatus.textContent = security.armed 
        ? `ARMED ${security.mode.toUpperCase()}`
        : 'DISARMED';
    DOM.securityStatus.textContent = security.armed ? 'ARMED' : 'DISARMED';
    
    // Update sensor indicators
    Object.entries(security.sensors).forEach(([sensor, data]) => {
        const indicator = document.querySelector(`.sensor-item[data-sensor="${sensor}"]`);
        if (indicator) {
            indicator.classList.toggle('online', !data.active);
            indicator.classList.toggle('offline', data.active);
            indicator.querySelector('.sensor-status').textContent = data.status.toUpperCase();
        }
    });
}

function updateCamera() {
    const camera = state.devices.camera;
    
    // Update UI
    DOM.cameraPreview.classList.toggle('active', camera.status);
    DOM.cameraTimestamp.textContent = camera.status ? new Date().toLocaleTimeString() : '--:--:--';
    DOM.recordingStatus.style.display = camera.recording ? 'inline' : 'none';
    DOM.cameraUptime.textContent = formatUptime(camera.uptime);
    DOM.cameraStorage.textContent = `${camera.storage.toFixed(1)}/${camera.maxStorage} GB`;
    DOM.motionDetected.textContent = camera.motionDetected ? 'Detected' : 'None';
    
    // Update overlay
    const overlay = DOM.cameraPreview.querySelector('.camera-overlay');
    if (camera.status) {
        overlay.style.display = 'none';
    } else {
        overlay.style.display = 'flex';
    }
}

function updateDevice(deviceId) {
    const device = state.devices.devices[deviceId];
    if (!device) return;
    
    const element = document.querySelector(`.device-item[data-device="${deviceId}"]`);
    if (element) {
        const status = element.querySelector('.device-status');
        const power = element.querySelector('.device-power');
        const metrics = element.querySelectorAll('.device-metrics span:nth-child(2)');
        
        status.classList.toggle('online', device.status);
        status.classList.toggle('offline', !device.status);
        power.textContent = device.status ? `${device.power}W` : '0W';
        
        if (metrics[0]) metrics[0].textContent = `${device.energyUsage.toFixed(1)} kWh`;
        if (metrics[1]) metrics[1].textContent = `${(device.energyUsage * 0.12).toFixed(2)}Tshs`;
    }
}

function updateDevices() {
    Object.keys(state.devices.devices).forEach(deviceId => {
        updateDevice(deviceId);
    });
}

function updateAnalytics() {
    // Update breakdown list
    DOM.breakdownList.innerHTML = '';
    
    const devices = [
        { name: 'Lighting', usage: state.devices.lights.energyUsage, color: '#ffaa00' },
        { name: 'Climate Control', usage: state.devices.thermostat.energyUsage, color: '#ff3366' },
        { name: 'Security System', usage: state.devices.camera.energyUsage, color: '#4d94ff' },
        { name: 'Smart Devices', usage: Object.values(state.devices.devices).reduce((sum, d) => sum + d.energyUsage, 0), color: '#00d68f' }
    ];
    
    const total = devices.reduce((sum, d) => sum + d.usage, 0);
    
    devices.forEach(device => {
        const percentage = total > 0 ? (device.usage / total * 100) : 0;
        const item = document.createElement('div');
        item.className = 'breakdown-item';
        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div class="breakdown-icon" style="background: ${device.color}">
                    <div class="icon-placeholder"></div>
                </div>
                <span style="font-weight: 500;">${device.name}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-weight: 600;">${device.usage.toFixed(1)} kWh</span>
                <span style="color: var(--text-tertiary); font-size: 0.9rem;">${percentage.toFixed(0)}%</span>
            </div>
        `;
        DOM.breakdownList.appendChild(item);
    });
    
    // Update stats
    DOM.peakUsage.textContent = `${state.analytics.peakUsage.toFixed(1)} kW`;
    DOM.todayCost.textContent = `${state.analytics.todayCost.toFixed(2)} Tshs`;
    DOM.carbonSaved.textContent = `${state.analytics.carbonSaved.toFixed(1)} kg`;
}

function updateQuickStats() {
    // Calculate current energy usage
    let currentUsage = 0;
    if (state.devices.lights.status) currentUsage += state.devices.lights.energyRate * (state.devices.lights.brightness / 100);
    if (state.devices.thermostat.status !== 'idle') currentUsage += state.devices.thermostat.energyRate;
    if (state.devices.camera.status) currentUsage += state.devices.camera.energyRate;
    currentUsage += Object.values(state.devices.devices).reduce((sum, d) => sum + (d.status ? d.power / 1000 : 0), 0);
    
    DOM.currentEnergy.textContent = `${currentUsage.toFixed(1)} kW`;
    DOM.energyProgress.style.width = `${Math.min((currentUsage / 3) * 100, 100)}%`;
    
    // Update network health with slight variations
    if (Math.random() < 0.1) {
        const health = 96 + Math.random() * 3;
        DOM.networkHealth.textContent = `${health.toFixed(0)}%`;
    }
}

// Activity Feed
function addActivity(title, description, type = 'info') {
    const activity = {
        id: Date.now(),
        title,
        description,
        type,
        timestamp: new Date(),
        icon: getActivityIcon(type)
    };
    
    state.activity.unshift(activity);
    if (state.activity.length > 10) state.activity.pop();
    
    updateActivityFeed();
}

function updateActivityFeed() {
    DOM.activityFeed.innerHTML = '';
    
    state.activity.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-icon ${activity.type}">
                <i class="fas fa-${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-desc">${activity.description}</div>
            </div>
            <div class="activity-time">${formatTime(activity.timestamp)}</div>
        `;
        DOM.activityFeed.appendChild(item);
    });
}

function getActivityIcon(type) {
    const icons = {
        success: 'check-circle',
        warning: 'exclamation-triangle',
        danger: 'times-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Notifications
function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${getActivityIcon(type)}"></i>
        </div>
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;
    
    DOM.notificationsContainer.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Utility Functions
function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}

function formatTime(date) {
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function updateCurrentTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
    const dateStr = now.toLocaleDateString([], {weekday: 'short', month: 'short', day: 'numeric'});
    
    DOM.currentTime.querySelector('span').textContent = timeStr;
    DOM.currentDate.querySelector('span').textContent = dateStr;
}

function checkTemperatureThresholds(temp) {
    if (temp >= 78) {
        showNotification('High Temperature', 'Consider lowering thermostat to save energy', 'warning');
    } else if (temp <= 64) {
        showNotification('Low Temperature', 'Consider raising thermostat for comfort', 'warning');
    }
}

// Simulation
function startSimulation() {
    // Energy usage simulation
    setInterval(() => {
        simulateEnergyUsage();
        simulateDeviceBehavior();
        updateAllDevices();
        updateChartData();
        checkAlerts();
    }, 5000); // Update every 5 seconds (faster)
    
    // Real-time elements update
    setInterval(() => {
        updateRealTimeElements();
    }, 1000);
}

function simulateEnergyUsage() {
    const now = new Date();
    
    // Lights
    const lights = state.devices.lights;
    if (lights.status) {
        const hours = 5 / 3600;
        const brightnessFactor = lights.brightness / 100;
        lights.energyUsage += lights.energyRate * brightnessFactor * hours;
        lights.uptime += 5;
    }
    
    // Thermostat
    const thermo = state.devices.thermostat;
    if (thermo.status !== 'idle') {
        const hours = 5 / 3600;
        thermo.energyUsage += thermo.energyRate * hours;
        
        // Auto-adjust temperature based on mode
        if (thermo.mode === 'heat' && thermo.temperature < thermo.setpoint) {
            thermo.temperature = Math.min(thermo.temperature + 0.5, thermo.setpoint);
        } else if (thermo.mode === 'cool' && thermo.temperature > thermo.setpoint) {
            thermo.temperature = Math.max(thermo.temperature - 0.5, thermo.setpoint);
        }
    }
    
    // Camera
    const camera = state.devices.camera;
    if (camera.status) {
        const hours = 5 / 3600;
        camera.energyUsage += camera.energyRate * hours;
        camera.uptime += 5;
        
        if (camera.recording) {
            camera.storage += 0.05;
            if (camera.storage > camera.maxStorage) {
                camera.storage = camera.maxStorage;
            }
        }
    }
    
    // Smart devices
    Object.values(state.devices.devices).forEach(device => {
        if (device.status) {
            const hours = 5 / 3600;
            device.energyUsage += (device.power / 1000) * hours;
        }
    });
    
    // Update analytics data
    const hour = now.getHours();
    state.analytics.data.day[hour] = 1.5 + Math.random() * 1.5;
}

function simulateDeviceBehavior() {
    // Random security events (10% chance)
    if (state.devices.security.armed && Math.random() < 0.1) {
        const sensors = Object.keys(state.devices.security.sensors);
        const randomSensor = sensors[Math.floor(Math.random() * sensors.length)];
        const sensor = state.devices.security.sensors[randomSensor];
        
        if (!sensor.active && Math.random() < 0.3) {
            sensor.active = true;
            sensor.lastTrigger = new Date();
            
            showNotification(
                'Security Alert',
                `${randomSensor.replace('-', ' ').toUpperCase()} triggered`,
                'warning'
            );
            
            addActivity(
                'Security alert',
                `${randomSensor.replace('-', ' ')} triggered`,
                'warning'
            );
            
            // Auto-clear after 30 seconds
            setTimeout(() => {
                sensor.active = false;
                updateSecurity();
            }, 30000);
        }
    }
    
    // Camera motion detection
    if (state.devices.camera.status && Math.random() < 0.15) {
        state.devices.camera.motionDetected = true;
        setTimeout(() => {
            state.devices.camera.motionDetected = false;
            updateCamera();
        }, 10000);
    }
    
    // Random temperature fluctuations
    if (Math.random() < 0.2) {
        const change = (Math.random() - 0.5) * 0.5;
        const thermo = state.devices.thermostat;
        const newTemp = thermo.temperature + change;
        if (newTemp >= 60 && newTemp <= 85) {
            thermo.temperature = Math.round(newTemp * 10) / 10;
        }
    }
    
    // Random humidity fluctuations
    if (Math.random() < 0.1) {
        const change = (Math.random() - 0.5) * 2;
        const newHumidity = state.devices.thermostat.humidity + change;
        if (newHumidity >= 30 && newHumidity <= 60) {
            state.devices.thermostat.humidity = Math.round(newHumidity);
        }
    }
    
    // Update analytics metrics
    state.analytics.peakUsage = 2.4 + Math.random() * 0.3;
    state.analytics.todayCost = (Object.values(state.devices).reduce((sum, d) => sum + (d.energyUsage || 0), 0) * 0.12) + Math.random() * 0.1;
    state.analytics.carbonSaved = 4.2 + Math.random() * 0.3;
    state.analytics.efficiency = 85 + Math.random() * 10;
}

function updateChartData() {
    if (energyChart) {
        const now = new Date();
        const hour = now.getHours();
        
        // Add slight variation
        const variation = (Math.random() - 0.5) * 0.3;
        state.analytics.data.day[hour] = Math.max(0.2, (state.analytics.data.day[hour] || 1) + variation);
        
        energyChart.data.datasets[0].data = state.analytics.data[state.analytics.period];
        energyChart.update('none');
    }
}

function checkAlerts() {
    // High energy usage
    const totalEnergy = Object.values(state.devices).reduce((sum, d) => sum + (d.energyUsage || 0), 0);
    if (totalEnergy > 15 && Math.random() < 0.1) {
        showNotification(
            'High Energy Usage',
            `Total consumption: ${totalEnergy.toFixed(1)} kWh. Consider reducing usage.`,
            'warning'
        );
    }
    
    // Camera storage warning
    if (state.devices.camera.storage > state.devices.camera.maxStorage * 0.9 && Math.random() < 0.1) {
        showNotification(
            'Storage Warning',
            'Camera storage almost full. Consider clearing old recordings.',
            'warning'
        );
    }
}

function updateRealTimeElements() {
    // Update camera timestamp if active
    if (state.devices.camera.status) {
        DOM.cameraTimestamp.textContent = new Date().toLocaleTimeString();
    }
    
    // Random network fluctuations
    if (Math.random() < 0.05) {
        const bars = document.querySelectorAll('.signal-bars .bar');
        bars.forEach((bar, i) => {
            const threshold = (i + 1) * 20;
            const health = 96 + Math.random() * 3;
            bar.style.background = health >= threshold ? '#00d68f' : '#ffaa00';
        });
    }
}

// Modal Functions
function openDeviceModal(deviceId) {
    let title = '';
    let content = '';
    
    switch(deviceId) {
        case 'energy':
            title = 'Energy Analytics';
            content = `
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <div>
                        <h4 style="color: var(--text-secondary); margin-bottom: 10px;">Detailed Statistics</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div class="stat-box">
                                <span>Peak Demand</span>
                                <span style="font-weight: 700; color: var(--text-primary);">2.4 kW</span>
                            </div>
                            <div class="stat-box">
                                <span>Avg Daily</span>
                                <span style="font-weight: 700; color: var(--text-primary);">1.8 kW</span>
                            </div>
                            <div class="stat-box">
                                <span>Monthly Cost</span>
                                <span style="font-weight: 700; color: var(--text-primary);">10042.50Tshs</span>
                            </div>
                            <div class="stat-box">
                                <span>Carbon Saved</span>
                                <span style="font-weight: 700; color: var(--text-primary);">24.5 kg</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 style="color: var(--text-secondary); margin-bottom: 10px;">Usage Tips</h4>
                        <ul style="color: var(--text-secondary); padding-left: 20px;">
                            <li>Turn off lights when not in room</li>
                            <li>Use smart plugs for vampire power</li>
                            <li>Set thermostat schedule</li>
                            <li>Consider energy-efficient appliances</li>
                        </ul>
                    </div>
                </div>
            `;
            break;
            
        case 'temperature':
            title = 'Climate Control Details';
            content = `
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <div>
                        <h4 style="color: var(--text-secondary); margin-bottom: 10px;">Current Status</h4>
                        <p style="font-size: 1.2rem; color: var(--text-primary);">
                            Temperature: ${state.devices.thermostat.temperature}°C<br>
                            Humidity: ${state.devices.thermostat.humidity}%<br>
                            Mode: ${state.devices.thermostat.mode.toUpperCase()}<br>
                            Setpoint: ${state.devices.thermostat.setpoint}°C
                        </p>
                    </div>
                    <div>
                        <h4 style="color: var(--text-secondary); margin-bottom: 10px;">Schedule</h4>
                        <div style="background: var(--bg-glass); padding: 15px; border-radius: var(--radius-md);">
                            <p style="color: var(--text-secondary); margin: 0;">
                                Next adjustment: 10:00 PM (Sleep Mode)<br>
                                Daily schedule active
                            </p>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        default:
            title = 'Device Information';
            content = `
                <div style="text-align: center; padding: 40px 20px;">
                    <i class="fas fa-info-circle" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 20px;"></i>
                    <p style="color: var(--text-secondary);">Detailed information for ${deviceId} will be displayed here.</p>
                </div>
            `;
    }
    
    DOM.modalTitle.textContent = title;
    DOM.modalBody.innerHTML = content;
    DOM.modal.classList.add('active');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initDashboard);

// Export for debugging
window.smartHomeState = state;
window.dashboard = {
    toggleLights,
    adjustTemperature,
    armSecurity,
    toggleCamera,
    showNotification,
    addActivity
};
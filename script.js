// Smart Home Dashboard - Enhanced Interactive Version
// Complete IoT simulation with animated background

// State Management
const state = {
    theme: 'dark',
    devices: {
        lighting: {
            status: true,
            brightness: 75,
            power: 0.8,
            scene: 'relax',
            energy: 2.4
        },
        climate: {
            status: true,
            currentTemp: 72,
            targetTemp: 72,
            mode: 'heating',
            humidity: 45,
            power: 1.2
        },
        security: {
            armed: true,
            mode: 'home',
            zones: {
                'front-door': true,
                'back-door': false,
                'camera-1': true,
                'camera-2': false,
                'living-room': false,
                'kitchen': true
            }
        },
        cameras: {
            'camera-1': { status: 'live', recording: false },
            'camera-2': { status: 'offline', recording: false },
            'camera-3': { status: 'idle', recording: false },
            'camera-4': { status: 'live', recording: false }
        },
        smartDevices: {
            'plug1': { status: true, power: 45, name: 'Living Room Lamp' },
            'thermo': { status: true, temp: 72, name: 'Bedroom AC' },
            'lock': { status: true, locked: true, name: 'Front Door Lock' },
            'blinds': { status: true, position: 75, name: 'Smart Blinds' },
            'speaker': { status: true, playing: true, name: 'Living Room Audio' },
            'vacuum': { status: false, charging: true, name: 'Robot Vacuum' }
        }
    },
    analytics: {
        peakUsage: 2.4,
        avgUsage: 1.2,
        dailyCost: 1.85,
        efficiency: 87,
        energySaved: 4.8,
        connectedDevices: 12
    },
    notifications: [],
    backgroundAnimation: {
        speed: 1,
        intensity: 0.5,
        particles: 50,
        connections: true
    }
};

// Canvas Background Animation
class BackgroundAnimation {
    constructor() {
        this.canvas = document.getElementById('bgCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.animationSpeed = 1.5; // Increased speed
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Create particles
        this.createParticles();
        
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Click effects
        document.addEventListener('click', (e) => {
            this.createClickEffect(e.clientX, e.clientY);
        });
        
        // Start animation
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        const particleCount = Math.min(Math.floor(window.innerWidth / 20), 100);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 2 * this.animationSpeed,
                speedY: (Math.random() - 0.5) * 2 * this.animationSpeed,
                color: `rgba(0, 102, 255, ${Math.random() * 0.5 + 0.2})`
            });
        }
    }
    
    createClickEffect(x, y) {
        // Create ripple effect
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.particles.push({
                    x,
                    y,
                    size: Math.random() * 4 + 2,
                    speedX: (Math.random() - 0.5) * 8 * this.animationSpeed,
                    speedY: (Math.random() - 0.5) * 8 * this.animationSpeed,
                    color: `rgba(0, 170, 255, ${Math.random() * 0.7 + 0.3})`,
                    life: 1
                });
            }, i * 30);
        }
        
        // Create connection burst
        this.createConnectionBurst(x, y);
    }
    
    createConnectionBurst(x, y) {
        const connections = [];
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            connections.push({
                x1: x,
                y1: y,
                x2: x + Math.cos(angle) * 100,
                y2: y + Math.sin(angle) * 100,
                progress: 0,
                speed: 0.05 * this.animationSpeed,
                color: `rgba(0, 102, 255, ${Math.random() * 0.5 + 0.5})`
            });
        }
        
        this.connections.push(...connections);
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Bounce off walls
            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;
            
            // Apply mouse attraction
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                p.speedX += (dx / distance) * force * 0.2 * this.animationSpeed;
                p.speedY += (dy / distance) * force * 0.2 * this.animationSpeed;
            }
            
            // Decay for click particles
            if (p.life !== undefined) {
                p.life -= 0.02 * this.animationSpeed;
                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                }
            }
            
            // Limit speed
            const speed = Math.sqrt(p.speedX * p.speedX + p.speedY * p.speedY);
            if (speed > 3 * this.animationSpeed) {
                p.speedX = (p.speedX / speed) * 3 * this.animationSpeed;
                p.speedY = (p.speedY / speed) * 3 * this.animationSpeed;
            }
        }
    }
    
    updateConnections() {
        for (let i = this.connections.length - 1; i >= 0; i--) {
            const c = this.connections[i];
            c.progress += c.speed;
            
            if (c.progress >= 1) {
                this.connections.splice(i, 1);
            }
        }
    }
    
    drawParticles() {
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
            
            // Add glow effect
            if (p.life !== undefined) {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(0, 170, 255, ${p.life * 0.2})`;
                this.ctx.fill();
            }
        });
    }
    
    drawConnections() {
        // Draw connections between nearby particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = 0.3 * (1 - distance / 100);
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(0, 102, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw connection bursts
        this.connections.forEach(c => {
            const x = c.x1 + (c.x2 - c.x1) * c.progress;
            const y = c.y1 + (c.y2 - c.y1) * c.progress;
            
            this.ctx.beginPath();
            this.ctx.moveTo(c.x1, c.y1);
            this.ctx.lineTo(x, y);
            this.ctx.strokeStyle = c.color;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Draw particle at the end
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = c.color;
            this.ctx.fill();
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, 'rgba(0, 17, 34, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 34, 68, 0.8)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw
        this.updateParticles();
        this.updateConnections();
        this.drawConnections();
        this.drawParticles();
        
        // Draw grid overlay
        this.drawGrid();
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawGrid() {
        const gridSize = 50;
        const offsetX = (Date.now() * 0.02) % gridSize;
        const offsetY = (Date.now() * 0.02) % gridSize;
        
        this.ctx.strokeStyle = 'rgba(0, 102, 255, 0.05)';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = -offsetX; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = -offsetY; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    updateSpeed(speed) {
        this.animationSpeed = speed;
        this.particles.forEach(p => {
            p.speedX = (p.speedX / Math.abs(p.speedX || 1)) * Math.abs(p.speedX) * (speed / this.animationSpeed);
            p.speedY = (p.speedY / Math.abs(p.speedY || 1)) * Math.abs(p.speedY) * (speed / this.animationSpeed);
        });
    }
}

// Dashboard Application
class SmartHomeDashboard {
    constructor() {
        this.bgAnimation = null;
        this.energyChart = null;
        this.init();
    }
    
    init() {
        console.log('🚀 Initializing Smart Home Dashboard v4.0...');
        
        // Initialize background animation
        this.initBackground();
        
        // Initialize theme
        this.initTheme();
        
        // Initialize charts
        this.initCharts();
        
        // Initialize device states
        this.initDevices();
        
        // Set up event listeners
        this.initEventListeners();
        
        // Start simulations
        this.startSimulations();
        
        // Show welcome notification
        this.showToast('System Online', 'All systems connected and ready', 'success');
        this.addNotification('System initialized', 'All devices connected', 'info');
        
        console.log('✅ Dashboard initialized successfully');
    }
    
    initBackground() {
        this.bgAnimation = new BackgroundAnimation();
        
        // Create additional background effects
        this.createFloatingNodes();
        this.createDataStreams();
        this.createPulseEffects();
        this.createConnectionMesh();
        this.createEnergyRipples();
    }
    
    createFloatingNodes() {
        const container = document.querySelector('.floating-nodes');
        const nodeCount = 15;
        
        for (let i = 0; i < nodeCount; i++) {
            const node = document.createElement('div');
            node.className = 'floating-node';
            
            // Random position
            node.style.left = `${Math.random() * 100}%`;
            node.style.top = `${Math.random() * 100}%`;
            
            // Random size and animation delay
            const size = 4 + Math.random() * 8;
            node.style.width = `${size}px`;
            node.style.height = `${size}px`;
            node.style.animationDelay = `${Math.random() * 5}s`;
            
            container.appendChild(node);
        }
    }
    
    createDataStreams() {
        const container = document.querySelector('.data-streams');
        const streamCount = 8;
        
        for (let i = 0; i < streamCount; i++) {
            const stream = document.createElement('div');
            stream.className = 'data-stream';
            
            // Random position
            stream.style.left = `${Math.random() * 100}%`;
            stream.style.animationDelay = `${Math.random() * 3}s`;
            
            // Random length and speed
            const length = 50 + Math.random() * 100;
            stream.style.height = `${length}px`;
            stream.style.animationDuration = `${2 + Math.random() * 2}s`;
            
            container.appendChild(stream);
        }
    }
    
    createPulseEffects() {
        const container = document.querySelector('.pulse-effects');
        const pulseCount = 3;
        
        for (let i = 0; i < pulseCount; i++) {
            const pulse = document.createElement('div');
            pulse.className = 'pulse';
            
            // Random position
            pulse.style.left = `${Math.random() * 100}%`;
            pulse.style.top = `${Math.random() * 100}%`;
            
            // Random delay and duration
            pulse.style.animationDelay = `${Math.random() * 4}s`;
            pulse.style.animationDuration = `${3 + Math.random() * 3}s`;
            
            container.appendChild(pulse);
        }
    }
    
    createConnectionMesh() {
        const container = document.querySelector('.connection-mesh');
        const lineCount = 12;
        
        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.className = 'connection-line';
            
            // Random position and rotation
            const x1 = Math.random() * 100;
            const y1 = Math.random() * 100;
            const length = 50 + Math.random() * 150;
            const angle = Math.random() * 360;
            
            line.style.left = `${x1}%`;
            line.style.top = `${y1}%`;
            line.style.width = `${length}px`;
            line.style.transform = `rotate(${angle}deg)`;
            line.style.animationDelay = `${Math.random() * 2}s`;
            
            container.appendChild(line);
        }
    }
    
    createEnergyRipples() {
        const container = document.querySelector('.energy-ripples');
        const rippleCount = 5;
        
        for (let i = 0; i < rippleCount; i++) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            
            // Random position
            ripple.style.left = `${Math.random() * 100}%`;
            ripple.style.top = `${Math.random() * 100}%`;
            
            // Random delay and duration
            ripple.style.animationDelay = `${Math.random() * 3}s`;
            ripple.style.animationDuration = `${2 + Math.random() * 2}s`;
            
            container.appendChild(ripple);
        }
    }
    
    initTheme() {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', state.theme);
        
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', state.theme);
            
            this.showToast(
                'Theme Changed',
                `Switched to ${state.theme} mode`,
                'info'
            );
            
            this.addNotification('Theme changed', `Switched to ${state.theme} mode`, 'info');
        });
    }
    
    initCharts() {
        const ctx = document.getElementById('energy-chart').getContext('2d');
        
        // Generate time labels
        const labels = [];
        for (let i = 0; i < 24; i++) {
            labels.push(`${i}:00`);
        }
        
        // Generate energy data
        const data = labels.map(() => Math.random() * 2 + 0.5);
        
        this.energyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Energy Usage (kW)',
                    data: data,
                    borderColor: '#0066FF',
                    backgroundColor: 'rgba(0, 102, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#0066FF',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(26, 34, 56, 0.9)',
                        titleColor: '#FFFFFF',
                        bodyColor: '#94A3B8',
                        borderColor: '#475569',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94A3B8',
                            maxRotation: 0,
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94A3B8',
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
                }
            }
        });
    }
    
    initDevices() {
        this.updateAllDevices();
    }
    
    updateAllDevices() {
        this.updateLighting();
        this.updateClimate();
        this.updateSecurity();
        this.updateCameras();
        this.updateSmartDevices();
        this.updateAnalytics();
    }
    
    updateLighting() {
        const lighting = state.devices.lighting;
        
        // Update brightness
        document.getElementById('brightness-value').textContent = `${lighting.brightness}%`;
        document.getElementById('brightness-slider').value = lighting.brightness;
        
        // Update power
        const power = lighting.power * (lighting.brightness / 100);
        document.getElementById('light-energy').textContent = `${power.toFixed(1)} kW`;
        
        // Update toggle button
        const toggleBtn = document.getElementById('light-toggle');
        toggleBtn.classList.toggle('active', lighting.status);
        toggleBtn.querySelector('.toggle-label').textContent = lighting.status ? 'ON' : 'OFF';
        
        // Update scene buttons
        document.querySelectorAll('[data-scene]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.scene === lighting.scene);
        });
    }
    
    updateClimate() {
        const climate = state.devices.climate;
        
        // Update temperature
        document.getElementById('current-temp').textContent = climate.currentTemp;
        document.getElementById('target-temp').textContent = `${climate.targetTemp}°F`;
        
        // Update status
        document.getElementById('climate-status').textContent = climate.mode.toUpperCase();
        
        // Update humidity
        document.getElementById('humidity').textContent = `${climate.humidity}%`;
        
        // Update energy
        document.getElementById('climate-energy').textContent = `${climate.power} kW`;
        
        // Update preset buttons
        document.querySelectorAll('[data-temp]').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.temp) === climate.targetTemp);
        });
    }
    
    updateSecurity() {
        const security = state.devices.security;
        
        // Update status
        const statusEl = document.querySelector('.device-status.armed');
        statusEl.textContent = security.armed ? 'ARMED' : 'DISARMED';
        
        // Update zones
        Object.entries(security.zones).forEach(([zone, active]) => {
            const zoneEl = document.querySelector(`[data-zone="${zone}"]`);
            if (zoneEl) {
                zoneEl.classList.toggle('active', active);
            }
        });
    }
    
    updateCameras() {
        const cameras = state.devices.cameras;
        
        Object.entries(cameras).forEach(([cameraId, camera]) => {
            const cameraEl = document.getElementById(cameraId.replace('-', '-'));
            if (cameraEl) {
                const statusEl = cameraEl.querySelector('.camera-status');
                statusEl.textContent = camera.status.toUpperCase();
                statusEl.classList.toggle('live', camera.status === 'live');
                
                // Update timestamp
                if (camera.status === 'live') {
                    const timestamp = cameraEl.querySelector('.timestamp');
                    if (timestamp) {
                        timestamp.textContent = new Date().toLocaleTimeString();
                    }
                }
            }
        });
        
        // Update recording button
        const recordBtn = document.getElementById('record-btn');
        recordBtn.classList.toggle('recording', Object.values(cameras).some(c => c.recording));
    }
    
    updateSmartDevices() {
        Object.entries(state.devices.smartDevices).forEach(([deviceId, device]) => {
            const tile = document.querySelector(`[data-device="${deviceId}"]`);
            if (tile) {
                const statusEl = tile.querySelector('.status');
                const toggleBtn = tile.querySelector('.tile-toggle');
                
                if (statusEl) {
                    statusEl.textContent = device.status ? 'ON' : 'OFF';
                    statusEl.style.color = device.status ? '#00D4AA' : '#94A3B8';
                }
                
                if (toggleBtn) {
                    toggleBtn.classList.toggle('active', device.status);
                }
            }
        });
    }
    
    updateAnalytics() {
        const analytics = state.analytics;
        
        // Update quick stats
        document.getElementById('power-usage').textContent = `${analytics.avgUsage.toFixed(2)} kW`;
        document.getElementById('connected-devices').textContent = analytics.connectedDevices;
        document.getElementById('energy-saved').textContent = `${analytics.energySaved} kWh`;
        
        // Update analytics summary
        document.getElementById('peak-usage').textContent = `${analytics.peakUsage.toFixed(1)} kW`;
        document.getElementById('avg-usage').textContent = `${analytics.avgUsage.toFixed(1)} kWh`;
        document.getElementById('daily-cost').textContent = `$${analytics.dailyCost.toFixed(2)}`;
        document.getElementById('efficiency-score').textContent = `${analytics.efficiency}%`;
        
        // Update progress bars
        const usageProgress = document.querySelector('#power-usage + .stat-progress .progress-bar');
        if (usageProgress) {
            usageProgress.style.width = `${(analytics.avgUsage / 3) * 100}%`;
        }
        
        const efficiencyProgress = document.querySelector('.score-fill');
        if (efficiencyProgress) {
            efficiencyProgress.style.width = `${analytics.efficiency}%`;
        }
    }
    
    initEventListeners() {
        // Lighting controls
        document.getElementById('brightness-slider').addEventListener('input', (e) => {
            state.devices.lighting.brightness = parseInt(e.target.value);
            this.updateLighting();
            this.showToast('Brightness Adjusted', `Set to ${state.devices.lighting.brightness}%`, 'info');
        });
        
        document.getElementById('light-toggle').addEventListener('click', () => {
            state.devices.lighting.status = !state.devices.lighting.status;
            this.updateLighting();
            
            const action = state.devices.lighting.status ? 'ON' : 'OFF';
            this.showToast('Smart Lighting', `Turned ${action}`, 
                state.devices.lighting.status ? 'success' : 'info');
        });
        
        // Scene buttons
        document.querySelectorAll('[data-scene]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scene = e.currentTarget.dataset.scene;
                state.devices.lighting.scene = scene;
                
                // Adjust brightness based on scene
                switch(scene) {
                    case 'relax':
                        state.devices.lighting.brightness = 75;
                        break;
                    case 'focus':
                        state.devices.lighting.brightness = 90;
                        break;
                    case 'night':
                        state.devices.lighting.brightness = 25;
                        break;
                }
                
                this.updateLighting();
                this.showToast('Lighting Scene', `${scene.charAt(0).toUpperCase() + scene.slice(1)} mode activated`, 'success');
            });
        });
        
        // Climate controls
        document.getElementById('temp-down').addEventListener('click', () => {
            if (state.devices.climate.targetTemp > 60) {
                state.devices.climate.targetTemp--;
                this.updateClimate();
                this.showToast('Temperature', `Set to ${state.devices.climate.targetTemp}°F`, 'info');
            }
        });
        
        document.getElementById('temp-up').addEventListener('click', () => {
            if (state.devices.climate.targetTemp < 85) {
                state.devices.climate.targetTemp++;
                this.updateClimate();
                this.showToast('Temperature', `Set to ${state.devices.climate.targetTemp}°F`, 'info');
            }
        });
        
        // Temperature presets
        document.querySelectorAll('[data-temp]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const temp = parseInt(e.currentTarget.dataset.temp);
                state.devices.climate.targetTemp = temp;
                this.updateClimate();
                this.showToast('Temperature Preset', `Set to ${temp}°F`, 'success');
            });
        });
        
        // Security controls
        document.querySelector('.arm-home').addEventListener('click', () => {
            state.devices.security.armed = true;
            state.devices.security.mode = 'home';
            this.updateSecurity();
            this.showToast('Security System', 'Armed (Home Mode)', 'success');
        });
        
        document.querySelector('.arm-away').addEventListener('click', () => {
            state.devices.security.armed = true;
            state.devices.security.mode = 'away';
            this.updateSecurity();
            this.showToast('Security System', 'Armed (Away Mode)', 'success');
        });
        
        document.querySelector('.disarm').addEventListener('click', () => {
            state.devices.security.armed = false;
            state.devices.security.mode = 'disarmed';
            this.updateSecurity();
            this.showToast('Security System', 'Disarmed', 'info');
        });
        
        // Camera controls
        document.getElementById('record-btn').addEventListener('click', () => {
            const isRecording = Object.values(state.devices.cameras).some(c => c.recording);
            Object.values(state.devices.cameras).forEach(camera => {
                camera.recording = !isRecording;
            });
            
            this.updateCameras();
            
            const action = isRecording ? 'stopped' : 'started';
            this.showToast('Surveillance', `Recording ${action}`, 
                isRecording ? 'info' : 'warning');
        });
        
        document.getElementById('snapshot-btn').addEventListener('click', () => {
            this.showToast('Snapshot', 'Photo saved to gallery', 'success');
            this.addNotification('Snapshot captured', 'Camera 1 - Front Door', 'info');
        });
        
        document.getElementById('all-cameras').addEventListener('click', () => {
            const allActive = Object.values(state.devices.cameras).every(c => c.status === 'live');
            Object.entries(state.devices.cameras).forEach(([cameraId, camera]) => {
                camera.status = allActive ? 'idle' : 'live';
            });
            
            this.updateCameras();
            
            const action = allActive ? 'deactivated' : 'activated';
            this.showToast('All Cameras', `${action}`, 
                allActive ? 'info' : 'success');
        });
        
        // Smart device toggles
        document.querySelectorAll('.tile-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const tile = e.target.closest('.device-tile');
                const deviceId = tile.dataset.device;
                
                if (state.devices.smartDevices[deviceId]) {
                    state.devices.smartDevices[deviceId].status = 
                        !state.devices.smartDevices[deviceId].status;
                    this.updateSmartDevices();
                    
                    const device = state.devices.smartDevices[deviceId];
                    const action = device.status ? 'ON' : 'OFF';
                    this.showToast(device.name, `Turned ${action}`, 
                        device.status ? 'success' : 'info');
                }
            });
        });
        
        // Device tile clicks (for modals)
        document.querySelectorAll('.device-tile').forEach(tile => {
            tile.addEventListener('click', (e) => {
                if (!e.target.closest('.tile-toggle')) {
                    const deviceId = tile.dataset.device;
                    this.openDeviceModal(deviceId);
                }
            });
        });
        
        // Time filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                const period = e.currentTarget.textContent.toLowerCase();
                this.updateChartData(period);
                this.showToast('Time Filter', `Showing ${period}ly data`, 'info');
            });
        });
        
        // Clear notifications
        document.getElementById('clear-notifications').addEventListener('click', () => {
            document.getElementById('notifications-list').innerHTML = `
                <div class="notification-item">
                    <div class="notification-icon info">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">No notifications</div>
                        <div class="notification-time">Just now</div>
                    </div>
                </div>
            `;
            this.showToast('Notifications Cleared', 'All notifications removed', 'info');
        });
        
        // Interactive card hover effects
        document.querySelectorAll('.interactive').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
                card.style.boxShadow = '0 8px 32px rgba(0, 102, 255, 0.3)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });
        
        // Window resize
        window.addEventListener('resize', this.debounce(() => {
            if (this.bgAnimation) {
                this.bgAnimation.resize();
                this.bgAnimation.createParticles();
            }
        }, 250));
        
        // Time update
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }
    
    updateChartData(period) {
        if (!this.energyChart) return;
        
        let labels, data;
        
        switch(period) {
            case 'week':
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                data = labels.map(() => Math.random() * 3 + 1);
                break;
            case 'month':
                labels = Array.from({length: 30}, (_, i) => i + 1);
                data = labels.map(() => Math.random() * 4 + 0.5);
                break;
            default: // day
                labels = [];
                for (let i = 0; i < 24; i++) {
                    labels.push(`${i}:00`);
                }
                data = labels.map(() => Math.random() * 2 + 0.5);
        }
        
        this.energyChart.data.labels = labels;
        this.energyChart.data.datasets[0].data = data;
        this.energyChart.update();
    }
    
    startSimulations() {
        // Update energy usage every 5 seconds
        setInterval(() => {
            this.simulateEnergyUsage();
            this.updateAllDevices();
        }, 5000);
        
        // Simulate temperature changes
        setInterval(() => {
            this.simulateClimate();
        }, 10000);
        
        // Simulate random events
        setInterval(() => {
            this.simulateRandomEvents();
        }, 15000);
        
        // Update analytics
        setInterval(() => {
            this.updateAnalyticsData();
        }, 30000);
    }
    
    simulateEnergyUsage() {
        // Simulate random energy fluctuations
        const fluctuation = (Math.random() - 0.5) * 0.3;
        state.analytics.avgUsage = Math.max(0.5, state.analytics.avgUsage + fluctuation);
        
        // Update lighting energy
        state.devices.lighting.energy += state.devices.lighting.power * (state.devices.lighting.brightness / 100) / 720;
        
        // Update climate energy
        state.devices.climate.energy += state.devices.climate.power / 720;
        
        // Update peak usage
        state.analytics.peakUsage = Math.max(state.analytics.peakUsage, state.analytics.avgUsage + 0.5);
        
        // Update cost
        state.analytics.dailyCost = (state.analytics.avgUsage * 24 * 0.12).toFixed(2);
        
        // Update saved energy (random increase)
        state.analytics.energySaved += Math.random() * 0.1;
    }
    
    simulateClimate() {
        // Simulate temperature drift
        const drift = (Math.random() - 0.5) * 0.5;
        state.devices.climate.currentTemp = 
            Math.max(60, Math.min(85, state.devices.climate.currentTemp + drift));
        
        // Simulate humidity changes
        const humidityChange = (Math.random() - 0.5) * 2;
        state.devices.climate.humidity = 
            Math.max(30, Math.min(60, state.devices.climate.humidity + humidityChange));
        
        // Update climate mode based on temperature difference
        const diff = state.devices.climate.targetTemp - state.devices.climate.currentTemp;
        if (Math.abs(diff) > 2) {
            state.devices.climate.mode = diff > 0 ? 'heating' : 'cooling';
        } else {
            state.devices.climate.mode = 'idle';
        }
    }
    
    simulateRandomEvents() {
        // Random device status changes
        if (Math.random() < 0.2) {
            const devices = Object.keys(state.devices.smartDevices);
            const randomDevice = devices[Math.floor(Math.random() * devices.length)];
            
            if (state.devices.smartDevices[randomDevice]) {
                state.devices.smartDevices[randomDevice].status = 
                    !state.devices.smartDevices[randomDevice].status;
                
                this.updateSmartDevices();
                
                const device = state.devices.smartDevices[randomDevice];
                const action = device.status ? 'activated' : 'deactivated';
                this.addNotification(`Device ${action}`, device.name, 
                    device.status ? 'success' : 'info');
            }
        }
        
        // Random security alerts (5% chance)
        if (state.devices.security.armed && Math.random() < 0.05) {
            const zones = Object.keys(state.devices.security.zones);
            const randomZone = zones[Math.floor(Math.random() * zones.length)];
            
            if (!state.devices.security.zones[randomZone]) {
                state.devices.security.zones[randomZone] = true;
                this.updateSecurity();
                
                this.showToast(
                    'Security Alert',
                    `Motion detected: ${randomZone.replace('-', ' ').toUpperCase()}`,
                    'warning'
                );
                
                this.addNotification(
                    'Motion detected',
                    `${randomZone.replace('-', ' ')}`,
                    'alert'
                );
                
                // Auto-clear after 30 seconds
                setTimeout(() => {
                    state.devices.security.zones[randomZone] = false;
                    this.updateSecurity();
                }, 30000);
            }
        }
        
        // Random efficiency changes
        state.analytics.efficiency = Math.max(70, Math.min(95, 
            state.analytics.efficiency + (Math.random() - 0.5) * 2));
    }
    
    updateAnalyticsData() {
        // Update connected devices count
        let connectedCount = 0;
        if (state.devices.lighting.status) connectedCount++;
        if (state.devices.climate.status) connectedCount++;
        if (state.devices.security.armed) connectedCount++;
        connectedCount += Object.values(state.devices.smartDevices).filter(d => d.status).length;
        
        state.analytics.connectedDevices = connectedCount;
        
        // Update efficiency based on usage
        const usageEfficiency = Math.max(70, 100 - (state.analytics.avgUsage * 10));
        state.analytics.efficiency = Math.round(
            (state.analytics.efficiency * 0.7) + (usageEfficiency * 0.3)
        );
    }
    
    openDeviceModal(deviceId) {
        const device = state.devices.smartDevices[deviceId];
        if (!device) return;
        
        const modal = document.getElementById('modal-overlay');
        const title = document.getElementById('modal-title');
        const body = document.getElementById('modal-body');
        
        title.textContent = device.name;
        
        // Create modal content based on device type
        let content = '';
        
        switch(deviceId) {
            case 'plug1':
                content = `
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        <div class="device-icon plug" style="align-self: center;">
                            <i class="fas fa-plug"></i>
                        </div>
                        <div style="text-align: center;">
                            <h4 style="margin-bottom: 10px; color: var(--text-primary);">Smart Plug</h4>
                            <p style="color: var(--text-secondary);">Living Room Lamp</p>
                        </div>
                        <div style="background: var(--bg-glass-light); padding: 20px; border-radius: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color: var(--text-secondary);">Status</span>
                                <span style="color: ${device.status ? '#00D4AA' : '#FF4757'}; font-weight: 600;">
                                    ${device.status ? 'ON' : 'OFF'}
                                </span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color: var(--text-secondary);">Power Consumption</span>
                                <span style="color: var(--text-primary); font-weight: 600;">
                                    ${device.power}W
                                </span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--text-secondary);">Energy Today</span>
                                <span style="color: var(--text-primary); font-weight: 600;">
                                    ${(device.power * 24 / 1000).toFixed(2)} kWh
                                </span>
                            </div>
                        </div>
                        <button class="btn-camera" style="width: 100%;" onclick="dashboard.toggleDevice('${deviceId}')">
                            <i class="fas fa-power-off"></i>
                            <span>Turn ${device.status ? 'OFF' : 'ON'}</span>
                        </button>
                    </div>
                `;
                break;
                
            default:
                content = `
                    <div style="text-align: center; padding: 40px 20px;">
                        <i class="fas fa-info-circle" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 20px;"></i>
                        <p style="color: var(--text-secondary);">Detailed information for ${device.name}</p>
                    </div>
                `;
        }
        
        body.innerHTML = content;
        modal.classList.add('active');
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
        
        // Close button
        document.getElementById('modal-close').addEventListener('click', () => {
            modal.classList.remove('active');
        }, { once: true });
    }
    
    toggleDevice(deviceId) {
        if (state.devices.smartDevices[deviceId]) {
            state.devices.smartDevices[deviceId].status = 
                !state.devices.smartDevices[deviceId].status;
            this.updateSmartDevices();
            
            const device = state.devices.smartDevices[deviceId];
            this.showToast(device.name, `Turned ${device.status ? 'ON' : 'OFF'}`, 
                device.status ? 'success' : 'info');
            
            // Close modal
            document.getElementById('modal-overlay').classList.remove('active');
        }
    }
    
    showToast(title, message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check-circle' :
                     type === 'warning' ? 'exclamation-triangle' :
                     type === 'error' ? 'times-circle' : 'info-circle';
        
        toast.innerHTML = `
            <div style="font-size: 1.2rem; color: ${type === 'info' ? '#4361EE' : 
                type === 'success' ? '#00D4AA' : 
                type === 'warning' ? '#FFB800' : '#FF4757'};">
                <i class="fas fa-${icon}"></i>
            </div>
            <div>
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                    ${title}
                </div>
                <div style="font-size: 0.9rem; color: var(--text-secondary);">
                    ${message}
                </div>
            </div>
        `;
        
        container.appendChild(toast);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'toastFadeOut 0.3s ease forwards';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    addNotification(title, message, type = 'info') {
        const list = document.getElementById('notifications-list');
        const notification = document.createElement('div');
        notification.className = 'notification-item';
        
        const iconClass = type === 'info' ? 'info' :
                         type === 'success' ? 'success' :
                         type === 'warning' ? 'warning' : 'alert';
        
        const icon = type === 'info' ? 'info-circle' :
                    type === 'success' ? 'check-circle' :
                    type === 'warning' ? 'exclamation-triangle' : 'shield-alt';
        
        notification.innerHTML = `
            <div class="notification-icon ${iconClass}">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-time">Just now</div>
            </div>
        `;
        
        list.insertBefore(notification, list.firstChild);
        
        // Limit to 5 notifications
        while (list.children.length > 5) {
            list.removeChild(list.lastChild);
        }
        
        // Update notification count
        const countEl = document.querySelector('.notification-count');
        if (countEl) {
            const count = parseInt(countEl.textContent) + 1;
            countEl.textContent = Math.min(count, 9);
            if (count > 9) countEl.textContent = '9+';
        }
    }
    
    updateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        const dateStr = now.toLocaleDateString([], {weekday: 'short', month: 'short', day: 'numeric'});
        
        document.getElementById('current-time').textContent = `${dateStr} • ${timeStr}`;
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize dashboard when DOM is loaded
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new SmartHomeDashboard();
});

// Make dashboard available globally for modal interactions
window.dashboard = dashboard;
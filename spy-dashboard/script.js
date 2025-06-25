// SPY DASHBOARD - CLASSIFIED SURVEILLANCE SYSTEM
// Operation: MAC MINI Monitoring

// System State Variables
let systemData = {
    cpu: { usage: 0, cores: 8, temp: 45, freq: 3.2 },
    memory: { used: 12.8, cached: 3.2, free: 3.0, total: 16 },
    network: { download: 0, upload: 0, connections: [] },
    disk: { used: 680, total: 1000, percentage: 68 },
    users: [],
    processes: [],
    logs: [],
    uptime: 0
};

// Surveillance Network Chart
let networkChart = null;
let networkData = [];

// Mission Time Display
function updateMissionTime() {
    const now = new Date();
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC'
    };
    
    const timeString = now.toLocaleDateString('en-US', options);
    document.getElementById('missionTime').textContent = `${timeString} UTC`;
    
    // Update uptime
    systemData.uptime += 1;
    const hours = Math.floor(systemData.uptime / 3600);
    const minutes = Math.floor((systemData.uptime % 3600) / 60);
    const seconds = systemData.uptime % 60;
    document.getElementById('systemUptime').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// CPU Surveillance System
function updateCPUMonitoring() {
    // Simulate realistic CPU usage fluctuations
    const baseUsage = 15 + Math.sin(Date.now() / 10000) * 10;
    const randomSpike = Math.random() * 30;
    systemData.cpu.usage = Math.max(0, Math.min(100, baseUsage + randomSpike));
    
    // Update temperature based on CPU usage
    systemData.cpu.temp = 35 + (systemData.cpu.usage * 0.3) + (Math.random() * 5);
    
    // Update frequency based on load
    systemData.cpu.freq = 2.8 + (systemData.cpu.usage / 100) * 0.8;
    
    // Update gauge
    const cpuValue = Math.round(systemData.cpu.usage);
    document.getElementById('cpuValue').textContent = cpuValue;
    
    // Update gauge fill (CSS custom property)
    const gauge = document.getElementById('cpuGauge');
    gauge.style.setProperty('--cpu-percentage', `${cpuValue}%`);
    
    // Update threat level
    const threatLevel = document.getElementById('cpuThreat');
    if (cpuValue > 80) {
        threatLevel.textContent = 'CRITICAL';
        threatLevel.style.background = 'rgba(255, 0, 64, 0.3)';
        threatLevel.style.color = '#ff0040';
    } else if (cpuValue > 60) {
        threatLevel.textContent = 'ELEVATED';
        threatLevel.style.background = 'rgba(255, 235, 59, 0.3)';
        threatLevel.style.color = '#ffeb3b';
    } else {
        threatLevel.textContent = 'NORMAL';
        threatLevel.style.background = 'rgba(0, 255, 65, 0.2)';
        threatLevel.style.color = '#00ff41';
    }
    
    // Update details
    document.getElementById('cpuCores').textContent = systemData.cpu.cores;
    document.getElementById('cpuTemp').textContent = `${Math.round(systemData.cpu.temp)}°C`;
    document.getElementById('cpuFreq').textContent = `${systemData.cpu.freq.toFixed(1)} GHz`;
}

// Memory Analysis System
function updateMemoryAnalysis() {
    // Simulate memory usage fluctuations
    const totalMemory = systemData.memory.total;
    const usageVariation = Math.sin(Date.now() / 15000) * 2;
    
    systemData.memory.used = Math.max(8, Math.min(14, 12.8 + usageVariation));
    systemData.memory.cached = Math.max(2, Math.min(4, 3.2 + Math.random() * 0.5));
    systemData.memory.free = totalMemory - systemData.memory.used - systemData.memory.cached;
    
    // Update memory bars
    const usedPercent = (systemData.memory.used / totalMemory) * 100;
    const cachedPercent = (systemData.memory.cached / totalMemory) * 100;
    const freePercent = (systemData.memory.free / totalMemory) * 100;
    
    document.getElementById('memoryUsed').style.width = `${usedPercent}%`;
    document.getElementById('memoryCached').style.width = `${cachedPercent}%`;
    document.getElementById('memoryFree').style.width = `${freePercent}%`;
    
    document.getElementById('memoryUsedText').textContent = `${systemData.memory.used.toFixed(1)} GB`;
    document.getElementById('memoryCachedText').textContent = `${systemData.memory.cached.toFixed(1)} GB`;
    document.getElementById('memoryFreeText').textContent = `${systemData.memory.free.toFixed(1)} GB`;
    
    // Update alert status
    const memoryAlert = document.getElementById('memoryAlert');
    if (usedPercent > 85) {
        memoryAlert.textContent = 'CRITICAL';
        memoryAlert.style.background = 'rgba(255, 0, 64, 0.3)';
        memoryAlert.style.color = '#ff0040';
    } else if (usedPercent > 70) {
        memoryAlert.textContent = 'WARNING';
        memoryAlert.style.background = 'rgba(255, 235, 59, 0.3)';
        memoryAlert.style.color = '#ffeb3b';
    } else {
        memoryAlert.textContent = 'SECURE';
        memoryAlert.style.background = 'rgba(0, 255, 65, 0.2)';
        memoryAlert.style.color = '#00ff41';
    }
}

// Network Intercept System
function updateNetworkIntercept() {
    // Simulate network traffic
    const time = Date.now() / 1000;
    systemData.network.download = Math.max(0, 0.5 + Math.sin(time / 10) * 0.8 + Math.random() * 0.4);
    systemData.network.upload = Math.max(0, 0.3 + Math.cos(time / 15) * 0.5 + Math.random() * 0.3);
    
    document.getElementById('downloadSpeed').textContent = `${systemData.network.download.toFixed(1)} MB/s`;
    document.getElementById('uploadSpeed').textContent = `${systemData.network.upload.toFixed(1)} MB/s`;
    
    // Update network chart
    updateNetworkChart();
    
    // Update connection count
    document.getElementById('connectionCount').textContent = Math.floor(20 + Math.random() * 10);
}

// Network Chart Visualization
function initializeNetworkChart() {
    const canvas = document.getElementById('networkChart');
    const ctx = canvas.getContext('2d');
    
    // Initialize data array
    networkData = new Array(50).fill(0);
    
    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 5; i++) {
            const y = (canvas.height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Draw network data
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        networkData.forEach((value, index) => {
            const x = (index / (networkData.length - 1)) * canvas.width;
            const y = canvas.height - (value * canvas.height);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
    
    networkChart = { draw: drawChart };
}

function updateNetworkChart() {
    if (!networkChart) return;
    
    // Add new data point
    const combinedTraffic = (systemData.network.download + systemData.network.upload) / 3;
    networkData.shift();
    networkData.push(Math.min(1, combinedTraffic));
    
    networkChart.draw();
}

// Active Connections Surveillance
function updateActiveConnections() {
    const connectionsList = document.getElementById('connectionsList');
    
    // Simulate dynamic connections
    const connections = [
        { ip: '192.168.1.1', type: 'ROUTER - SECURE', port: ':80', status: 'secure' },
        { ip: '173.194.115.34', type: 'GOOGLE DNS - MONITORED', port: ':443', status: 'warning' },
        { ip: '151.101.1.140', type: 'CDN - VERIFIED', port: ':443', status: 'secure' },
        { ip: '140.82.114.4', type: 'GITHUB - ACTIVE', port: ':443', status: 'secure' },
        { ip: '185.199.108.153', type: 'GITHUB PAGES - TRACKED', port: ':443', status: 'secure' }
    ];
    
    // Randomly show some connections
    const visibleConnections = connections.slice(0, 3 + Math.floor(Math.random() * 3));
    
    connectionsList.innerHTML = visibleConnections.map(conn => `
        <div class="connection-item">
            <div class="connection-status ${conn.status}"></div>
            <div class="connection-details">
                <div class="connection-ip">${conn.ip}</div>
                <div class="connection-type">${conn.type}</div>
            </div>
            <div class="connection-port">${conn.port}</div>
        </div>
    `).join('');
}

// Personnel Tracking System
function updatePersonnelTracking() {
    const usersList = document.getElementById('usersList');
    const sessionTime = new Date(Date.now() - Math.random() * 10000000).toLocaleTimeString();
    
    const users = [
        {
            name: 'AGENT FABRE',
            session: `CONSOLE - ${sessionTime}`,
            location: 'TERMINAL.LOCAL',
            status: 'ACTIVE'
        }
    ];
    
    // Add random additional users occasionally
    if (Math.random() < 0.1) {
        users.push({
            name: 'ADMIN_USER',
            session: `SSH - ${sessionTime}`,
            location: '192.168.1.105',
            status: 'ACTIVE'
        });
    }
    
    document.getElementById('userCount').textContent = users.length;
    
    usersList.innerHTML = users.map(user => `
        <div class="user-item">
            <div class="user-avatar">
                <i class="fas fa-user-secret"></i>
            </div>
            <div class="user-details">
                <div class="user-name">${user.name}</div>
                <div class="user-session">${user.session}</div>
                <div class="user-location">${user.location}</div>
            </div>
            <div class="user-status active">${user.status}</div>
        </div>
    `).join('');
}

// Process Surveillance System
function updateProcessSurveillance() {
    const processes = [
        { name: 'Chrome.exe', cpu: (12 + Math.random() * 8).toFixed(1), memory: '1.2GB', status: 'ACTIVE' },
        { name: 'Node.js', cpu: (8 + Math.random() * 4).toFixed(1), memory: '512MB', status: 'ACTIVE' },
        { name: 'Terminal', cpu: (2 + Math.random() * 2).toFixed(1), memory: '128MB', status: 'ACTIVE' },
        { name: 'Safari', cpu: (5 + Math.random() * 3).toFixed(1), memory: '856MB', status: 'ACTIVE' },
        { name: 'Finder', cpu: (1 + Math.random()).toFixed(1), memory: '64MB', status: 'ACTIVE' }
    ];
    
    document.getElementById('processCount').textContent = 142 + Math.floor(Math.random() * 20);
    
    const processesList = document.getElementById('processesList');
    processesList.innerHTML = processes.map(proc => `
        <div class="process-item">
            <span class="process-name">${proc.name}</span>
            <span class="process-cpu">${proc.cpu}%</span>
            <span class="process-memory">${proc.memory}</span>
            <span class="process-status running">${proc.status}</span>
        </div>
    `).join('');
}

// Surveillance Logs System
function updateSurveillanceLogs() {
    const logTerminal = document.getElementById('logTerminal');
    const logTypes = [
        { type: 'INFO', class: 'info', messages: [
            'System surveillance cycle completed',
            'Network scan initiated',
            'Process monitoring active',
            'Memory analysis in progress',
            'Disk space analysis completed'
        ]},
        { type: 'AUTH', class: 'success', messages: [
            'Agent authentication successful',
            'Security clearance verified',
            'Access permissions validated'
        ]},
        { type: 'WARN', class: 'warning', messages: [
            'High CPU usage detected',
            'Memory usage approaching threshold',
            'Unusual network activity observed',
            'Process spawning detected'
        ]},
        { type: 'NET', class: 'info', messages: [
            'New connection established',
            'Connection terminated',
            'Traffic analysis completed',
            'Port scan detected'
        ]}
    ];
    
    // Add new log entry occasionally
    if (Math.random() < 0.3) {
        const randomType = logTypes[Math.floor(Math.random() * logTypes.length)];
        const randomMessage = randomType.messages[Math.floor(Math.random() * randomType.messages.length)];
        const timestamp = new Date().toLocaleTimeString();
        
        const newLogEntry = document.createElement('div');
        newLogEntry.className = `log-entry ${randomType.class}`;
        newLogEntry.innerHTML = `
            <span class="log-time">[${timestamp}]</span>
            <span class="log-type">[${randomType.type}]</span>
            <span class="log-message">${randomMessage}</span>
        `;
        
        logTerminal.appendChild(newLogEntry);
        
        // Keep only last 20 entries
        while (logTerminal.children.length > 20) {
            logTerminal.removeChild(logTerminal.firstChild);
        }
        
        // Auto scroll to bottom
        logTerminal.scrollTop = logTerminal.scrollHeight;
    }
}

// Storage Analysis System
function updateStorageAnalysis() {
    // Simulate slow disk usage change
    const variation = Math.sin(Date.now() / 30000) * 2;
    systemData.disk.used = Math.max(650, Math.min(750, 680 + variation));
    systemData.disk.percentage = Math.round((systemData.disk.used / systemData.disk.total) * 100);
    
    document.getElementById('diskPercentage').textContent = `${systemData.disk.percentage}%`;
    document.getElementById('diskUsed').textContent = `${Math.round(systemData.disk.used)}GB`;
    document.getElementById('diskFree').textContent = `${Math.round(systemData.disk.total - systemData.disk.used)}GB`;
    
    // Update circular progress
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference - (systemData.disk.percentage / 100) * circumference;
    document.getElementById('diskProgress').style.strokeDashoffset = offset;
    
    // Update status
    const diskStatus = document.getElementById('diskStatus');
    if (systemData.disk.percentage > 90) {
        diskStatus.textContent = 'CRITICAL';
        diskStatus.style.color = '#ff0040';
    } else if (systemData.disk.percentage > 75) {
        diskStatus.textContent = 'WARNING';
        diskStatus.style.color = '#ffeb3b';
    } else {
        diskStatus.textContent = 'OPTIMAL';
        diskStatus.style.color = '#00ff41';
    }
}

// Alert System
function showAlert(message, type = 'critical') {
    const alertSystem = document.getElementById('alertSystem');
    
    const alert = document.createElement('div');
    alert.className = `alert-item ${type}`;
    alert.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
        <button class="alert-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    alertSystem.appendChild(alert);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 10000);
}

// Random Alert Generator
function generateRandomAlerts() {
    const alerts = [
        'SECURITY: Unauthorized access attempt detected',
        'SYSTEM: High resource usage detected',
        'NETWORK: Suspicious traffic pattern observed',
        'PROCESS: Unknown application launched',
        'MEMORY: Critical memory usage threshold reached'
    ];
    
    if (Math.random() < 0.05) { // 5% chance every update
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        showAlert(randomAlert);
    }
}

// Keyboard Shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'r':
                    e.preventDefault();
                    location.reload();
                    break;
                case 'f':
                    e.preventDefault();
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        document.documentElement.requestFullscreen();
                    }
                    break;
            }
        }
    });
}

// Initialize Dashboard
function initializeDashboard() {
    console.log('🕵️ CLASSIFIED: Spy Dashboard Initializing...');
    
    // Initialize all systems
    initializeNetworkChart();
    initializeKeyboardShortcuts();
    
    // Update mission time every second
    updateMissionTime();
    setInterval(updateMissionTime, 1000);
    
    // Update surveillance systems every 2 seconds
    setInterval(() => {
        updateCPUMonitoring();
        updateMemoryAnalysis();
        updateNetworkIntercept();
        updateActiveConnections();
        updatePersonnelTracking();
        updateProcessSurveillance();
        updateSurveillanceLogs();
        updateStorageAnalysis();
        generateRandomAlerts();
    }, 2000);
    
    // Initial update
    updateCPUMonitoring();
    updateMemoryAnalysis();
    updateNetworkIntercept();
    updateActiveConnections();
    updatePersonnelTracking();
    updateProcessSurveillance();
    updateStorageAnalysis();
    
    console.log('🛡️ CLASSIFIED: Surveillance Systems Online');
}

// Start surveillance when page loads
document.addEventListener('DOMContentLoaded', initializeDashboard);

// Prevent right-click context menu for spy aesthetic
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Add some spy-like console messages
console.log('🔒 CLASSIFIED SYSTEM ACCESS');
console.log('🕵️ SURVEILLANCE MODE: ACTIVE');
console.log('📡 MONITORING STATION: OPERATIONAL');
console.log('⚠️  UNAUTHORIZED ACCESS PROHIBITED');

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        systemData,
        updateCPUMonitoring,
        updateMemoryAnalysis,
        updateNetworkIntercept
    };
}

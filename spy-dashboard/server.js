#!/usr/bin/env node

// SPY DASHBOARD SERVER - CLASSIFIED SYSTEM MONITORING
// Real-time data collection from macOS system

const express = require('express');
const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));

// CORS for local development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// System data cache
let systemData = {
    cpu: { usage: 0, cores: os.cpus().length, temp: 0, freq: 0 },
    memory: { used: 0, cached: 0, free: 0, total: 0 },
    network: { download: 0, upload: 0, connections: [] },
    disk: { used: 0, total: 0, percentage: 0 },
    users: [],
    processes: [],
    uptime: 0
};

// Utility function to execute shell commands
function execCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

// Get CPU usage and information
async function getCPUData() {
    try {
        // Get CPU usage using top command
        const topOutput = await execCommand("top -l 1 | grep 'CPU usage'");
        const cpuMatch = topOutput.match(/(\d+\.\d+)% user.*?(\d+\.\d+)% sys/);
        
        if (cpuMatch) {
            const userCpu = parseFloat(cpuMatch[1]);
            const sysCpu = parseFloat(cpuMatch[2]);
            systemData.cpu.usage = userCpu + sysCpu;
        }

        // Get CPU frequency (approximate)
        const freqOutput = await execCommand("sysctl -n hw.cpufrequency_max 2>/dev/null || echo '3200000000'");
        systemData.cpu.freq = parseInt(freqOutput) / 1000000000; // Convert to GHz

        // Get CPU temperature (if available)
        try {
            const tempOutput = await execCommand("sudo powermetrics --samplers smc -n 1 2>/dev/null | grep 'CPU die temperature' | head -1");
            const tempMatch = tempOutput.match(/(\d+\.\d+)/);
            if (tempMatch) {
                systemData.cpu.temp = parseFloat(tempMatch[1]);
            } else {
                // Estimate temperature based on CPU usage
                systemData.cpu.temp = 35 + (systemData.cpu.usage * 0.5);
            }
        } catch (e) {
            // Fallback temperature estimation
            systemData.cpu.temp = 35 + (systemData.cpu.usage * 0.5);
        }

        console.log(`📊 CPU: ${systemData.cpu.usage.toFixed(1)}% | Temp: ${systemData.cpu.temp.toFixed(1)}°C`);
    } catch (error) {
        console.error('Error getting CPU data:', error.message);
    }
}

// Get memory information
async function getMemoryData() {
    try {
        // Get memory info using vm_stat
        const vmStatOutput = await execCommand("vm_stat");
        const pageSize = 4096; // macOS page size in bytes
        
        // Parse vm_stat output
        const freeMatch = vmStatOutput.match(/Pages free:\s+(\d+)/);
        const activeMatch = vmStatOutput.match(/Pages active:\s+(\d+)/);
        const inactiveMatch = vmStatOutput.match(/Pages inactive:\s+(\d+)/);
        const wiredMatch = vmStatOutput.match(/Pages wired down:\s+(\d+)/);
        const cachedMatch = vmStatOutput.match(/File-backed pages:\s+(\d+)/);

        if (freeMatch && activeMatch && inactiveMatch && wiredMatch) {
            const freePages = parseInt(freeMatch[1]);
            const activePages = parseInt(activeMatch[1]);
            const inactivePages = parseInt(inactiveMatch[1]);
            const wiredPages = parseInt(wiredMatch[1]);
            const cachedPages = cachedMatch ? parseInt(cachedMatch[1]) : 0;

            const totalMemory = os.totalmem();
            const freeMemory = freePages * pageSize;
            const usedMemory = (activePages + wiredPages) * pageSize;
            const cachedMemory = cachedPages * pageSize;

            systemData.memory.total = totalMemory / (1024 * 1024 * 1024); // GB
            systemData.memory.free = freeMemory / (1024 * 1024 * 1024); // GB
            systemData.memory.used = usedMemory / (1024 * 1024 * 1024); // GB
            systemData.memory.cached = cachedMemory / (1024 * 1024 * 1024); // GB
        }

        console.log(`🧠 Memory: ${systemData.memory.used.toFixed(1)}GB used / ${systemData.memory.total.toFixed(1)}GB total`);
    } catch (error) {
        console.error('Error getting memory data:', error.message);
    }
}

// Get network information
async function getNetworkData() {
    try {
        // Get network interface statistics
        const netstatOutput = await execCommand("netstat -ib | grep -E 'en0|en1' | head -1");
        
        if (netstatOutput) {
            const parts = netstatOutput.split(/\s+/);
            if (parts.length >= 7) {
                // This is a simplified approach - for real-time rates, we'd need to track changes over time
                const bytesIn = parseInt(parts[6]) || 0;
                const bytesOut = parseInt(parts[9]) || 0;
                
                // Store previous values to calculate rate (simplified)
                if (!getNetworkData.lastBytesIn) {
                    getNetworkData.lastBytesIn = bytesIn;
                    getNetworkData.lastBytesOut = bytesOut;
                    getNetworkData.lastTime = Date.now();
                }
                
                const timeDiff = (Date.now() - getNetworkData.lastTime) / 1000;
                if (timeDiff > 0) {
                    systemData.network.download = Math.max(0, (bytesIn - getNetworkData.lastBytesIn) / timeDiff / 1024 / 1024);
                    systemData.network.upload = Math.max(0, (bytesOut - getNetworkData.lastBytesOut) / timeDiff / 1024 / 1024);
                }
                
                getNetworkData.lastBytesIn = bytesIn;
                getNetworkData.lastBytesOut = bytesOut;
                getNetworkData.lastTime = Date.now();
            }
        }

        // Get active connections
        const connectionsOutput = await execCommand("netstat -an | grep ESTABLISHED | head -10");
        const connections = connectionsOutput.split('\n').filter(line => line.trim()).map(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 4) {
                const localAddr = parts[3];
                const remoteAddr = parts[4];
                return {
                    local: localAddr,
                    remote: remoteAddr,
                    status: 'ESTABLISHED'
                };
            }
        }).filter(Boolean);

        systemData.network.connections = connections;

        console.log(`📡 Network: ↓${systemData.network.download.toFixed(2)}MB/s ↑${systemData.network.upload.toFixed(2)}MB/s | ${connections.length} connections`);
    } catch (error) {
        console.error('Error getting network data:', error.message);
    }
}

// Get disk usage
async function getDiskData() {
    try {
        const diskOutput = await execCommand("df -h / | tail -1");
        const parts = diskOutput.split(/\s+/);
        
        if (parts.length >= 5) {
            const total = parts[1];
            const used = parts[2];
            const available = parts[3];
            const percentage = parseInt(parts[4].replace('%', ''));

            systemData.disk.total = parseFloat(total.replace(/[A-Za-z]/g, ''));
            systemData.disk.used = parseFloat(used.replace(/[A-Za-z]/g, ''));
            systemData.disk.percentage = percentage;
        }

        console.log(`💾 Disk: ${systemData.disk.percentage}% used`);
    } catch (error) {
        console.error('Error getting disk data:', error.message);
    }
}

// Get logged in users
async function getUsersData() {
    try {
        const whoOutput = await execCommand("who");
        const users = whoOutput.split('\n').filter(line => line.trim()).map(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 3) {
                return {
                    name: parts[0].toUpperCase(),
                    terminal: parts[1],
                    time: parts.slice(2).join(' '),
                    location: parts[parts.length - 1].includes('(') ? parts[parts.length - 1] : 'LOCAL'
                };
            }
        }).filter(Boolean);

        systemData.users = users;

        console.log(`👥 Users: ${users.length} logged in`);
    } catch (error) {
        console.error('Error getting users data:', error.message);
    }
}

// Get top processes
async function getProcessesData() {
    try {
        const psOutput = await execCommand("ps aux | head -11 | tail -10");
        const processes = psOutput.split('\n').filter(line => line.trim()).map(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 11) {
                return {
                    name: parts[10].split('/').pop(),
                    cpu: parseFloat(parts[2]),
                    memory: parseFloat(parts[3]),
                    pid: parts[1]
                };
            }
        }).filter(Boolean);

        systemData.processes = processes;

        console.log(`⚙️ Processes: Top ${processes.length} processes monitored`);
    } catch (error) {
        console.error('Error getting processes data:', error.message);
    }
}

// Get system uptime
async function getUptimeData() {
    try {
        const uptimeOutput = await execCommand("uptime");
        const uptimeMatch = uptimeOutput.match(/up\s+(?:(\d+)\s+days?,\s*)?(?:(\d+):(\d+),|\s*(\d+)\s+hrs?,|\s*(\d+)\s+mins?)/);
        
        if (uptimeMatch) {
            let totalSeconds = 0;
            const days = parseInt(uptimeMatch[1]) || 0;
            const hours = parseInt(uptimeMatch[2]) || parseInt(uptimeMatch[4]) || 0;
            const minutes = parseInt(uptimeMatch[3]) || parseInt(uptimeMatch[5]) || 0;
            
            totalSeconds = (days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60);
            systemData.uptime = totalSeconds;
        }
    } catch (error) {
        console.error('Error getting uptime data:', error.message);
    }
}

// Update all system data
async function updateSystemData() {
    console.log('\n🕵️ CLASSIFIED: Collecting surveillance data...');
    
    try {
        await Promise.all([
            getCPUData(),
            getMemoryData(),
            getNetworkData(),
            getDiskData(),
            getUsersData(),
            getProcessesData(),
            getUptimeData()
        ]);
        
        console.log('✅ CLASSIFIED: Data collection complete\n');
    } catch (error) {
        console.error('❌ Error updating system data:', error);
    }
}

// API Routes
app.get('/api/system', (req, res) => {
    res.json(systemData);
});

app.get('/api/cpu', (req, res) => {
    res.json(systemData.cpu);
});

app.get('/api/memory', (req, res) => {
    res.json(systemData.memory);
});

app.get('/api/network', (req, res) => {
    res.json(systemData.network);
});

app.get('/api/disk', (req, res) => {
    res.json(systemData.disk);
});

app.get('/api/users', (req, res) => {
    res.json(systemData.users);
});

app.get('/api/processes', (req, res) => {
    res.json(systemData.processes);
});

app.get('/api/uptime', (req, res) => {
    res.json({ uptime: systemData.uptime });
});

// Start server
app.listen(PORT, () => {
    console.log('🛡️ CLASSIFIED SURVEILLANCE SERVER OPERATIONAL');
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log('🔒 CLEARANCE LEVEL: SIGMA');
    console.log('⚠️  UNAUTHORIZED ACCESS PROHIBITED\n');
    
    // Initial data collection
    updateSystemData();
    
    // Update system data every 3 seconds
    setInterval(updateSystemData, 3000);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔒 CLASSIFIED: Shutting down surveillance server...');
    process.exit(0);
});

module.exports = app;

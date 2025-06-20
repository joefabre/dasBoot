// Initialize the data manager and app when the page loads
let dataManager;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the portable data manager
    dataManager = new FastingDataManager();
    
    // Try to migrate legacy data
    dataManager.migrateLegacyData();
    
    initializeApp();
});

function initializeApp() {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('todayDate').value = today;
    
    // Load existing data and update display
    loadData();
    updateStats();
    displayHistory();
    displayWeightChart();
    displayMilesChart();
    displayWorkoutChart();
}

// Get data using the portable data manager
function getData() {
    return dataManager.getEntries();
}

// Save data using the portable data manager
function saveData(data) {
    dataManager.saveEntries(data);
}

// Save a new entry
function saveEntry() {
    const date = document.getElementById('todayDate').value;
    const fastingYes = document.getElementById('fastingYes').checked;
    const fastingNo = document.getElementById('fastingNo').checked;
    const weight = document.getElementById('weight').value;
    const weightUnit = document.getElementById('weightUnit').value;
    const miles = document.getElementById('miles').value;
    const workoutYes = document.getElementById('workoutYes').checked;
    const workoutNo = document.getElementById('workoutNo').checked;
    const workoutSkip = document.getElementById('workoutSkip').checked;
    
    // Validation
    if (!date) {
        alert('Please select a date.');
        return;
    }
    
    if (!fastingYes && !fastingNo) {
        alert('Please indicate whether you completed your fast or not.');
        return;
    }
    
    // Determine workout status
    let workoutStatus = null;
    if (workoutYes) workoutStatus = 'yes';
    else if (workoutNo) workoutStatus = 'no';
    else if (workoutSkip) workoutStatus = 'skip';
    
    // Create entry object
    const entry = {
        date: date,
        fasted: fastingYes,
        weight: weight ? parseFloat(weight) : null,
        weightUnit: weightUnit,
        miles: miles ? parseFloat(miles) : null,
        workout: workoutStatus,
        timestamp: new Date().toISOString()
    };
    
    // Get existing data
    let data = getData();
    
    // Check if entry for this date already exists
    const existingIndex = data.findIndex(item => item.date === date);
    
    if (existingIndex >= 0) {
        // Update existing entry
        if (confirm('An entry for this date already exists. Do you want to update it?')) {
            data[existingIndex] = entry;
        } else {
            return;
        }
    } else {
        // Add new entry
        data.push(entry);
    }
    
    // Sort data by date (newest first)
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Save data
    saveData(data);
    
    // Update display
    updateStats();
    displayHistory();
    displayWeightChart();
    displayMilesChart();
    displayWorkoutChart();
    
    // Clear form
    clearForm();
    
    // Show success message
    showMessage('Entry saved successfully!', 'success');
}

// Clear the form
function clearForm() {
    document.getElementById('fastingYes').checked = false;
    document.getElementById('fastingNo').checked = false;
    document.getElementById('weight').value = '';
    document.getElementById('miles').value = '';
    document.getElementById('workoutYes').checked = false;
    document.getElementById('workoutNo').checked = false;
    document.getElementById('workoutSkip').checked = false;
    
    // Set tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('todayDate').value = tomorrow.toISOString().split('T')[0];
}

// Load and display existing data
function loadData() {
    const data = getData();
    console.log('Loaded data:', data);
}

// Update statistics
function updateStats() {
    const data = getData();
    const totalDays = data.length;
    const successfulFasts = data.filter(entry => entry.fasted).length;
    const successRate = totalDays > 0 ? Math.round((successfulFasts / totalDays) * 100) : 0;
    
    // Calculate fitness totals from fasting data
    const totalMilesFromFasting = data.reduce((sum, entry) => sum + (entry.miles || 0), 0);
    const totalHoursFromFasting = data.reduce((sum, entry) => sum + (entry.workout === 'yes' ? 1 : 0), 0);
    
    // Get fitness data from daily pledge (if it exists)
    const dailyPledgeFitness = JSON.parse(localStorage.getItem('dailyPledgeFitness')) || [];
    const totalMilesFromPledge = dailyPledgeFitness.reduce((sum, entry) => sum + (entry.miles || 0), 0);
    const totalHoursFromPledge = dailyPledgeFitness.reduce((sum, entry) => sum + (entry.hours || 0), 0);
    
    // Combine totals from both sources
    const totalMiles = totalMilesFromFasting + totalMilesFromPledge;
    const totalHours = totalHoursFromFasting + totalHoursFromPledge;
    
    document.getElementById('totalDays').textContent = totalDays;
    document.getElementById('successfulFasts').textContent = successfulFasts;
    document.getElementById('successRate').textContent = successRate + '%';
    document.getElementById('totalMiles').textContent = totalMiles.toFixed(1);
    document.getElementById('totalHours').textContent = totalHours.toFixed(1);
}

// Display fasting history
function displayHistory() {
    const data = getData();
    const container = document.getElementById('historyContainer');
    
    if (data.length === 0) {
        container.innerHTML = '<p class="no-data">No entries yet. Start tracking your fasting journey!</p>';
        return;
    }
    
    let html = '';
    data.forEach(entry => {
        const formattedDate = formatDate(entry.date);
        const statusClass = entry.fasted ? 'success' : 'fail';
        const statusText = entry.fasted ? 'Fasted ✓' : 'Did not fast ✗';
        const weightInfo = entry.weight ? `${entry.weight} ${entry.weightUnit}` : 'No weight';
        const milesInfo = entry.miles ? `${entry.miles} miles` : 'No miles';
        const workoutInfo = entry.workout === 'yes' ? '💪 Worked out' : 
                           entry.workout === 'no' ? '❌ No workout' : 
                           entry.workout === 'skip' ? '➖ Skipped' : 'No workout data';
        
        html += `
            <div class="history-entry ${statusClass}">
                <div class="entry-info">
                    <div class="entry-date">${formattedDate}</div>
                    <div class="entry-weight">${weightInfo} • ${milesInfo} • ${workoutInfo}</div>
                </div>
                <div class="entry-status ${statusClass}">${statusText}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Display weight chart
function displayWeightChart() {
    const data = getData();
    const container = document.getElementById('weightChart');
    
    // Filter entries with weight data
    const weightData = data.filter(entry => entry.weight !== null).reverse(); // Reverse to show chronological order
    
    if (weightData.length === 0) {
        container.innerHTML = '<p class="no-data">Weight data will appear here as you log entries.</p>';
        return;
    }
    
    // Find min and max weights for scaling
    const weights = weightData.map(entry => entry.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const weightRange = maxWeight - minWeight || 1; // Avoid division by zero
    
    let html = '<div class="weight-chart">';
    
    weightData.forEach(entry => {
        const height = weightRange > 0 ? ((entry.weight - minWeight) / weightRange) * 100 + 20 : 50;
        const formattedDate = formatDateShort(entry.date);
        
        html += `
            <div class="weight-point">
                <div class="weight-bar" style="height: ${height}px;" title="${entry.weight} ${entry.weightUnit} on ${formatDate(entry.date)}"></div>
                <div class="weight-value">${entry.weight}</div>
                <div class="weight-date">${formattedDate}</div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Add weight trend info
    if (weightData.length >= 2) {
        const firstWeight = weightData[0].weight;
        const lastWeight = weightData[weightData.length - 1].weight;
        const weightChange = lastWeight - firstWeight;
        const trendClass = weightChange < 0 ? 'success' : weightChange > 0 ? 'fail' : 'neutral';
        const trendSymbol = weightChange < 0 ? '↓' : weightChange > 0 ? '↑' : '→';
        
        html += `
            <div style="text-align: center; margin-top: 20px; padding: 15px; background: white; border-radius: 10px;">
                <strong>Weight Trend: </strong>
                <span class="entry-status ${trendClass}">
                    ${trendSymbol} ${Math.abs(weightChange).toFixed(1)} ${weightData[0].weightUnit}
                </span>
                <div style="margin-top: 5px; font-size: 0.9em; color: #7f8c8d;">
                    From ${firstWeight} to ${lastWeight} ${weightData[0].weightUnit}
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Display miles chart
function displayMilesChart() {
    const data = getData();
    const container = document.getElementById('milesChart');
    
    // Filter entries with miles data
    const milesData = data.filter(entry => entry.miles !== null).reverse(); // Reverse to show chronological order
    
    if (milesData.length === 0) {
        container.innerHTML = '<p class="no-data">Miles data will appear here as you log entries.</p>';
        return;
    }
    
    // Find min and max miles for scaling
    const miles = milesData.map(entry => entry.miles);
    const minMiles = Math.min(...miles);
    const maxMiles = Math.max(...miles);
    const milesRange = maxMiles - minMiles || 1; // Avoid division by zero
    
    let html = '<div class="weight-chart">';
    
    milesData.forEach(entry => {
        const height = milesRange > 0 ? ((entry.miles - minMiles) / milesRange) * 100 + 20 : 50;
        const formattedDate = formatDateShort(entry.date);
        
        html += `
            <div class="weight-point">
                <div class="weight-bar" style="height: ${height}px; background: linear-gradient(to top, #e67e22, #f39c12);" title="${entry.miles} miles on ${formatDate(entry.date)}"></div>
                <div class="weight-value">${entry.miles}</div>
                <div class="weight-date">${formattedDate}</div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Add miles summary info
    if (milesData.length >= 1) {
        const totalMiles = milesData.reduce((sum, entry) => sum + entry.miles, 0);
        const avgMiles = (totalMiles / milesData.length).toFixed(1);
        const maxMilesEntry = milesData.reduce((max, entry) => entry.miles > max.miles ? entry : max);
        
        html += `
            <div style="text-align: center; margin-top: 20px; padding: 15px; background: white; border-radius: 10px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; text-align: center;">
                    <div><strong>Total:</strong><br><span style="color: #e67e22;">${totalMiles.toFixed(1)} miles</span></div>
                    <div><strong>Average:</strong><br><span style="color: #e67e22;">${avgMiles} miles/day</span></div>
                    <div><strong>Best Day:</strong><br><span style="color: #e67e22;">${maxMilesEntry.miles} miles</span></div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Display workout chart
function displayWorkoutChart() {
    const data = getData();
    const container = document.getElementById('workoutChart');
    
    // Filter entries with workout data (excluding 'skip')
    const workoutData = data.filter(entry => entry.workout === 'yes' || entry.workout === 'no').reverse();
    
    if (workoutData.length === 0) {
        container.innerHTML = '<p class="no-data">Workout data will appear here as you log entries.</p>';
        return;
    }
    
    let html = '<div class="weight-chart">';
    
    workoutData.forEach(entry => {
        const height = entry.workout === 'yes' ? 80 : 20;
        const formattedDate = formatDateShort(entry.date);
        const color = entry.workout === 'yes' ? 'linear-gradient(to top, #27ae60, #2ecc71)' : 'linear-gradient(to top, #e74c3c, #c0392b)';
        const icon = entry.workout === 'yes' ? '💪' : '❌';
        
        html += `
            <div class="weight-point">
                <div class="weight-bar" style="height: ${height}px; background: ${color};" title="${entry.workout === 'yes' ? 'Worked out' : 'No workout'} on ${formatDate(entry.date)}"></div>
                <div class="weight-value">${icon}</div>
                <div class="weight-date">${formattedDate}</div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Add workout statistics
    if (workoutData.length >= 1) {
        const workoutCount = workoutData.filter(entry => entry.workout === 'yes').length;
        const workoutRate = Math.round((workoutCount / workoutData.length) * 100);
        const currentStreak = calculateWorkoutStreak(data);
        
        html += `
            <div style="text-align: center; margin-top: 20px; padding: 15px; background: white; border-radius: 10px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; text-align: center;">
                    <div><strong>Success Rate:</strong><br><span style="color: #27ae60;">${workoutRate}%</span></div>
                    <div><strong>Workouts:</strong><br><span style="color: #27ae60;">${workoutCount}/${workoutData.length}</span></div>
                    <div><strong>Current Streak:</strong><br><span style="color: #27ae60;">${currentStreak} days</span></div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Calculate current workout streak
function calculateWorkoutStreak(data) {
    const workoutData = data.filter(entry => entry.workout === 'yes' || entry.workout === 'no')
                           .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let streak = 0;
    for (const entry of workoutData) {
        if (entry.workout === 'yes') {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format date for chart (short version)
function formatDateShort(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

// Show success/error messages
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#d5f4e6' : '#fadbd8'};
        color: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        border-radius: 10px;
        border-left: 4px solid ${type === 'success' ? '#27ae60' : '#e74c3c'};
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        z-index: 1000;
        font-weight: 600;
        max-width: 300px;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Export data using the portable data manager
function exportData() {
    try {
        dataManager.exportData();
        showMessage('Data exported successfully!', 'success');
    } catch (error) {
        showMessage('Error exporting data', 'error');
    }
}

// Import data using the portable data manager
function importData() {
    dataManager.importData()
        .then(() => {
            // Refresh the display after import
            initializeApp();
            showMessage('Data imported successfully!', 'success');
        })
        .catch((error) => {
            showMessage(`Import failed: ${error}`, 'error');
        });
}

// Clear all data using the portable data manager
function clearAllData() {
    if (dataManager.clearAllData()) {
        initializeApp();
        showMessage('All data cleared successfully!', 'success');
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+S or Cmd+S to save entry
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveEntry();
    }
    
    // Y key to mark as fasted
    if (e.key === 'y' || e.key === 'Y') {
        document.getElementById('fastingYes').checked = true;
        document.getElementById('fastingNo').checked = false;
    }
    
    // N key to mark as not fasted
    if (e.key === 'n' || e.key === 'N') {
        document.getElementById('fastingNo').checked = true;
        document.getElementById('fastingYes').checked = false;
    }
});

// Add some helpful console commands for power users
console.log('Fasting Tracker loaded! Available commands:');
console.log('- exportData(): Export your data as JSON');
console.log('- getData(): View your current data');
console.log('- Keyboard shortcuts: Y/N for yes/no, Ctrl+S to save');


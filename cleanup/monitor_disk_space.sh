#!/bin/bash

# Disk Space Monitor Script
# This script monitors available disk space and notifies when it falls below 50GB
# It can optionally run cleanup scripts when disk space is low

# Configuration
THRESHOLD_GB=50  # Alert threshold in GB
CHECK_INTERVAL=300  # Check every 5 minutes (300 seconds)
CLEANUP_SCRIPT1="/Users/joefabre/Desktop/dasBoot/cleanup/cleanup_script1.sh"
CLEANUP_SCRIPT2="/Users/joefabre/Desktop/dasBoot/cleanup/cleanup_script2.sh"
LOG_FILE="/Users/joefabre/Desktop/dasBoot/cleanup/disk_monitor.log"
PID_FILE="/Users/joefabre/Desktop/dasBoot/cleanup/monitor.pid"

# Store PID for cleanup detection
echo $$ > "$PID_FILE"

# Clear and initialize log file with ASCII title
cat > "$LOG_FILE" << EOF
================================================================================
                          DISK SPACE MONITORING LOG                           
                                                                               
  This log tracks disk space usage and cleanup operations                     
  Started: $(date)                                                            
================================================================================

EOF

# Add a small delay before opening the file to ensure it's written
sleep 1

# Open the log file in the default text editor
open "$LOG_FILE"

# Function to handle script termination
cleanup_on_exit() {
    # Simple, direct logging without variables
    echo "$(date): ===============================================" >> "$LOG_FILE"
    echo "$(date): MONITORING STOPPED: User interrupted script" >> "$LOG_FILE"
    echo "$(date): Cleanup executed successfully" >> "$LOG_FILE"
    echo "$(date): ===============================================" >> "$LOG_FILE"
    
    # Clean up PID file
    rm -f "$PID_FILE"
    
    # Console output
    echo "Disk monitoring stopped!"
    
    exit 0
}

# Simple trap setup
trap cleanup_on_exit INT TERM

echo "$(date): Monitoring setup complete, traps installed" >> "$LOG_FILE"

# Log function
log_message() {
    echo "$(date): $1" >> "$LOG_FILE"
}

# Function to send macOS notification
send_notification() {
    osascript -e "display notification \"$1\" with title \"Disk Space Alert\""
    log_message "Notification: $1"
}

# Function to check disk space
check_disk_space() {
    # Get available space in KB for the root filesystem
    AVAILABLE_KB=$(df -k / | tail -1 | awk '{print $4}')
    # Convert to GB
    AVAILABLE_GB=$(echo "scale=2; $AVAILABLE_KB/1024/1024" | bc)
    
    log_message "Current available space: ${AVAILABLE_GB}GB"
    
    # Check if available space is below threshold
    if (( $(echo "$AVAILABLE_GB < $THRESHOLD_GB" | bc -l) )); then
        MESSAGE="Disk space is low: ${AVAILABLE_GB}GB available (threshold: ${THRESHOLD_GB}GB)"
        send_notification "$MESSAGE"
        
        # Execute cleanup scripts if they exist
        if [ -x "$CLEANUP_SCRIPT1" ]; then
            log_message "Running cleanup script 1"
            "$CLEANUP_SCRIPT1"
        else
            log_message "Cleanup script 1 not found or not executable"
        fi
        
        if [ -x "$CLEANUP_SCRIPT2" ]; then
            log_message "Running cleanup script 2"
            "$CLEANUP_SCRIPT2"
        else
            log_message "Cleanup script 2 not found or not executable"
        fi
    fi
}

# Main monitoring loop
log_message "Disk space monitoring started"
send_notification "Disk space monitoring started. Will alert if space falls below ${THRESHOLD_GB}GB."

# Create a function that runs in a subshell to detect parent death
monitor_parent() {
    local parent_pid=$1
    while kill -0 "$parent_pid" 2>/dev/null; do
        sleep 5
    done
    # Parent died, log it
    echo "$(date): ===============================================" >> "$LOG_FILE"
    echo "$(date): MONITORING STOPPED: Script process terminated" >> "$LOG_FILE"
    echo "$(date): Detected by parent monitor process" >> "$LOG_FILE"
    echo "$(date): ===============================================" >> "$LOG_FILE"
    rm -f "$PID_FILE"
}

# Start the parent monitor in background
monitor_parent $$ &
MONITOR_PID=$!

# Main loop with built-in termination detection
while true; do
    # Log that we're starting a check cycle
    log_message "Starting disk space check cycle..."
    
    check_disk_space
    
    log_message "Disk space check completed, sleeping for ${CHECK_INTERVAL} seconds..."
    
    # Break the sleep into smaller chunks to respond faster to signals
    for i in $(seq 1 $((CHECK_INTERVAL / 10))); do
        sleep 10
        # If our monitor process died, something's wrong
        if ! kill -0 $MONITOR_PID 2>/dev/null; then
            log_message "Monitor process died, exiting..."
            break 2
        fi
    done
done

# Clean shutdown
log_message "MONITORING STOPPED: Main loop exited normally"
kill $MONITOR_PID 2>/dev/null
rm -f "$PID_FILE"


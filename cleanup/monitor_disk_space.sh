#!/bin/bash

# Disk Space Monitor Script
# This script monitors available disk space and notifies when it falls below 50GB
# It can optionally run cleanup scripts when disk space is low

# Configuration
THRESHOLD_GB=50  # Alert threshold in GB
CHECK_INTERVAL=300  # Check every 5 minutes (300 seconds)
CLEANUP_SCRIPT1="/Users/joefabre/desktop/cleanup/cleanup_script1.sh"
CLEANUP_SCRIPT2="/Users/joefabre/desktop/cleanup/cleanup_script2.sh"
LOG_FILE="/Users/joefabre/desktop/cleanup/disk_monitor.log"

# Ensure log file exists
touch "$LOG_FILE"

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

while true; do
    check_disk_space
    sleep $CHECK_INTERVAL
done


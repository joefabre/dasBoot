# Cleanup Tracker

A collection of shell scripts for system maintenance and cleanup operations. This toolkit helps manage disk space, monitor system resources, and maintain system health.

## Scripts

- `cleanSweep.sh`: General system cleanup script
- `monitor_disk_space.sh`: Disk space monitoring and alerts
- `manage_access.sh`: Access log management
- `xcodeClean.sh`: Xcode-specific cleanup utilities
- `brain_tree.sh`: File system organization helper

## Features

- Automated disk space monitoring
- System log rotation and cleanup
- Development environment maintenance
- Access management tools
- Customizable cleanup rules

## Usage

```bash
# Monitor disk space
./monitor_disk_space.sh

# Run general cleanup
./cleanSweep.sh

# Clean Xcode files
./xcodeClean.sh
```

## Requirements

- macOS or Unix-like system
- Bash shell
- Root access for some operations

## Logs

All operations are logged to respective `.log` files for auditing and debugging purposes.

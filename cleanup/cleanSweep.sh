#!/bin/bash

echo "======================================="
echo "🧹 macOS Safe System Data Cleanup"
echo "======================================="

# Ask for admin password upfront
sudo -v

# 1. Delete user cache files
echo "🗑️ Clearing user caches..."
rm -rf ~/Library/Caches/*

# 2. Delete system-wide cache files
echo "🗑️ Clearing system caches..."
sudo rm -rf /Library/Caches/*

# 3. Delete old log files
echo "🗑️ Removing old logs..."
sudo find /private/var/log -type f -name "*.log" -delete

# 4. Remove old iOS backups
IOS_BACKUPS=~/Library/Application\ Support/MobileSync/Backup
if [ -d "$IOS_BACKUPS" ]; then
  echo "🗑️ Deleting old iOS backups..."
  rm -rf "$IOS_BACKUPS"
fi

# 5. Clear Trash
echo "🗑️ Emptying Trash..."
rm -rf ~/.Trash/*

# 6. Remove local Time Machine snapshots
echo "🗑️ Removing local Time Machine snapshots..."
sudo tmutil thinlocalsnapshots / 99999999999 4

# 7. Purge inactive memory (optional)
echo "💾 Flushing inactive memory (purge)..."
sudo purge

echo "💽 Disk Space Report:"
df -h /

echo "✅ Done! Consider restarting your Mac to finalize space recovery."

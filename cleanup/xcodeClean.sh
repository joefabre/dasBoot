#!/bin/bash

echo "🧼 Cleaning Xcode junk files..."

echo "🗑️ Deleting DerivedData..."
rm -rf ~/Library/Developer/Xcode/DerivedData/*

echo "🗑️ Deleting Archives..."
rm -rf ~/Library/Developer/Xcode/Archives/*

echo "🗑️ Deleting Device Support files..."
rm -rf ~/Library/Developer/Xcode/iOS\ DeviceSupport/*

echo "💽 Disk Space Report:"
df -h /

echo "🧹 Done! You just cleared out gigabytes of Xcode bloat."

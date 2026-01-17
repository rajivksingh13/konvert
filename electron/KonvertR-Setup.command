#!/bin/bash
set -e

APP_PATH="/Applications/KonvertR.app"

if [ ! -d "$APP_PATH" ]; then
  echo "KonvertR.app not found in /Applications."
  echo "Please move KonvertR.app to /Applications first, then run this script again."
  exit 1
fi

echo "Removing macOS quarantine flag..."
xattr -dr com.apple.quarantine "$APP_PATH"

echo "Launching KonvertR..."
open "$APP_PATH"

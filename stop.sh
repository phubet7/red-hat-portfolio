#!/bin/bash

# ==============================================================================
# Stop Script for Red Hat Partner Learning Web Application
# ==============================================================================

# Get the script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PID_FILE="$DIR/.app.pid"

if [ ! -f "$PID_FILE" ]; then
    echo "⚠️ No running application record found (.app.pid file missing)."
    
    # Fallback to search for vite process in this project directory
    VITE_PID=$(pgrep -f "vite")
    if [ ! -z "$VITE_PID" ]; then
        echo "🔍 Found active Vite processes: $VITE_PID"
        echo "Would you like to terminate all local Vite processes? (y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            kill $VITE_PID
            echo "✅ Terminated processes."
        fi
    fi
    exit 0
fi

PID=$(cat "$PID_FILE")

echo "🛑 Stopping Red Hat Partner Learning Application (PID: $PID)..."

if ps -p "$PID" > /dev/null; then
    # Kill the process group or parent PID
    kill "$PID"
    sleep 1
    
    if ps -p "$PID" > /dev/null; then
        echo "⚠️ Application did not stop, forcing termination..."
        kill -9 "$PID"
    fi
    
    echo "✅ Application stopped successfully."
else
    echo "⚠️ Process $PID is not running. Cleaning up stale PID file."
fi

# Clean up files
rm -f "$PID_FILE"
rm -f "$DIR/app.log"

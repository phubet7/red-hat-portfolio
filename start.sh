#!/bin/bash

# ==============================================================================
# Start Script for Red Hat Partner Learning Web Application
# ==============================================================================

# Get the script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PID_FILE="$DIR/.app.pid"

# Check if application is already running
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null; then
        echo "⚠️ Application is already running (PID: $PID)"
        exit 1
    else
        # Stale PID file
        rm "$PID_FILE"
    fi
fi

echo "🚀 Starting Red Hat Partner Learning Application..."
cd "$DIR"

# Run Vite in the background and redirect output to a log file
npm run dev > "$DIR/app.log" 2>&1 &
APP_PID=$!

# Save PID
echo "$APP_PID" > "$PID_FILE"

# Wait a brief moment to check if process started successfully
sleep 1.5
if ps -p "$APP_PID" > /dev/null; then
    echo "✅ Application started successfully!"
    echo "   - PID: $APP_PID"
    echo "   - Logs: $DIR/app.log"
    echo "   - URL: http://localhost:5173"
else
    echo "❌ Failed to start application. Check logs at: $DIR/app.log"
    rm "$PID_FILE"
    exit 1
fi

#!/bin/bash

# Always work relative to the script's own location, not wherever it was called from
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Load conda and activate the project environment
echo "Loading conda environment..."
source "$(conda info --base)/etc/profile.d/conda.sh"
conda activate fastapi-env

# Start the server in test mode in the background
echo "Starting server with APP_ENV=test..."
APP_ENV=test python3 main.py &
SERVER_PID=$!

# Give uvicorn a moment to boot before pytest fires requests
sleep 2

echo "Running tests..."
pytest "$@"
TEST_EXIT_CODE=$?

# Shut down the server
echo "Stopping server (PID $SERVER_PID)..."
kill $SERVER_PID
wait $SERVER_PID 2>/dev/null

# Clean up test database
echo "Removing test.db..."
rm -f "$SCRIPT_DIR/test.db"
echo "Done."

# Exit with pytest's exit code so CI/CD knows if tests passed or failed
exit $TEST_EXIT_CODE
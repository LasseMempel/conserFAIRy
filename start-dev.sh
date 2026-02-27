#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting development servers...${NC}"

# Start backend in background
echo -e "${BLUE}Starting backend...${NC}"
(
  cd backend || exit
  eval "$(conda shell.bash hook)"
  conda activate fastapi-env
  python main.py
) &

BACKEND_PID=$!

# Start frontend in background
echo -e "${BLUE}Starting frontend...${NC}"
(
  cd frontend || exit
  npx quasar dev
) &

FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
  echo -e "\n${GREEN}Shutting down servers...${NC}"
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  exit
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
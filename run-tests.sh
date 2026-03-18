#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

OVERALL_EXIT=0

# ---------------------------------------------------------------------------
# Helper: print a section header
# ---------------------------------------------------------------------------
section() {
  echo ""
  echo -e "${BLUE}===================================================${NC}"
  echo -e "${BLUE} $1${NC}"
  echo -e "${BLUE}===================================================${NC}"
}

# ---------------------------------------------------------------------------
# 1. Backend tests (starts/stops its own server and cleans up test.db)
# ---------------------------------------------------------------------------
section "1/3  Backend tests (pytest)"

bash backend/run_tests.sh
BACKEND_EXIT=$?

if [ $BACKEND_EXIT -ne 0 ]; then
  echo -e "${RED}Backend tests failed — skipping remaining tests.${NC}"
  exit $BACKEND_EXIT
fi
echo -e "${GREEN}Backend tests passed.${NC}"

# ---------------------------------------------------------------------------
# 2. Frontend unit tests (no server needed)
# ---------------------------------------------------------------------------
section "2/3  Frontend unit tests (Vitest)"

(cd frontend && npm run test:unit)
UNIT_EXIT=$?

if [ $UNIT_EXIT -ne 0 ]; then
  echo -e "${RED}Frontend unit tests failed — skipping E2E tests.${NC}"
  exit $UNIT_EXIT
fi
echo -e "${GREEN}Frontend unit tests passed.${NC}"

# ---------------------------------------------------------------------------
# 3. E2E tests (needs both backend and frontend dev server running)
# ---------------------------------------------------------------------------
section "3/3  E2E tests (Playwright)"

# Load conda for the backend server
source "$(conda info --base)/etc/profile.d/conda.sh"
conda activate fastapi-env

# Start backend in test mode
echo "Starting backend (APP_ENV=test)..."
(cd backend && APP_ENV=test python3 main.py) &
BACKEND_PID=$!

# Start frontend dev server
echo "Starting frontend dev server..."
(cd frontend && npx quasar dev) &
FRONTEND_PID=$!

# Wait for both servers to be ready
echo "Waiting for servers to boot..."
sleep 5

# Run Playwright
(cd frontend && npm run test:e2e)
E2E_EXIT=$?

# Shut down both servers
echo "Stopping servers..."
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
wait $BACKEND_PID $FRONTEND_PID 2>/dev/null

# Clean up test database from E2E run
rm -f backend/test.db

if [ $E2E_EXIT -ne 0 ]; then
  echo -e "${RED}E2E tests failed.${NC}"
  OVERALL_EXIT=$E2E_EXIT
else
  echo -e "${GREEN}E2E tests passed.${NC}"
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
echo ""
echo -e "${BLUE}===================================================${NC}"
if [ $OVERALL_EXIT -eq 0 ]; then
  echo -e "${GREEN} All tests passed.${NC}"
else
  echo -e "${RED} Some tests failed.${NC}"
fi
echo -e "${BLUE}===================================================${NC}"

exit $OVERALL_EXIT
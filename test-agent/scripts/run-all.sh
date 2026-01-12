#!/bin/bash

# Run all tests for KonvertR Test Agent
# This script runs backend, frontend, and desktop tests

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_AGENT_DIR="$(dirname "$SCRIPT_DIR")"
REPORTS_DIR="$TEST_AGENT_DIR/reports/latest"

echo "═══════════════════════════════════════════════════════"
echo "KonvertR Test Agent - Running All Tests"
echo "═══════════════════════════════════════════════════════"
echo ""

# Create reports directory
mkdir -p "$REPORTS_DIR"

# Check if application is running
echo "🔍 Checking if KonvertR is running..."
if ! curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "⚠️  KonvertR is not running on http://localhost:8080"
    echo "Please start it with: mvn spring-boot:run"
    echo ""
    read -p "Press Enter to continue anyway, or Ctrl+C to cancel..."
else
    echo "✅ KonvertR is running"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "Running Backend Tests"
echo "═══════════════════════════════════════════════════════"
cd "$TEST_AGENT_DIR/backend-tests"
mvn test -q || echo "⚠️  Some backend tests failed"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "Running Frontend E2E Tests"
echo "═══════════════════════════════════════════════════════"
cd "$TEST_AGENT_DIR/frontend-tests"
npm test || echo "⚠️  Some frontend tests failed"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "Test Execution Complete"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "📊 Reports available at:"
echo "   $REPORTS_DIR/index.html"
echo ""
echo "Open in browser to view detailed results"


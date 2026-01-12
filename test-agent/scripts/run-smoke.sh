#!/bin/bash

# Run smoke tests (critical path only)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_AGENT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🚀 Running Smoke Tests (Critical Path Only)"
echo ""

cd "$TEST_AGENT_DIR/frontend-tests"
npm run test:smoke

echo ""
echo "✅ Smoke tests complete"


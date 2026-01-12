# 🧪 KonvertR Test Agent

Automated testing suite for KonvertR desktop application.

## 📁 Structure

```
test-agent/
├── backend-tests/          # Backend API tests (Java/JUnit)
├── frontend-tests/         # Frontend E2E tests (Playwright)
├── desktop-tests/          # Desktop-specific tests
├── test-data/              # Test data files
│   ├── valid/              # Valid test files
│   ├── invalid/            # Invalid test files
│   ├── edge-cases/         # Edge case files
│   └── large-files/        # Large files for performance
├── config/                 # Test configuration
├── scripts/                # Test execution scripts
└── reports/                # Test reports (generated)
```

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 16+
- KonvertR application built and ready

### Setup

1. **Backend Tests Setup:**
```bash
cd backend-tests
mvn clean install
```

2. **Frontend Tests Setup:**
```bash
cd frontend-tests
npm install
npx playwright install
```

### Run Tests

```bash
# Run all tests
./scripts/run-all.sh        # Linux/Mac
scripts\run-all.bat         # Windows

# Run specific category
./scripts/run-tests.sh --category converter

# Run smoke tests
./scripts/run-smoke.sh
```

## 📊 Test Reports

Reports are generated in `reports/latest/index.html`

Open in browser to view detailed test results.

## 📝 Documentation

See `TEST_AGENT_GUIDE.md` in project root for detailed documentation.


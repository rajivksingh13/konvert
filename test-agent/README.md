# 🧪 KonvertR E2E Test Suite

End-to-end testing suite for KonvertR covering all features and functionality.

## 🚀 Quick Start

### Prerequisites
- **Java 17+** (for backend tests)
- **Maven 3.6+** (for backend tests)
- **Node.js 18+** (for frontend/desktop tests)
- **KonvertR application** running on `http://localhost:8080`

### Setup

1. **Backend Tests:**
```bash
cd backend-tests
mvn clean install
```

2. **Frontend Tests:**
```bash
cd frontend-tests
npm install
npx playwright install
```

3. **Desktop Tests:**
```bash
cd desktop-tests
npm install
npx playwright install
```

### Run Tests

```bash
# Run all tests
./scripts/run-all.sh        # Linux/Mac
scripts\run-all.bat         # Windows

# Run smoke tests (critical path)
./scripts/run-smoke.sh
scripts\run-smoke.bat

# Run specific category
./scripts/run-backend.sh    # Backend API tests only
./scripts/run-frontend.sh   # Frontend E2E tests only
./scripts/run-desktop.sh    # Desktop tests only
```

## 📊 Test Coverage

### Backend API Tests

- **Format Conversion**: JSON ↔ YAML, JSON ↔ TOML, JSON ↔ XML, JSON ↔ Protobuf, YAML ↔ CSV, CSV ↔ JSON/XML/YAML, Properties → YAML
- **Formatting**: JSON, YAML, CSV formatters with beautification
- **Base64**: Encode/decode operations
- **Utilities**: URL/HTML/Hex encoding, JWT decode, UUID generation, Hash generation
- **File Operations**: Single/batch upload, format detection, download
- **Validation**: JSON, YAML, CSV, XML, TOML, Properties validation
- **Diff**: JSON/YAML/XML comparison and reporting
- **Minify**: JSON/YAML/XML/CSS minification, GZIP compression
- **Transform**: Merge, flatten/unflatten, rename keys, transform values, filter fields, convert types

### Frontend E2E Tests

- **Format Conversion UI**: All conversion types via UI
- **Formatting UI**: JSON/YAML/CSV formatters
- **Base64 UI**: Encode/decode interface
- **Utilities UI**: All utility tools interface
- **File Operations UI**: Drag & drop, file picker, batch upload, download
- **Validation UI**: Format validation interface
- **Diff UI**: File comparison and visualization
- **Minify UI**: Minification and compression interface
- **Transform UI**: Data transformation interface

### Desktop Tests

- **Application Launch**: Window appearance, title, size
- **Window Management**: Minimize/maximize/close, resize
- **Backend Integration**: Process start, health checks, API calls, cleanup

## 📊 Test Reports

Reports are generated in `reports/latest/`:
- **HTML Report**: `index.html` - Visual test results
- **JSON Report**: `results.json` - Machine-readable results
- **Screenshots/Videos**: Failure recordings

## 🎯 Test Tags

- `@smoke` - Critical path tests
- `@regression` - Full regression suite
- `@performance` - Performance tests
- `@integration` - Integration tests

### Run by Tag

```bash
# Run smoke tests only
npx playwright test --grep @smoke

# Run performance tests
npx playwright test --grep @performance
```

## 🐛 Debugging

### Backend Tests
```bash
cd backend-tests
mvn test -Dtest=FormatConverterTest -Dmaven.surefire.debug
```

### Frontend Tests
```bash
cd frontend-tests
npx playwright test --debug
npx playwright test --headed  # Run in headed mode
```

### Desktop Tests
```bash
cd desktop-tests
npx playwright test --debug
```

## 📈 CI/CD Integration

Tests can be integrated into CI/CD pipelines. See GitHub Actions examples in the project documentation.

## 📚 Documentation

- **Quick Start**: See `QUICK_START.md`
- **Setup Guide**: See `SETUP.md`
- **Implementation Summary**: See `IMPLEMENTATION_SUMMARY.md`
- **Main Project README**: See `../README.md`

## 🤝 Contributing

When adding new features to KonvertR:

1. Add corresponding backend API tests
2. Add corresponding frontend E2E tests
3. Add test data files if needed
4. Ensure all tests pass before submitting PR

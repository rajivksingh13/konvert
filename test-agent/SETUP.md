# 🚀 Test Agent Setup Guide

## Prerequisites

1. **Java 17+** (JDK)
   ```bash
   java -version
   ```

2. **Maven 3.6+**
   ```bash
   mvn -version
   ```

3. **Node.js 16+**
   ```bash
   node -version
   npm -version
   ```

4. **KonvertR Application**
   - Built and ready to run
   - Should start on `http://localhost:8080`

## Setup Steps

### 1. Backend Tests Setup

```bash
cd test-agent/backend-tests
mvn clean install
```

This will:
- Download all dependencies (JUnit, RestAssured, Jackson, etc.)
- Compile test classes
- Set up test environment

### 2. Frontend Tests Setup

```bash
cd test-agent/frontend-tests
npm install
npx playwright install
```

This will:
- Install Playwright and dependencies
- Download browser binaries (Chromium)

### 3. Verify Setup

```bash
# From test-agent directory
cd backend-tests
mvn test -Dtest=BaseTest  # Should compile successfully

cd ../frontend-tests
npm test -- --list  # Should list available tests
```

## Running Tests

### Option 1: Run All Tests

**Windows:**
```bash
cd test-agent
scripts\run-all.bat
```

**Linux/Mac:**
```bash
cd test-agent
chmod +x scripts/*.sh
./scripts/run-all.sh
```

### Option 2: Run Backend Tests Only

```bash
cd test-agent/backend-tests
mvn test
```

### Option 3: Run Frontend Tests Only

```bash
cd test-agent/frontend-tests
npm test
```

### Option 4: Run Smoke Tests

**Windows:**
```bash
cd test-agent
scripts\run-smoke.bat
```

**Linux/Mac:**
```bash
cd test-agent
./scripts/run-smoke.sh
```

### Option 5: Run Specific Test Category

```bash
cd test-agent/frontend-tests
npm run test:converter    # Converter tests only
npm run test:formatter    # Formatter tests only
npm run test:utilities    # Utilities tests only
npm run test:files        # File operations tests only
```

## Test Reports

After running tests, reports are available at:
```
test-agent/reports/latest/index.html
```

Open in browser to view:
- Test results summary
- Pass/fail status
- Error details
- Screenshots (for failures)
- Performance metrics

## Troubleshooting

### Application Not Running

If tests fail because KonvertR is not running:

```bash
# Start KonvertR in a separate terminal
mvn spring-boot:run

# Or if already built
java -jar target/konvertr-1.0.0.jar
```

### Port Already in Use

If port 8080 is already in use:

```bash
# Windows: Find process using port
netstat -ano | findstr :8080

# Linux/Mac: Find process using port
lsof -i :8080

# Kill the process or change port in application.properties
```

### Test Data Files Missing

Test data files are expected in:
- `test-samples/` (relative to project root)
- `test-agent/test-data/valid/`

Copy test files if needed:
```bash
cp test-samples/*.json test-agent/test-data/valid/
cp test-samples/*.yaml test-agent/test-data/valid/
```

### Playwright Browser Issues

If Playwright tests fail:

```bash
cd test-agent/frontend-tests
npx playwright install --force
```

## Next Steps

1. ✅ Complete setup
2. ✅ Start KonvertR application
3. ✅ Run smoke tests to verify setup
4. ✅ Run full test suite
5. ✅ Review test reports

## Integration with CI/CD

The Test Agent can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: |
    cd test-agent
    ./scripts/run-all.sh
```

See `TEST_AGENT_GUIDE.md` for detailed CI/CD integration examples.


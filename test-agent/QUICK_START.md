# ⚡ Quick Start - Test Agent

## 🚀 3-Step Setup

### Step 1: Install Dependencies

**Backend Tests:**
```bash
cd test-agent/backend-tests
mvn clean install
```

**Frontend Tests:**
```bash
cd test-agent/frontend-tests
npm install
npx playwright install
```

### Step 2: Start KonvertR

In a separate terminal:
```bash
mvn spring-boot:run
```

Wait until you see: `Started KonvertApplication`

### Step 3: Run Tests

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

## 📊 View Results

Open `test-agent/reports/latest/index.html` in your browser.

## 🎯 Quick Test Commands

```bash
# Run all tests
./scripts/run-all.sh          # Linux/Mac
scripts\run-all.bat           # Windows

# Run smoke tests (quick)
./scripts/run-smoke.sh        # Linux/Mac
scripts\run-smoke.bat         # Windows

# Run backend only
cd backend-tests && mvn test

# Run frontend only
cd frontend-tests && npm test

# Run specific category
cd frontend-tests
npm run test:converter
npm run test:formatter
npm run test:utilities
```

## ✅ Verification

After setup, verify everything works:

```bash
# 1. Check backend tests compile
cd test-agent/backend-tests
mvn test-compile

# 2. Check frontend tests list
cd test-agent/frontend-tests
npm test -- --list

# 3. Run a single smoke test
npm run test:smoke
```

## 📚 More Information

- **Full Guide:** See `TEST_AGENT_GUIDE.md` in project root
- **Setup Details:** See `SETUP.md` in test-agent directory
- **Troubleshooting:** See `SETUP.md` troubleshooting section


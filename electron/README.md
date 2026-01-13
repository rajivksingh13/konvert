# KonvertR Electron Wrapper

This is the Electron wrapper for KonvertR. It provides a native desktop application experience while keeping all existing Spring Boot and React code unchanged.

## Structure

- `main.js` - Electron main process (launches backend, creates window)
- `preload.js` - Preload script for security
- `loading.html` - Loading screen shown while backend starts
- `error.html` - Error screen if backend fails to start
- `package.json` - Electron dependencies and build configuration

## Development

1. Build Spring Boot backend:
   ```bash
   mvn clean package
   ```

2. Build React frontend:
   ```bash
   cd frontend
   npm run build:deploy
   cd ..
   ```

3. Install Electron dependencies:
   ```bash
   cd electron
   npm install
   ```

4. Run Electron app:
   ```bash
   npm start
   ```

## Building Distribution

Build for Windows:
```bash
cd electron
npm run build:win
```

This creates `dist-electron/KonvertR-Portable-1.0.0.zip` containing the executable.

## How It Works

1. Electron window opens immediately (shows loading screen)
2. Electron launches Spring Boot backend as child process
3. Waits for backend to be ready (checks `/api/health`)
4. Loads React app from `http://localhost:8080` in Electron window
5. User sees professional desktop app

## Features

- ✅ No JAR files visible to users
- ✅ No source code exposed
- ✅ Single EXE in ZIP package
- ✅ Click EXE to launch
- ✅ Professional desktop app UX
- ✅ All existing code unchanged

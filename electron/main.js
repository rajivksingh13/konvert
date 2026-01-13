const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

// Use Node.js built-in http module for health check (no external dependencies)
function httpGet(url) {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 8080,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        timeout: 2000
      };
      
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: () => {
              try {
                return Promise.resolve(JSON.parse(data));
              } catch (e) {
                return Promise.resolve({});
              }
            }
          });
        });
      });
      
      req.on('error', (err) => {
        reject(err);
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      req.end();
    } catch (error) {
      reject(error);
    }
  });
}

let mainWindow;
let backendProcess;
const BACKEND_PORT = 8080;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

// Find Java executable
function findJava() {
  const javaHome = process.env.JAVA_HOME;
  if (javaHome) {
    const javaExe = path.join(javaHome, 'bin', 'java.exe');
    if (fs.existsSync(javaExe)) {
      return javaExe;
    }
    const javaBin = path.join(javaHome, 'bin', 'java');
    if (fs.existsSync(javaBin)) {
      return javaBin;
    }
  }
  
  // Try common locations
  const commonPaths = [
    'java',
    'java.exe',
    path.join('C:', 'Program Files', 'Java', 'jdk-17', 'bin', 'java.exe'),
    path.join('C:', 'Program Files', 'Java', 'jre-17', 'bin', 'java.exe'),
    path.join(process.env.PROGRAMFILES, 'Java', 'jdk-17', 'bin', 'java.exe'),
    path.join(process.env['PROGRAMFILES(X86)'], 'Java', 'jdk-17', 'bin', 'java.exe')
  ];
  
  for (const javaPath of commonPaths) {
    try {
      const result = require('child_process').execSync(`"${javaPath}" -version`, { stdio: 'ignore' });
      return javaPath;
    } catch (e) {
      // Continue searching
    }
  }
  
  return 'java'; // Fallback to PATH
}

// Find backend JAR
function findBackendJar() {
  // In development
  const targetDir = path.join(__dirname, '..', 'target');
  if (fs.existsSync(targetDir)) {
    const files = fs.readdirSync(targetDir);
    const jarFile = files.find(f => f.startsWith('konvertr-') && f.endsWith('.jar') && !f.includes('original') && !f.includes('sources') && !f.includes('javadoc'));
    if (jarFile) {
      return path.join(targetDir, jarFile);
    }
  }
  
  // In packaged app
  const resourcesPath = process.resourcesPath || __dirname;
  const backendPath = path.join(resourcesPath, 'backend');
  
  if (fs.existsSync(backendPath)) {
    // Priority 1: Look for obfuscated backend file (.dat - ProGuard obfuscated)
    const datFiles = fs.readdirSync(backendPath).filter(f => f.endsWith('.dat'));
    if (datFiles.length > 0) {
      console.log('Using ProGuard-obfuscated backend:', datFiles[0]);
      return path.join(backendPath, datFiles[0]);
    }
    
    // Priority 2: Look for ProGuard-obfuscated JAR
    const obfuscatedJars = fs.readdirSync(backendPath).filter(f => f.includes('obfuscated') && f.endsWith('.jar'));
    if (obfuscatedJars.length > 0) {
      console.log('Using ProGuard-obfuscated JAR:', obfuscatedJars[0]);
      return path.join(backendPath, obfuscatedJars[0]);
    }
    
    // Priority 3: Fallback to regular JAR files
    const jars = fs.readdirSync(backendPath).filter(f => f.endsWith('.jar') && !f.includes('sources') && !f.includes('javadoc') && !f.includes('original'));
    if (jars.length > 0) {
      console.log('Using regular JAR:', jars[0]);
      return path.join(backendPath, jars[0]);
    }
  }
  
  throw new Error('Backend JAR not found!');
}

// Start Spring Boot backend
function startBackend() {
  try {
    const javaExe = findJava();
    const jarPath = findBackendJar();
    
    console.log(`Starting backend: ${javaExe} -jar ${jarPath}`);
    
    backendProcess = spawn(javaExe, [
      '-jar',
      jarPath,
      '--server.port=' + BACKEND_PORT,
      '--spring.main.web-application-type=servlet',
      '-Delectron.mode=true'
    ], {
      detached: true,
      stdio: ['ignore', 'ignore', 'ignore'],
      cwd: path.dirname(jarPath)
    });
    
    backendProcess.unref();
    
    console.log('Backend process started');
  } catch (error) {
    console.error('Failed to start backend:', error);
    showError('Failed to start backend: ' + error.message);
  }
}

// Wait for backend to be ready
function waitForBackend(callback, retries = 60) {
  if (retries <= 0) {
    showError('Backend failed to start. Please check if port 8080 is available.');
    return;
  }
  
  httpGet(`${BACKEND_URL}/api/health`)
    .then(response => {
      if (response.ok) {
        console.log('Backend is ready!');
        callback();
      } else {
        setTimeout(() => waitForBackend(callback, retries - 1), 1000);
      }
    })
    .catch((error) => {
      // Backend not ready yet, keep waiting
      if (retries % 10 === 0) {
        console.log(`Waiting for backend... (${retries} retries left)`);
      }
      setTimeout(() => waitForBackend(callback, retries - 1), 1000);
    });
}

// Show error dialog
function showError(message) {
  if (mainWindow) {
    mainWindow.loadFile(path.join(__dirname, 'error.html'), {
      query: { message: message }
    });
  }
}

// Create Electron window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Show loading screen immediately
  mainWindow.loadFile(path.join(__dirname, 'loading.html'));
  mainWindow.show();

  // Start backend
  startBackend();

  // Wait for backend, then load app
  waitForBackend(() => {
    mainWindow.loadURL(BACKEND_URL);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Kill backend process
  if (backendProcess) {
    try {
      process.kill(backendProcess.pid);
    } catch (e) {
      // Process might already be dead
    }
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Kill backend process
  if (backendProcess) {
    try {
      process.kill(backendProcess.pid);
    } catch (e) {
      // Process might already be dead
    }
  }
});

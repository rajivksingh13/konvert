const { app, BrowserWindow } = require('electron');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

function httpGet(url) {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 8989,
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
      
      req.on('error', (err) => { reject(err); });
      req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
      req.end();
    } catch (error) {
      reject(error);
    }
  });
}

let mainWindow;
let backendProcess;
let backendFailed = false;
const BACKEND_PORT = 8989;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

// --- Diagnostic log file (written to user data dir) ---
const logLines = [];
function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(line);
  logLines.push(line);
}
function logError(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ERROR: ${msg}`;
  console.error(line);
  logLines.push(line);
}
function flushLog() {
  try {
    const logDir = path.join(app.getPath('userData'), 'logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    const logFile = path.join(logDir, 'startup.log');
    fs.writeFileSync(logFile, logLines.join('\n') + '\n');
    log('Log written to: ' + logFile);
  } catch (e) {
    console.error('Failed to write log:', e.message);
  }
}

// --- Enrich PATH on macOS ---
// GUI apps launched from Finder get a minimal PATH (/usr/bin:/bin:/usr/sbin:/sbin).
// Shell-installed Java (Homebrew, SDKMAN, etc.) won't be visible.
function enrichMacOSEnv(env) {
  if (process.platform !== 'darwin') return env;

  const enriched = { ...env };
  const extraPaths = [
    '/opt/homebrew/bin',
    '/opt/homebrew/sbin',
    '/usr/local/bin',
    '/usr/local/sbin',
    '/usr/bin',
    '/bin',
    '/usr/sbin',
    '/sbin'
  ];

  // Try to get the real shell PATH
  try {
    const shellPath = execSync('/bin/zsh -ilc "echo $PATH"', {
      encoding: 'utf8',
      timeout: 3000,
      env: { ...env, HOME: env.HOME || process.env.HOME }
    }).trim();
    if (shellPath && shellPath.length > 0) {
      log('Shell PATH resolved: ' + shellPath.substring(0, 200));
      enriched.PATH = shellPath;
      return enriched;
    }
  } catch (e) {
    log('Could not resolve shell PATH (' + e.message + '), using fallback');
  }

  const currentPath = enriched.PATH || '';
  for (const p of extraPaths) {
    if (!currentPath.includes(p)) {
      enriched.PATH = p + ':' + (enriched.PATH || '');
    }
  }
  return enriched;
}

// --- Find Java executable ---
function findJava() {
  log('Searching for Java...');
  log('Platform: ' + process.platform + ', arch: ' + process.arch);
  log('JAVA_HOME env: ' + (process.env.JAVA_HOME || '(not set)'));
  log('PATH: ' + (process.env.PATH || '(not set)').substring(0, 300));

  const javaHome = process.env.JAVA_HOME;
  if (javaHome) {
    const javaExe = path.join(javaHome, 'bin', process.platform === 'win32' ? 'java.exe' : 'java');
    if (fs.existsSync(javaExe)) {
      log('Found Java via JAVA_HOME: ' + javaExe);
      return javaExe;
    }
  }

  const commonPaths = [];

  if (process.platform === 'win32') {
    commonPaths.push('java.exe', 'java');
    const programFiles = process.env.PROGRAMFILES;
    const programFilesX86 = process.env['PROGRAMFILES(X86)'];
    if (programFiles) {
      commonPaths.push(path.join(programFiles, 'Java', 'jdk-17', 'bin', 'java.exe'));
    }
    if (programFilesX86) {
      commonPaths.push(path.join(programFilesX86, 'Java', 'jdk-17', 'bin', 'java.exe'));
    }
  } else if (process.platform === 'darwin') {
    // /usr/libexec/java_home is the most reliable on macOS
    try {
      const macJavaHome = execSync('/usr/libexec/java_home', { encoding: 'utf8', timeout: 5000 }).trim();
      if (macJavaHome) {
        const javaFromHome = path.join(macJavaHome, 'bin', 'java');
        log('/usr/libexec/java_home → ' + macJavaHome);
        if (fs.existsSync(javaFromHome)) {
          log('Found Java via java_home: ' + javaFromHome);
          return javaFromHome;
        }
      }
    } catch (e) {
      log('/usr/libexec/java_home failed: ' + e.message);
    }
    commonPaths.push('/opt/homebrew/bin/java');
    commonPaths.push('/usr/local/bin/java');
    commonPaths.push('/usr/bin/java');
    commonPaths.push('java');
  } else {
    commonPaths.push('/usr/bin/java', '/usr/local/bin/java', 'java');
  }

  for (const javaPath of commonPaths) {
    try {
      execSync(`"${javaPath}" -version`, { stdio: 'ignore', timeout: 5000 });
      log('Found Java at: ' + javaPath);
      return javaPath;
    } catch (e) {
      log('Tried ' + javaPath + ' → not found');
    }
  }

  logError('Java not found in any known location');
  return null;
}

// --- Get Java version string ---
function getJavaVersion(javaExe) {
  try {
    const output = execSync(`"${javaExe}" -version 2>&1`, { encoding: 'utf8', timeout: 5000 });
    const match = output.match(/version\s+"([^"]+)"/);
    return match ? match[1] : output.trim().split('\n')[0];
  } catch (e) {
    return 'unknown';
  }
}

// --- Find backend JAR ---
function findBackendJar() {
  // Development mode
  const targetDir = path.join(__dirname, '..', 'target');
  if (fs.existsSync(targetDir)) {
    const files = fs.readdirSync(targetDir);
    const jarFile = files.find(f => f.startsWith('konvertr-') && f.endsWith('.jar') && !f.includes('original') && !f.includes('sources') && !f.includes('javadoc'));
    if (jarFile) {
      log('Dev mode: found ' + jarFile);
      return path.join(targetDir, jarFile);
    }
  }
  
  // Packaged app
  const resourcesPath = process.resourcesPath || __dirname;
  const backendPath = path.join(resourcesPath, 'backend');
  log('Resources path: ' + resourcesPath);
  log('Backend path: ' + backendPath);
  log('Backend dir exists: ' + fs.existsSync(backendPath));
  
  if (fs.existsSync(backendPath)) {
    const allFiles = fs.readdirSync(backendPath);
    log('Backend dir contents: ' + JSON.stringify(allFiles));

    const datFiles = allFiles.filter(f => f.endsWith('.dat'));
    if (datFiles.length > 0) {
      const filePath = path.join(backendPath, datFiles[0]);
      const stat = fs.statSync(filePath);
      log('Using backend.dat: ' + datFiles[0] + ' (' + (stat.size / 1024 / 1024).toFixed(1) + ' MB)');
      return filePath;
    }
    
    const obfuscatedJars = allFiles.filter(f => f.includes('obfuscated') && f.endsWith('.jar'));
    if (obfuscatedJars.length > 0) {
      log('Using obfuscated JAR: ' + obfuscatedJars[0]);
      return path.join(backendPath, obfuscatedJars[0]);
    }
    
    const jars = allFiles.filter(f => f.endsWith('.jar') && !f.includes('sources') && !f.includes('javadoc') && !f.includes('original'));
    if (jars.length > 0) {
      log('Using JAR: ' + jars[0]);
      return path.join(backendPath, jars[0]);
    }
  }
  
  throw new Error(
    'Backend file not found!\n' +
    'Expected location: ' + backendPath + '\n' +
    'Resources path: ' + resourcesPath + '\n' +
    'Dir exists: ' + fs.existsSync(backendPath)
  );
}

// --- Start Spring Boot backend ---
function startBackend() {
  log('=== KonvertR Backend Startup ===');
  log('Electron version: ' + process.versions.electron);
  log('Node version: ' + process.versions.node);
  log('Platform: ' + process.platform + ' ' + process.arch);
  log('App path: ' + app.getAppPath());

  let jarPath;
  try {
    jarPath = findBackendJar();
  } catch (error) {
    logError('Backend JAR not found: ' + error.message);
    backendFailed = true;
    flushLog();
    showError(
      'Backend application file not found.\n\n' +
      error.message + '\n\n' +
      'The application package may be incomplete.\n' +
      'Please re-download KonvertR from the releases page.'
    );
    return;
  }

  const javaExe = findJava();
  if (!javaExe) {
    backendFailed = true;
    flushLog();
    const installHint = process.platform === 'darwin'
      ? 'Install Java on macOS:\n' +
        '  • Run: brew install openjdk@17\n' +
        '  • Or download from https://adoptium.net'
      : 'Download Java from https://adoptium.net';
    showError(
      'Java was not found on this computer.\n\n' +
      'KonvertR requires Java 17 or later to run.\n\n' +
      installHint + '\n\n' +
      'After installing Java, restart KonvertR.'
    );
    return;
  }

  const javaVersion = getJavaVersion(javaExe);
  log('Java executable: ' + javaExe);
  log('Java version: ' + javaVersion);
  log('Backend file: ' + jarPath);

  // Build spawn environment — enrich PATH on macOS so Java child process works correctly
  const spawnEnv = enrichMacOSEnv(process.env);

  // Set JAVA_HOME in spawn env if not already set (helps some libraries)
  if (!spawnEnv.JAVA_HOME && javaExe !== 'java') {
    const javaDir = path.dirname(path.dirname(javaExe));
    if (fs.existsSync(javaDir)) {
      spawnEnv.JAVA_HOME = javaDir;
      log('Set JAVA_HOME=' + javaDir);
    }
  }

  try {
    backendProcess = spawn(javaExe, [
      '-jar',
      jarPath,
      '--server.port=' + BACKEND_PORT,
      '--spring.main.web-application-type=servlet',
      '-Delectron.mode=true'
    ], {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: path.dirname(jarPath),
      env: spawnEnv
    });
  } catch (error) {
    logError('Failed to spawn: ' + error.message);
    backendFailed = true;
    flushLog();
    showError('Failed to start backend: ' + error.message);
    return;
  }

  let stderrBuffer = '';

  backendProcess.stdout.on('data', (data) => {
    const text = data.toString().trim();
    log('[backend] ' + text);
  });

  backendProcess.stderr.on('data', (data) => {
    const text = data.toString();
    stderrBuffer += text;
    logError('[backend] ' + text.trim());
  });

  backendProcess.on('error', (err) => {
    logError('Process error: ' + err.message + ' (code: ' + err.code + ')');
    backendFailed = true;
    flushLog();
    if (err.code === 'ENOENT') {
      showError(
        'Java executable not found: ' + javaExe + '\n\n' +
        'The file may have been removed or the path is invalid.\n' +
        'Please verify Java is installed and restart KonvertR.'
      );
    } else {
      showError('Failed to start backend: ' + err.message);
    }
  });

  backendProcess.on('exit', (code, signal) => {
    log('Backend exited: code=' + code + ', signal=' + signal);
    if (code !== null && code !== 0) {
      backendFailed = true;
      flushLog();
      const detail = stderrBuffer.length > 0
        ? stderrBuffer.substring(0, 800)
        : 'No error details captured.';

      let hint = 'Please ensure Java 17+ is installed and port ' + BACKEND_PORT + ' is available.';
      if (detail.includes('Address already in use')) {
        hint = 'Port ' + BACKEND_PORT + ' is already in use.\nClose the other application using it and try again.';
      } else if (detail.includes('UnsupportedClassVersionError')) {
        hint = 'Your Java version is too old. Please install Java 17 or later.';
      } else if (detail.includes('module')) {
        hint = 'A Java module error occurred. Your JDK version (' + javaVersion + ') may have compatibility issues.\nTry installing JDK 17 or 21 LTS instead.';
      }

      showError(
        'Backend stopped unexpectedly (exit code ' + code + ').\n\n' +
        hint + '\n\n' +
        'Java: ' + javaExe + ' (version ' + javaVersion + ')\n' +
        'Details: ' + detail
      );
    }
  });

  log('Backend process spawned (PID: ' + backendProcess.pid + ')');
}

// --- Wait for backend health check ---
function waitForBackend(callback, retries = 60) {
  if (backendFailed) return;
  if (retries <= 0) {
    logError('Health check timed out after 60 attempts');
    flushLog();
    const logPath = path.join(app.getPath('userData'), 'logs', 'startup.log');
    showError(
      'Backend did not respond after 60 seconds.\n\n' +
      'Please check:\n' +
      '  • Java 17+ is installed (java -version)\n' +
      '  • Port ' + BACKEND_PORT + ' is not used by another app\n\n' +
      'Diagnostic log: ' + logPath
    );
    return;
  }
  
  httpGet(`${BACKEND_URL}/api/health`)
    .then(response => {
      if (response.ok) {
        log('Backend is ready!');
        flushLog();
        callback();
      } else {
        setTimeout(() => waitForBackend(callback, retries - 1), 1000);
      }
    })
    .catch(() => {
      if (backendFailed) return;
      if (retries % 10 === 0) {
        log('Waiting for backend... (' + retries + ' retries left)');
      }
      setTimeout(() => waitForBackend(callback, retries - 1), 1000);
    });
}

// --- Show error page ---
function showError(message) {
  if (mainWindow) {
    mainWindow.loadFile(path.join(__dirname, 'error.html'), {
      query: { message: message }
    });
  }
}

// --- Create window ---
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

  mainWindow.loadFile(path.join(__dirname, 'loading.html'));
  mainWindow.show();

  startBackend();

  waitForBackend(() => {
    mainWindow.loadURL(BACKEND_URL);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// --- App lifecycle ---
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

function killBackend() {
  if (backendProcess && !backendProcess.killed) {
    try { backendProcess.kill(); } catch (e) {}
  }
}

app.on('window-all-closed', () => {
  killBackend();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  killBackend();
});

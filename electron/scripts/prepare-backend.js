const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const targetDir = path.join(repoRoot, 'target');
const outputFile = path.join(targetDir, 'backend.dat');

function findBackendJar() {
  if (!fs.existsSync(targetDir)) {
    return null;
  }

  const files = fs.readdirSync(targetDir);
  return files.find((file) => (
    file.startsWith('konvertr-') &&
    file.endsWith('.jar') &&
    !file.includes('-sources') &&
    !file.includes('-javadoc') &&
    !file.includes('-original') &&
    !file.includes('-obfuscated')
  ));
}

const jarFile = findBackendJar();
if (!jarFile) {
  console.error('ERROR: Backend JAR not found. Run "mvn clean package -DskipTests" first.');
  process.exit(1);
}

const jarPath = path.join(targetDir, jarFile);
fs.copyFileSync(jarPath, outputFile);
console.log(`✓ Backend file prepared: ${outputFile}`);

const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build');
const staticDir = path.join(__dirname, '..', 'src', 'main', 'resources', 'static');

// Copy build files to static directory
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

if (fs.existsSync(buildDir)) {
  console.log('Copying build files to static directory...');
  
  // Clear static directory (optional - comment out if you want to keep other files)
  // if (fs.existsSync(staticDir)) {
  //   fs.rmSync(staticDir, { recursive: true, force: true });
  // }
  
  copyRecursiveSync(buildDir, staticDir);
  console.log('✅ Build files copied successfully!');
} else {
  console.error('❌ Build directory not found. Run "npm run build" first.');
  process.exit(1);
}


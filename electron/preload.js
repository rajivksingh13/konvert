// Preload script for Electron
// This runs in a context that has access to both DOM and Node.js APIs
// but with security restrictions

const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process
// to use Node.js APIs safely
contextBridge.exposeInMainWorld('electronAPI', {
  // Add any Electron APIs you need to expose to React app
  platform: process.platform,
  version: process.versions.electron
});

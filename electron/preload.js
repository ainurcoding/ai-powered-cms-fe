const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Menu actions
  onNewPost: (callback) => ipcRenderer.on('menu-new-post', callback),

  // App info
  getVersion: () => process.versions,

  // Platform info
  platform: process.platform,

  // Window controls (optional)
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),

  // File operations (optional)
  selectFile: () => ipcRenderer.invoke('dialog-select-file'),
  selectFolder: () => ipcRenderer.invoke('dialog-select-folder'),

  // Notifications
  showNotification: (title, body) =>
    ipcRenderer.invoke('show-notification', { title, body }),
});

// Security: Remove node integration
window.addEventListener('DOMContentLoaded', () => {
  // Remove any node-specific code that might be in the renderer
  delete window.require;
  delete window.exports;
  delete window.module;
});

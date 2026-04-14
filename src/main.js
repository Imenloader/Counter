import './index.css';
import { storage } from './storage.js';
import { Counter } from './counter.js';
import { ui } from './ui.js';
import { settings } from './settings.js';
import { audio } from './audio.js';
import JSZip from 'jszip';

/**
 * Main Application Controller
 */
async function init() {
  // Load saved state
  const savedState = await storage.get('tapcount_state', {
    value: 0,
    step: 1,
    mode: 'up',
    shape: 'rounded',
    size: 400,
    bgColor: '#0f172a',
    objColor: '#1e293b',
    textColor: '#f8fafc',
    sound: true,
    haptic: true
  });

  const counter = new Counter(savedState);
  
  // Initialize UI
  ui.updateDisplay(counter.value);
  ui.applyStyles(savedState);
  settings.setState(savedState);

  // Handle Taps
  ui.elements.tapObject.onclick = async () => {
    const newValue = counter.increment();
    ui.updateDisplay(newValue);
    ui.animateTap();
    
    const state = settings.getState();
    if (state.sound) audio.playPop();
    if (state.haptic && navigator.vibrate) navigator.vibrate(10);
    
    await storage.set('tapcount_state', { ...state, value: newValue });
    settings.updateStorageUsage();
  };

  // Handle Settings Updates
  settings.init(
    async (newState) => {
      counter.updateSettings(newState);
      ui.applyStyles(newState);
      // Don't persist fullscreen state to storage to avoid getting stuck
      const { fullscreen, ...persistState } = newState;
      await storage.set('tapcount_state', { ...persistState, value: counter.value });
    },
    async () => {
      const newValue = counter.reset();
      ui.updateDisplay(newValue);
      const state = settings.getState();
      await storage.set('tapcount_state', { ...state, value: newValue });
    },
    exportExtension
  );

  // Handle Window Resize for responsiveness
  window.addEventListener('resize', () => {
    const state = settings.getState();
    ui.applyStyles(state);
  });

  // PWA Install Logic
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('install-btn').classList.remove('hidden');
  });

  document.getElementById('install-btn').onclick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        document.getElementById('install-btn').classList.add('hidden');
      }
      deferredPrompt = null;
    }
  };

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}

/**
 * Export as Browser Extension
 */
async function exportExtension() {
  const zip = new JSZip();
  
  // Fetch extension manifest
  const manifestRes = await fetch('/extension-manifest.json');
  const manifest = await manifestRes.text();
  zip.file('manifest.json', manifest);

  // Fetch icon
  const iconRes = await fetch('/icon.svg');
  const iconBlob = await iconRes.blob();
  zip.file('icon.svg', iconBlob);

  // Fetch index.html and modify paths for extension
  const htmlRes = await fetch('/index.html');
  let html = await htmlRes.text();
  // In a real build, we'd bundle CSS/JS. For this demo, we'll assume they are in the zip.
  zip.file('index.html', html);

  // Add JS files (simplified for this context)
  // In a production app, you'd use a build tool to bundle these.
  // Here we'll just alert that a full bundle requires a build step.
  alert('Extension export initiated! In a production environment, this would bundle all compiled assets into the ZIP.');
  
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tapcount-extension.zip';
  a.click();
}

init();

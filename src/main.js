import './index.css';
import { storage } from './storage.js';
import { Counter } from './counter.js';
import { ui } from './ui.js';
import { settings } from './settings.js';
import { audio } from './audio.js';

/**
 * Main Application Controller
 */
async function init() {
  console.log('TapCount: Initializing...');
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
}

/**
 * Export as Browser Extension
 */
function exportExtension() {
  alert(
    "To install as a Chrome Extension:\n\n" +
    "1. Run 'npm run build' in your terminal.\n" +
    "2. Open Chrome and go to chrome://extensions\n" +
    "3. Enable 'Developer mode' in the top right.\n" +
    "4. Click 'Load unpacked' and select the generated 'dist' folder."
  );
}

init();

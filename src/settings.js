/**
 * Settings Manager
 * Handles drawer interactions and control inputs
 */
export const settings = {
  elements: {
    drawer: document.getElementById('settings-drawer'),
    toggle: document.getElementById('settings-toggle'),
    toggleHeader: document.getElementById('settings-toggle-header'),
    close: document.getElementById('close-settings'),
    
    // Inputs
    stepSize: document.getElementById('step-size'),
    tapMode: document.getElementById('tap-mode'),
    shapeBtns: document.querySelectorAll('.shape-btn'),
    stepBtns: document.querySelectorAll('.step-btn'),
    objectSize: document.getElementById('object-size'),
    bgColor: document.getElementById('bg-color'),
    objColor: document.getElementById('obj-color'),
    textColor: document.getElementById('text-color'),
    soundToggle: document.getElementById('sound-toggle'),
    hapticToggle: document.getElementById('haptic-toggle'),
    
    // Actions
    resetHeaderBtn: document.getElementById('reset-counter-header'),
    exportBtn: document.getElementById('export-extension'),
    installBtn: document.getElementById('install-btn'),
    fullscreenBtn: document.getElementById('fullscreen-btn'),
    exitFullscreenBtn: document.getElementById('exit-fullscreen-btn'),
    
    // Display
    displayStep: document.getElementById('display-step'),
    displayMode: document.getElementById('display-mode'),
    storageUsage: document.getElementById('storage-usage')
  },

  init(onUpdate, onReset, onExport) {
    const toggleDrawer = () => {
      const isOpen = !this.elements.drawer.classList.contains('translate-x-full');
      if (isOpen) this.close();
      else this.open();
    };

    if (this.elements.toggle) this.elements.toggle.onclick = toggleDrawer;
    if (this.elements.toggleHeader) this.elements.toggleHeader.onclick = toggleDrawer;
    if (this.elements.close) this.elements.close.onclick = () => this.close();

    const handleChange = () => {
      const state = this.getState();
      onUpdate(state);
      this.updateDisplayInfo(state);
    };

    this.elements.stepSize.oninput = handleChange;
    this.elements.tapMode.onchange = handleChange;
    this.elements.objectSize.oninput = handleChange;
    this.elements.bgColor.oninput = handleChange;
    this.elements.objColor.oninput = handleChange;
    this.elements.textColor.oninput = handleChange;
    this.elements.soundToggle.onchange = handleChange;
    this.elements.hapticToggle.onchange = handleChange;

    this.elements.shapeBtns.forEach(btn => {
      btn.onclick = () => {
        this.selectedShape = btn.dataset.shape;
        this.updateActiveBtn(this.elements.shapeBtns, btn);
        handleChange();
      };
    });

    this.elements.stepBtns.forEach(btn => {
      btn.onclick = () => {
        this.elements.stepSize.value = btn.dataset.step;
        this.updateActiveBtn(this.elements.stepBtns, btn);
        handleChange();
      };
    });

    this.elements.resetHeaderBtn.onclick = onReset;
    this.elements.exportBtn.onclick = onExport;
    
    this.elements.fullscreenBtn.onclick = () => {
      this.close();
      onUpdate({ ...this.getState(), fullscreen: true });
    };
    
    this.elements.exitFullscreenBtn.onclick = () => {
      onUpdate({ ...this.getState(), fullscreen: false });
    };
    
    this.updateStorageUsage();
  },

  updateActiveBtn(group, activeBtn) {
    group.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  },

  updateDisplayInfo(state) {
    this.elements.displayStep.textContent = `${state.mode === 'up' ? '+' : '-'}${state.step}`;
    this.elements.displayMode.textContent = state.mode === 'up' ? 'Count Up' : 'Count Down';
  },

  updateStorageUsage() {
    const usage = (JSON.stringify(localStorage).length / 1024).toFixed(1);
    if (this.elements.storageUsage) this.elements.storageUsage.textContent = usage;
  },

  open() {
    this.elements.drawer.classList.remove('translate-x-full');
  },

  close() {
    this.elements.drawer.classList.add('translate-x-full');
  },

  getState() {
    return {
      step: parseInt(this.elements.stepSize.value),
      mode: this.elements.tapMode.value,
      shape: this.selectedShape || 'rounded',
      size: parseInt(this.elements.objectSize.value),
      bgColor: this.elements.bgColor.value,
      objColor: this.elements.objColor.value,
      textColor: this.elements.textColor.value,
      sound: this.elements.soundToggle.checked,
      haptic: this.elements.hapticToggle.checked,
      fullscreen: document.body.classList.contains('is-fullscreen')
    };
  },

  setState(state) {
    this.elements.stepSize.value = state.step;
    this.elements.tapMode.value = state.mode || 'up';
    this.selectedShape = state.shape;
    this.elements.objectSize.value = state.size;
    this.elements.bgColor.value = state.bgColor;
    this.elements.objColor.value = state.objColor;
    this.elements.textColor.value = state.textColor;
    this.elements.soundToggle.checked = state.sound;
    this.elements.hapticToggle.checked = state.haptic;

    // Update active buttons
    this.elements.shapeBtns.forEach(btn => {
      if (btn.dataset.shape === state.shape) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    this.elements.stepBtns.forEach(btn => {
      if (parseInt(btn.dataset.step) === state.step) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    this.updateDisplayInfo(state);
  }
};

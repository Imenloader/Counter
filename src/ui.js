/**
 * UI Manager
 * Handles DOM updates, animations, and scaling
 */
export const ui = {
  elements: {
    tapObject: document.getElementById('tap-object'),
    display: document.getElementById('counter-display'),
    workspace: document.getElementById('counter-workspace'),
    pulse: document.getElementById('pulse-indicator')
  },

  updateDisplay(value) {
    this.elements.display.textContent = value;
    this.scaleText();
  },

  scaleText() {
    const text = this.elements.display.textContent;
    const length = text.length;
    let fontSize = 160; // Base size for Sleek theme

    if (length > 3) fontSize = 120;
    if (length > 5) fontSize = 80;
    if (length > 8) fontSize = 60;
    if (length > 10) fontSize = 40;

    this.elements.display.style.fontSize = `${fontSize}px`;
  },

  applyStyles(styles) {
    const { shape, size, bgColor, objColor, textColor, fullscreen } = styles;
    
    // Background
    this.elements.workspace.style.backgroundColor = bgColor;
    
    // Object
    const obj = this.elements.tapObject;
    
    // Fullscreen handling
    if (fullscreen) {
      document.body.classList.add('is-fullscreen');
      document.getElementById('exit-fullscreen-btn').classList.remove('hidden');
      
      // Hide other elements
      document.querySelector('header').classList.add('hidden');
      document.querySelector('footer').classList.add('hidden');
      document.getElementById('settings-toggle').classList.add('hidden');
      
      // Make object fill screen entirely
      obj.style.width = '100vw';
      obj.style.height = '100vh';
      obj.style.borderRadius = '0';
      obj.style.borderWidth = '0';
      obj.style.boxShadow = 'none';
      
      // Remove shape classes in fullscreen to ensure it fills corners
      obj.classList.remove('rounded-none', 'rounded-[48px]', 'rounded-full');
    } else {
      document.body.classList.remove('is-fullscreen');
      document.getElementById('exit-fullscreen-btn').classList.add('hidden');
      
      // Show other elements
      document.querySelector('header').classList.remove('hidden');
      document.querySelector('footer').classList.remove('hidden');
      document.getElementById('settings-toggle').classList.remove('hidden');
      
      // Responsive sizing: ensure it doesn't exceed 90% of viewport width/height
      const maxSize = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7);
      const finalSize = Math.min(size, maxSize);

      obj.style.width = `${finalSize}px`;
      obj.style.height = `${finalSize}px`;
      obj.style.borderWidth = '2px';
      obj.style.boxShadow = ''; // Reset to CSS default
      
      // Apply shape
      obj.classList.remove('rounded-none', 'rounded-[48px]', 'rounded-full');
      if (shape === 'square') obj.classList.add('rounded-none');
      else if (shape === 'rounded') obj.classList.add('rounded-[48px]');
      else if (shape === 'circle') obj.classList.add('rounded-full');
    }

    obj.style.background = `linear-gradient(135deg, ${objColor} 0%, #0f172a 100%)`;
    obj.style.color = textColor;
    obj.style.borderColor = 'var(--color-accent)';
  },

  animateTap() {
    const obj = this.elements.tapObject;
    obj.style.transform = 'scale(0.96)';
    setTimeout(() => {
      obj.style.transform = 'scale(1)';
    }, 100);
    this.animatePulse();
  },

  animatePulse() {
    const pulse = this.elements.pulse;
    pulse.style.transition = 'none';
    pulse.style.opacity = '0.8';
    pulse.style.transform = 'scale(1)';
    
    // Force reflow
    void pulse.offsetWidth;
    
    pulse.style.transition = 'all 0.5s ease-out';
    pulse.style.opacity = '0';
    pulse.style.transform = 'scale(1.2)';
  }
};

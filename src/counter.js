/**
 * Counter Logic
 */
export class Counter {
  constructor(state) {
    this.value = state.value ?? 0;
    this.step = state.step ?? 1;
    this.mode = state.mode ?? 'up';
  }

  increment() {
    if (this.mode === 'up') {
      this.value += this.step;
    } else {
      this.value -= this.step;
    }
    return this.value;
  }

  reset() {
    this.value = 0;
    return this.value;
  }

  updateSettings(settings) {
    this.step = parseInt(settings.step) || 1;
    this.mode = settings.mode || 'up';
  }
}

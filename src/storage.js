/**
 * Storage Manager
 * Handles persistence for both PWA (localStorage) and Extension (chrome.storage)
 */
export const storage = {
  isExtension: typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local,

  async get(key, defaultValue) {
    if (this.isExtension) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key] !== undefined ? result[key] : defaultValue);
        });
      });
    }
    const value = localStorage.getItem(key);
    return value !== null ? JSON.parse(value) : defaultValue;
  },

  async set(key, value) {
    if (this.isExtension) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, resolve);
      });
    }
    localStorage.setItem(key, JSON.stringify(value));
  }
};

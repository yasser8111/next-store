import { APP_CONFIG } from './constants.js';

/**
 * LocalStorage management utilities
 */
export class StorageManager {
  static get(key) {
    try {
      const item = localStorage.getItem(`${APP_CONFIG.CART_KEY}_${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(`${APP_CONFIG.CART_KEY}_${key}`, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(`${APP_CONFIG.CART_KEY}_${key}`);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
}


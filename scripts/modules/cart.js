import { StorageManager } from '../utils/storage.js';
import { formatPrice, getImageUrl, showNotification } from '../utils/helpers.js';
import { APP_CONFIG } from '../utils/constants.js';

export class CartManager {
  static CART_KEY = 'cart';

  /**
   * Get current cart items
   */
  static getCart() {
    return StorageManager.get(this.CART_KEY) || [];
  }

  /**
   * Save cart to storage
   */
  static saveCart(cart) {
    const success = StorageManager.set(this.CART_KEY, cart);
    if (success) {
      this.updateCartUI();
    }
    return success;
  }

  /**
   * Add item to cart
   */
  static addItem(product, size, color, quantity = 1) {
    const cart = this.getCart();
    const itemId = this.generateItemId(product, size, color);

    const existingItemIndex = cart.findIndex(item => item.id === itemId);

    if (existingItemIndex > -1) {
      // Update existing item quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.push({
        id: itemId,
        productId: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        size: size,
        color: color,
        image: product.images?.[0],
        quantity: quantity,
        addedAt: new Date().toISOString()
      });
    }

    const success = this.saveCart(cart);
    if (success) {
      showNotification('تم إضافة المنتج إلى السلة بنجاح!');
    }
    
    return success;
  }

  /**
   * Update item quantity
   */
  static updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
      return this.removeItem(itemId);
    }

    const cart = this.getCart();
    const itemIndex = cart.findIndex(item => item.id === itemId);

    if (itemIndex > -1) {
      cart[itemIndex].quantity = newQuantity;
      return this.saveCart(cart);
    }

    return false;
  }

  /**
   * Remove item from cart
   */
  static removeItem(itemId) {
    const cart = this.getCart();
    const newCart = cart.filter(item => item.id !== itemId);
    const success = this.saveCart(newCart);
    
    if (success) {
      showNotification('تم حذف المنتج من السلة');
    }
    
    return success;
  }

  /**
   * Clear entire cart
   */
  static clearCart() {
    const success = StorageManager.remove(this.CART_KEY);
    if (success) {
      this.updateCartUI();
      showNotification('تم تفريغ السلة');
    }
    return success;
  }

  /**
   * Get cart total items count
   */
  static getTotalItems() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Get cart total price
   */
  static getTotalPrice() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  /**
   * Generate unique item ID
   */
  static generateItemId(product, size, color) {
    return `${product.id}_${size}_${color}`.toLowerCase().replace(/\s+/g, '_');
  }

  /**
   * Update cart UI (badge, etc.)
   */
  static updateCartUI() {
    const totalItems = this.getTotalItems();
    this.updateCartBadge(totalItems);
    
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { totalItems, cart: this.getCart() }
    }));
  }

  /**
   * Update cart badge in navigation
   */
  static updateCartBadge(totalItems) {
    const cartElements = document.querySelectorAll('.cart-btn, .cart-linke, [data-cart-badge]');
    
    cartElements.forEach(element => {
      let badge = element.querySelector('.cart-count');
      
      if (totalItems > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'cart-count';
          element.appendChild(badge);
        }
        badge.textContent = totalItems > 99 ? '99+' : totalItems;
      } else if (badge) {
        badge.remove();
      }
    });
  }

  /**
   * Get cart summary for checkout
   */
  static getCartSummary() {
    const cart = this.getCart();
    const subtotal = this.getTotalPrice();
    const currency = cart[0]?.currency || APP_CONFIG.CURRENCY;
    
    // Calculate discount (10% for orders over 30,000)
    const discountThreshold = currency === 'YER' ? 30000 : 200;
    const discountRate = subtotal > discountThreshold ? 0.1 : 0;
    const discountAmount = subtotal * discountRate;
    const total = subtotal - discountAmount;

    return {
      items: cart,
      subtotal,
      discount: {
        rate: discountRate,
        amount: discountAmount,
        threshold: discountThreshold
      },
      total,
      currency,
      itemCount: this.getTotalItems()
    };
  }
}

// Initialize cart UI when module loads
document.addEventListener('DOMContentLoaded', () => {
  CartManager.updateCartUI();
});
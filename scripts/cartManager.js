// cartManager.js - إدارة السلة بشكل مركزي
import { showNotification, updateCartIcon } from "./script.js";
import { ProductUtils } from "./productUtils.js";

export const CartManager = {
  addToCart(product, selectedSize = null, selectedColor = null) {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      
      // التحقق من حالة المنتج
      if (product.status !== 'available') {
        showNotification(`هذا المنتج ${ProductUtils.getProductStatus(product.status).text}`, "error");
        return false;
      }

      const existingItemIndex = cart.findIndex(
        item => item.productId === product.id && 
                item.size === selectedSize && 
                item.color === selectedColor
      );

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
        showNotification("تم زيادة كمية المنتج في السلة", "success");
      } else {
        cart.push({
          productId: product.id,
          name: product.name,
          price: product.price || 0,
          image: ProductUtils.getImageUrl(product.images?.[0]),
          quantity: 1,
          size: selectedSize,
          color: selectedColor,
          status: product.status
        });
        showNotification("تم إضافة المنتج إلى السلة", "success");
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartIcon();
      return true;
    } catch (error) {
      console.error("خطأ في إضافة المنتج إلى السلة:", error);
      showNotification("حدث خطأ أثناء إضافة المنتج إلى السلة", "error");
      return false;
    }
  },

  removeFromCart(productId, size = null, color = null) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const newCart = cart.filter(item => 
      !(item.productId === productId && 
        item.size === size && 
        item.color === color)
    );
    localStorage.setItem("cart", JSON.stringify(newCart));
    updateCartIcon();
  },

  getCartItems() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  },

  clearCart() {
    localStorage.setItem("cart", "[]");
    updateCartIcon();
  }
};

// جعل الدالة متاحة عالمياً
window.addToCart = CartManager.addToCart;
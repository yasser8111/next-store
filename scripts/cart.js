// cart.js
import { showNotification, updateCartIcon } from "./script.js";
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

class CartManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("cart")) || [];
    this.discountThreshold = 30000;
    this.discountRate = 0.1;
    this.similarProducts = [];

    this.init();
    this.setupGlobalListeners();
  }

  init() {
    this.renderCart();
    this.setupEventListeners();
    this.loadSimilarProducts();
    this.updateCartIcon(); // تحديث العداد عند التهيئة
  }

  setupGlobalListeners() {
    window.addEventListener("storage", (e) => {
      if (e.key === "cart") {
        this.cart = JSON.parse(e.newValue || "[]");
        this.renderCart();
        this.updateCartIcon(); // تحديث العداد
      }
    });

    window.addEventListener("cartUpdated", () => {
      this.cart = JSON.parse(localStorage.getItem("cart")) || [];
      this.renderCart();
      this.updateCartIcon(); // تحديث العداد
    });

    window.addEventListener("focus", () => {
      const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (JSON.stringify(currentCart) !== JSON.stringify(this.cart)) {
        this.cart = currentCart;
        this.renderCart();
        this.updateCartIcon(); // تحديث العداد
      }
    });

    this.setupPeriodicUpdate();
  }

  setupPeriodicUpdate() {
    setInterval(() => {
      const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (JSON.stringify(currentCart) !== JSON.stringify(this.cart)) {
        this.cart = currentCart;
        this.renderCart();
        this.updateCartIcon(); // تحديث العداد
      }
    }, 2000);
  }

  renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const emptyCartElement = document.getElementById("empty-cart");

    if (!cartItemsContainer) return;

    if (this.cart.length === 0) {
      this.showEmptyState(cartItemsContainer, emptyCartElement);
      return;
    }

    this.hideEmptyState(emptyCartElement);
    this.renderCartItems(cartItemsContainer);
    this.updateCartSummary();
  }

  showEmptyState(container, emptyElement) {
    if (!emptyElement) return;

    emptyElement.style.display = "block";
    container.innerHTML = "";
    container.appendChild(emptyElement);
    this.updateSummary(0, 0, 0);

    const similarSection = document.getElementById("similar-products-section");
    if (similarSection) {
      similarSection.style.display = "none";
    }
  }

  hideEmptyState(emptyElement) {
    if (emptyElement) {
      emptyElement.style.display = "none";
    }
  }

  renderCartItems(container) {
    container.innerHTML = this.cart
      .map(
        (item, index) => `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-image">
                    <img src="${this.getImageUrl(
                      item.image
                    )}" alt="${this.escapeHtml(item.name)}" 
                         onerror="this.src='./imgs/placeholder.webp'">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${this.escapeHtml(
                      item.name
                    )}</h3>
                    <div class="cart-item-meta">
                        ${
                          item.size
                            ? `<span>المقاس: ${this.escapeHtml(
                                item.size
                              )}</span>`
                            : ""
                        }
                        ${
                          item.color
                            ? `<span>اللون: ${this.escapeHtml(
                                item.color
                              )}</span>`
                            : ""
                        }
                    </div>
                    <div class="cart-item-price">${this.formatPrice(
                      item.price
                    )} ر.ي</div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease-btn" onclick="cartManager.decreaseQuantity(${index})">
                                <i class="fa-solid fa-minus"></i>
                            </button>
                            <span class="quantity-display">${
                              item.quantity
                            }</span>
                            <button class="quantity-btn increase-btn" onclick="cartManager.increaseQuantity(${index})">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-btn" onclick="cartManager.removeItem(${index})">
                            <i class="fa-solid fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
            </div>
        `
      )
      .join("");

    const similarSection = document.getElementById("similar-products-section");
    if (similarSection) {
      similarSection.style.display = "block";
    }
  }

  async loadSimilarProducts() {
    try {
      if (this.cart.length === 0) return;

      const productsRef = collection(db, "products");
      const q = query(productsRef, limit(4));
      const snapshot = await getDocs(q);

      this.similarProducts = [];
      snapshot.forEach((doc) => {
        const product = { id: doc.id, ...doc.data() };
        if (!this.cart.some((item) => item.productId === product.id)) {
          this.similarProducts.push(product);
        }
      });

      this.renderSimilarProducts();
    } catch (error) {
      console.error("خطأ في تحميل المنتجات المتشابهة:", error);
    }
  }

  renderSimilarProducts() {
    const container = document.getElementById("similar-products");
    if (!container) return;

    if (this.similarProducts.length === 0) {
      container.innerHTML =
        '<p class="no-similar-products">لا توجد منتجات مشابهة متاحة</p>';
      return;
    }

    container.innerHTML = this.similarProducts
      .map(
        (product) => `
            <div class="similar-product" data-id="${product.id}">
                <div class="similar-product-image">
                    <img src="${this.getImageUrl(product.images?.[0])}" 
                         alt="${this.escapeHtml(product.name)}"
                         onerror="this.src='./imgs/placeholder.webp'">
                </div>
                <div class="similar-product-details">
                    <h4 class="similar-product-name">${this.escapeHtml(
                      product.name
                    )}</h4>
                    <div class="similar-product-price">${this.formatPrice(
                      product.price
                    )} ر.ي</div>
                    <button class="add-similar-btn" onclick="cartManager.addSimilarToCart('${
                      product.id
                    }')">
                        <i class="fa-solid fa-plus"></i>
                        إضافة إلى السلة
                    </button>
                </div>
            </div>
        `
      )
      .join("");
  }

  async addSimilarToCart(productId) {
    try {
      const { doc, getDoc } = await import(
        "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js"
      );
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const product = productSnap.data();
        const existingItemIndex = this.findExistingItem(productId, null, null);

        if (existingItemIndex !== -1) {
          this.cart[existingItemIndex].quantity += 1;
          showNotification("تم زيادة كمية المنتج في السلة", "success");
        } else {
          const cartItem = {
            productId: productId,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || "placeholder.webp",
            quantity: 1,
            size: null,
            color: null,
          };
          this.cart.push(cartItem);
          showNotification("تمت إضافة المنتج إلى السلة", "success");
        }

        this.saveCart();
        this.renderCart();
        this.loadSimilarProducts();
      }
    } catch (error) {
      console.error("خطأ في إضافة المنتج المشابه:", error);
      showNotification("حدث خطأ أثناء إضافة المنتج", "error");
    }
  }

  findExistingItem(productId, size, color) {
    return this.cart.findIndex(
      (item) =>
        item.productId === productId &&
        item.size === size &&
        item.color === color
    );
  }

  addToCart(productData, size = null, color = null) {
    const existingItemIndex = this.findExistingItem(
      productData.id,
      size,
      color
    );

    if (existingItemIndex !== -1) {
      this.cart[existingItemIndex].quantity += 1;
      showNotification("تم زيادة كمية المنتج في السلة", "success");
    } else {
      const cartItem = {
        productId: productData.id,
        name: productData.name,
        price: productData.price,
        image: productData.images?.[0] || "placeholder.webp",
        quantity: 1,
        size: size,
        color: color,
      };
      this.cart.push(cartItem);
      showNotification("تمت إضافة المنتج إلى السلة", "success");
    }

    this.saveCart();
    this.renderCart();
    this.loadSimilarProducts();
    this.triggerCartUpdate();
  }

  triggerCartUpdate() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
    window.dispatchEvent(new CustomEvent("cartUpdated"));
    this.updateCartIcon(); // تحديث العداد
  }

  updateCartSummary() {
    const subtotal = this.calculateSubtotal();
    const discount = this.calculateDiscount(subtotal);
    const total = subtotal - discount;

    this.updateSummary(subtotal, discount, total);
    this.updateDiscountMessages(subtotal);
  }

  calculateSubtotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  calculateDiscount(subtotal) {
    return subtotal >= this.discountThreshold
      ? subtotal * this.discountRate
      : 0;
  }

  updateSummary(subtotal, discount, total) {
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");
    const discountInfo = document.getElementById("discount-info");
    const discountAmount = document.getElementById("discount-amount");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (subtotalEl)
      subtotalEl.textContent = `${this.formatPrice(subtotal)} ر.ي`;
    if (totalEl) totalEl.textContent = `${this.formatPrice(total)} ر.ي`;

    if (discount > 0) {
      if (discountInfo) discountInfo.style.display = "flex";
      if (discountAmount)
        discountAmount.textContent = `-${this.formatPrice(discount)} ر.ي`;
    } else {
      if (discountInfo) discountInfo.style.display = "none";
    }

    if (checkoutBtn) {
      checkoutBtn.disabled = this.cart.length === 0;
    }
  }

  updateDiscountMessages(subtotal) {
    const discountMessage = document.getElementById("discount-message");
    const remainingMessage = document.getElementById("remaining-message");
    const remainingAmount = document.getElementById("remaining-amount");

    if (subtotal >= this.discountThreshold) {
      if (discountMessage) discountMessage.style.display = "flex";
      if (remainingMessage) remainingMessage.style.display = "none";
    } else {
      if (discountMessage) discountMessage.style.display = "none";
      if (remainingMessage) remainingMessage.style.display = "flex";
      if (remainingAmount) {
        const remaining = this.discountThreshold - subtotal;
        remainingAmount.textContent = `${this.formatPrice(remaining)} ر.ي`;
      }
    }
  }

  increaseQuantity(index) {
    if (index >= 0 && index < this.cart.length) {
      this.cart[index].quantity += 1;
      this.saveCart();
      this.renderCart();
      // showNotification("تم تحديث الكمية", "success");
    }
  }

  decreaseQuantity(index) {
    if (index >= 0 && index < this.cart.length) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity -= 1;
        this.saveCart();
        this.renderCart();
      } else {
        this.removeItem(index);
      }
    }
  }

  removeItem(index) {
    if (index >= 0 && index < this.cart.length) {
      const itemName = this.cart[index].name;
      this.cart.splice(index, 1);
      this.saveCart();
      showNotification(`تم حذف ${itemName} من السلة`, "success");
      this.renderCart();
      this.loadSimilarProducts();
      renderCart();
    }
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
    this.renderCart();
    showNotification("تم تفريغ سلة التسوق", "success");
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.triggerCartUpdate();
  }

  // 🔄 تحديث العداد في الهيدر
  updateCartIcon() {
    if (typeof updateCartIcon === "function") {
      updateCartIcon();
    } else {
      // الطريقة الاحتياطية إذا لم تكن الدالة متاحة
      const cartIcons = document.querySelectorAll(".cart-icon");
      const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);

      cartIcons.forEach((cartIcon) => {
        let counter = cartIcon.querySelector(".cart-counter");

        if (count > 0) {
          if (!counter) {
            counter = document.createElement("span");
            counter.className = "cart-counter";
            cartIcon.appendChild(counter);
          }
          counter.textContent = count;
        } else if (counter) {
          counter.remove();
        }
      });
    }
  }

  checkout() {
    if (this.cart.length === 0) {
      showNotification("سلة التسوق فارغة", "error");
      return;
    }
    window.location.href = "./checkout.html";
  }

  getImageUrl(image) {
    if (!image) return "./imgs/placeholder.webp";
    if (image.startsWith("http")) return image;
    return `https://res.cloudinary.com/dxbelrmq1/image/upload/${image}`;
  }

  formatPrice(price) {
    if (price === undefined || price === null) return "0";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  escapeHtml(text = "") {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  setupEventListeners() {
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => this.checkout());
    }
  }
}

// دالة عالمية يمكن استدعاؤها من أي صفحة
window.addToCart = function (productData, size = null, color = null) {
  if (window.cartManager) {
    window.cartManager.addToCart(productData, size, color);
  } else {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.productId === productData.id &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        productId: productData.id,
        name: productData.name,
        price: productData.price,
        image: productData.images?.[0] || "placeholder.webp",
        quantity: 1,
        size: size,
        color: color,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cartUpdated"));

    // تحديث العداد
    if (typeof updateCartIcon === "function") {
      updateCartIcon();
    }

    showNotification("تمت إضافة المنتج إلى السلة", "success");
  }
};

// تهيئة مدير السلة عند تحميل الصفحة
let cartManager;
document.addEventListener("DOMContentLoaded", () => {
  cartManager = new CartManager();
  window.cartManager = cartManager;
});

// تحديث السلة عند العودة إلى الصفحة
document.addEventListener("visibilitychange", function () {
  if (!document.hidden && window.cartManager) {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (
      JSON.stringify(currentCart) !== JSON.stringify(window.cartManager.cart)
    ) {
      window.cartManager.cart = currentCart;
      window.cartManager.renderCart();
      window.cartManager.updateCartIcon(); // تحديث العداد
    }
  }
});

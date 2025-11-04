import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { showNotification, updateCartIcon } from "./script.js";
import { ProductUtils } from "./productUtils.js";

// تعريف العناصر
const SELECTORS = {
  grid: "products-grid",
  searchInput: "search-products",
  searchBtn: ".search-btn",
  loading: "products-loading"
};

class ProductManager {
  constructor() {
    this.currentProducts = [];
    this.init();
  }

  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.loadProducts();
  }

  cacheElements() {
    this.elements = {
      grid: document.getElementById(SELECTORS.grid),
      searchInput: document.getElementById(SELECTORS.searchInput),
      searchBtn: document.querySelector(SELECTORS.searchBtn),
      loading: document.getElementById(SELECTORS.loading)
    };
  }

  setupEventListeners() {
    // أحداث البحث
    this.elements.searchBtn?.addEventListener("click", () => {
      this.handleSearch();
    });

    this.elements.searchInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleSearch();
      }
    });

    this.elements.searchInput?.addEventListener("input", (e) => {
      this.handleSearchInput(e);
    });
  }

  async loadProducts() {
    this.showLoading();
    
    try {
      // جلب جميع المنتجات مع فلترة بالحالة
      const colRef = query(
        collection(db, "products"),
        where("status", "in", ["available", "pre_order", "coming_soon"])
      );

      const snapshot = await getDocs(colRef);
      this.currentProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      this.render(this.currentProducts);
      this.hideLoading();
    } catch (err) {
      console.error("خطأ في تحميل المنتجات:", err);
      showNotification("حدث خطأ أثناء تحميل المنتجات", "error");
      this.hideLoading();
    }
  }

  searchProducts(searchTerm) {
    if (!searchTerm.trim()) {
      this.render(this.currentProducts);
      return;
    }

    const filteredProducts = this.currentProducts.filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.material?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.origin?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.render(filteredProducts);
  }

  render(products) {
    if (!this.elements.grid) return;

    this.elements.grid.innerHTML = "";

    if (!products || products.length === 0) {
      this.elements.grid.innerHTML = this.getNoProductsHTML();
      return;
    }

    // فرز المنتجات: المتاحة أولاً، ثم طلب مسبق، ثم قريباً
    const sortedProducts = this.sortProductsByStatus(products);

    const fragment = document.createDocumentFragment();
    
    sortedProducts.forEach(product => {
      const card = this.createProductCard(product);
      fragment.appendChild(card);
    });

    this.elements.grid.appendChild(fragment);
  }

  sortProductsByStatus(products) {
    const statusOrder = {
      'available': 1,
      'pre_order': 2,
      'coming_soon': 3,
      'out_of_stock': 4,
      'discontinued': 5
    };

    return products.sort((a, b) => {
      const statusA = statusOrder[a.status] || 6;
      const statusB = statusOrder[b.status] || 6;
      return statusA - statusB;
    });
  }

  createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.productId = product.id;

    const statusInfo = ProductUtils.getProductStatus(product.status);
    const isAvailable = product.status === 'available';
    const isPreOrder = product.status === 'pre_order';
    const isComingSoon = product.status === 'coming_soon';

    card.innerHTML = `
      <div class="product-card-inner">
        <div class="pro-img">
          <a href="#" class="product-link">
            <img src="${ProductUtils.getImageUrl(product.images?.[0])}" 
                 alt="${ProductUtils.escapeHtml(product.name)}" 
                 loading="lazy"
                 onerror="this.src='./imgs/placeholder.webp'">
            <div class="product-status ${statusInfo.class}">
              ${statusInfo.icon} ${statusInfo.text}
            </div>
            ${isPreOrder ? `<div class="product-badge pre-order-badge">طلب مسبق</div>` : ''}
            ${isComingSoon ? `<div class="product-badge coming-soon-badge">قريباً</div>` : ''}
          </a>
        </div>
        
        <div class="pro-ditals">
          <div class="pro-name">${ProductUtils.escapeHtml(product.name)}</div>
          <div class="pro-price">${ProductUtils.formatPrice(product.price)} ر.ي</div>
          <div class="pro-description">${ProductUtils.escapeHtml(product.description || "لا يوجد وصف متاح")}</div>
          
          ${isAvailable ? `
            <button class="add-to-cart-btn btn-primary" data-product-id="${product.id}">
              إضافة إلى السلة
            </button>
          ` : isPreOrder ? `
            <button class="pre-order-btn btn-secondary" data-product-id="${product.id}">
              طلب مسبق
            </button>
          ` : isComingSoon ? `
            <button class="coming-soon-btn btn-disabled" disabled>
              قريباً في المتجر
            </button>
          ` : `
            <button class="out-of-stock-btn btn-disabled" disabled>
              غير متوفر
            </button>
          `}
        </div>
      </div>
    `;

    this.attachCardEvents(card, product);
    return card;
  }

  attachCardEvents(card, product) {
    const link = card.querySelector(".product-link");
    const addBtn = card.querySelector(".add-to-cart-btn");
    const preOrderBtn = card.querySelector(".pre-order-btn");

    link?.addEventListener("click", (e) => {
      e.preventDefault();
      this.navigateToProductDetails(product);
    });

    addBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.addToCart(product);
    });

    preOrderBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.handlePreOrder(product);
    });
  }

  navigateToProductDetails(product) {
    try {
      localStorage.setItem("selectedProduct", JSON.stringify(product));
      window.location.href = `product-details.html?id=${product.id}`;
    } catch (err) {
      console.error("خطأ في الانتقال لصفحة المنتج:", err);
      window.location.href = `product-details.html?id=${product.id}`;
    }
  }

  addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = cart.findIndex(
      item => item.productId === product.id && item.size === null && item.color === null
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
      showNotification("تم زيادة كمية المنتج في السلة", "success");
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: ProductUtils.getImageUrl(product.images?.[0]),
        quantity: 1,
        size: null,
        color: null,
        status: product.status
      });
      showNotification("تم إضافة المنتج إلى السلة", "success");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartIcon?.();
  }

  handlePreOrder(product) {
    showNotification(`تم إضافة طلبك المسبق لـ ${product.name}`, "info");
    // هنا يمكنك إضافة منطق خاص بالطلب المسبق
    console.log("طلب مسبق للمنتج:", product);
  }

  getNoProductsHTML() {
    return `
      <div class="no-products">
        <i class="fa-solid fa-shirt"></i>
        <h3>لا توجد منتجات</h3>
        <p>لم نتمكن من العثور على أي منتج يتطابق مع بحثك</p>
      </div>
    `;
  }

  handleSearch() {
    const searchTerm = this.elements.searchInput?.value || "";
    this.searchProducts(searchTerm);
  }

  handleSearchInput(e) {
    const searchTerm = e.target.value;
    if (searchTerm.length === 0 || searchTerm.length >= 2) {
      this.searchProducts(searchTerm);
    }
  }

  showLoading() {
    if (this.elements.loading) {
      this.elements.loading.style.display = "block";
    }
  }

  hideLoading() {
    if (this.elements.loading) {
      this.elements.loading.style.display = "none";
    }
  }
}

// إنشاء وإدارة instance واحدة
let productManagerInstance = null;

const getProductManager = () => {
  if (!productManagerInstance) {
    productManagerInstance = new ProductManager();
  }
  return productManagerInstance;
};

// التهيئة عند تحميل DOM
document.addEventListener("DOMContentLoaded", () => {
  getProductManager();
});

// التصدير للاستخدام في ملفات أخرى
export { getProductManager };
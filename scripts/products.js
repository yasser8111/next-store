import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { showNotification, updateCartIcon } from "./script.js";
import { ProductUtils } from "./productUtils.js";
import { CartManager } from "./cartManager.js";

// تعريف العناصر مرة واحدة فقط
const SELECTORS = {
  grid: "products-grid",
  searchInput: "search-products",
  searchBtn: ".search-btn",
  headerButtons: ".products-header button",
  loading: "products-loading",
};

class ProductManager {
  constructor() {
    this.currentProducts = [];
    this.filters = {
      all: "all",
      new: "new",
      bestseller: "bestseller",
    };
    this.init();
  }

  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.load("all");
  }

  cacheElements() {
    this.elements = {
      grid: document.getElementById(SELECTORS.grid),
      searchInput: document.getElementById(SELECTORS.searchInput),
      searchBtn: document.querySelector(SELECTORS.searchBtn),
      headerButtons: document.querySelectorAll(SELECTORS.headerButtons),
      loading: document.getElementById(SELECTORS.loading),
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

    // أحداث الفلتر
    this.elements.headerButtons.forEach((btn) => {
      this.setupFilterButton(btn);
    });
  }

  setupFilterButton(btn) {
    const onclickAttr = btn.getAttribute("onclick") || "";
    const match = onclickAttr.match(/filterProducts\(['"](.+?)['"]/);
    if (match) btn.dataset.filter = match[1];

    btn.addEventListener("click", (e) => {
      const type = btn.dataset.filter || "all";
      this.filterProducts(type, e);
    });
  }

  async load(filter = "all") {
    this.showLoading();

    try {
      let colRef = collection(db, "products");
      let queryConstraints = [];

      // إضافة الفلاتر
      if (filter === this.filters.new) {
        queryConstraints.push(where("isNew", "==", true));
      } else if (filter === this.filters.bestseller) {
        queryConstraints.push(where("isBestseller", "==", true));
      }

      // إضافة فلتر الحالة ليشمل المنتجات المتاحة، طلب مسبق، والقادمة قريباً
      queryConstraints.push(
        where("status", "in", ["available", "pre_order", "coming-soon"])
      );

      if (queryConstraints.length > 0) {
        colRef = query(colRef, ...queryConstraints);
      }

      const snapshot = await getDocs(colRef);
      this.currentProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
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

    const filteredProducts = this.currentProducts.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.material?.toLowerCase().includes(searchTerm.toLowerCase())
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

    const fragment = document.createDocumentFragment();

    products.forEach((product) => {
      const card = this.createProductCard(product);
      fragment.appendChild(card);
    });

    this.elements.grid.appendChild(fragment);
  }

  createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.productId = product.id;
    const statusInfo = ProductUtils.getProductStatus(product.status);
    const isComingSoon = product.status === "coming-soon";

    // تحديد نص السعر بناءً على حالة المنتج
    const priceText = isComingSoon
      ? "قريباً"
      : `${ProductUtils.formatPrice(product.price)} ر.ي`;

    card.innerHTML = `
    <div class="product-card-inner">
      <div class="pro-img">
        <a href="#" class="product-link">
          <img src="${ProductUtils.getImageUrl(product.images?.[0])}" 
               alt="${ProductUtils.escapeHtml(product.name)}" 
               loading="lazy"
               onerror="this.src='./imgs/placeholder.webp'">
          <div class="product-status ${statusInfo.class}">
            ${statusInfo.text}
          </div>
          ${
            isComingSoon
              ? `<div class="product-badge coming-soon-badge">قريباً</div>`
              : ""
          }
        </a>
      </div>
      
      <div class="pro-ditals">
        <div class="pro-name">${ProductUtils.escapeHtml(product.name)}</div>
        <div class="pro-price ${
          isComingSoon ? "coming-soon-price" : ""
        }">${priceText}</div>
        <div class="pro-description">${ProductUtils.escapeHtml(
          product.description || "لا يوجد وصف متاح"
        )}</div>
      </div>
    </div>
  `;

    this.attachCardEvents(card, product);
    return card;
  }

  attachCardEvents(card, product) {
    const link = card.querySelector(".product-link");

    link?.addEventListener("click", (e) => {
      e.preventDefault();
      this.navigateToProductDetails(product);
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

  filterProducts(type, event) {
    this.load(type);

    if (event?.currentTarget) {
      this.elements.headerButtons.forEach((btn) =>
        btn.classList.remove("active")
      );
      event.currentTarget.classList.add("active");
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

let productManagerInstance = null;

const getProductManager = () => {
  if (!productManagerInstance) {
    productManagerInstance = new ProductManager();
  }
  return productManagerInstance;
};

window.filterProducts = (type, event) => {
  const manager = getProductManager();
  manager.filterProducts(type, event);
};

document.addEventListener("DOMContentLoaded", () => {
  getProductManager();
});

export { getProductManager };

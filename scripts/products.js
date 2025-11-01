import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { showNotification, updateCartIcon } from "./script.js";

const elements = {
  grid: document.getElementById("products-grid"),
  searchInput: document.getElementById("search-products"),
  searchBtn: document.querySelector(".search-btn"),
  headerButtons: document.querySelectorAll(".products-header button")
};

const ProductManager = {
  currentProducts: [],

  async load(filter = "all") {
    try {
      let colRef = collection(db, "products");

      if (filter === "new") {
        colRef = query(colRef, where("isNew", "==", true));
      } else if (filter === "bestseller") {
        colRef = query(colRef, where("isBestseller", "==", true));
      }

      const snapshot = await getDocs(colRef);
      this.currentProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      this.render(this.currentProducts);
    } catch (err) {
      console.error("خطأ في تحميل المنتجات:", err);
      showNotification("حدث خطأ أثناء تحميل المنتجات", "error");
    }
  },

  searchProducts(searchTerm) {
    if (!searchTerm.trim()) {
      this.render(this.currentProducts);
      return;
    }

    const filteredProducts = this.currentProducts.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.render(filteredProducts);
  },

  render(products) {
    const grid = elements.grid;
    if (!grid) return;

    grid.innerHTML = "";

    if (!products || products.length === 0) {
      grid.innerHTML = `
        <div class="no-products">
          <i class="fa-solid fa-shirt"></i>
          <h3>لا توجد منتجات</h3>
          <p>لم نتمكن من العثور على أي منتج يتطابق مع بحثك</p>
        </div>
      `;
      return;
    }

    products.forEach((product) => {
      const card = this.createCard(product.id, product);
      grid.appendChild(card);
    });
  },

  createCard(id, product) {
    const card = document.createElement("div");
    card.className = "product-card";

    const data = {
      id,
      name: product.name || "",
      price: product.price || 0,
      description: product.description || "",
      images: product.images || [],
      material: product.material || "",
      care: product.care || "",
      origin: product.origin || "",
      sizes: product.sizes || [],
      colors: product.colors || []
    };

    card.innerHTML = `
      <div class="pro-img">
        <a href="#" class="product-link">
          <img src="${this.getImageUrl(data.images[0])}" alt="${this.escapeHtml(
      data.name
    )}" 
               loading="lazy" onerror="this.src='./imgs/placeholder.webp'">
        </a>
      </div>
      <div class="pro-ditals">
        <div class="pro-name">${this.escapeHtml(data.name)}</div>
        <div class="pro-price">${this.formatPrice(data.price)} ر.ي</div>
        <button class="add-to-cart">إضافة إلى السلة</button>
      </div>
    `;

    this.attachCardEvents(card, data, id);
    return card;
  },

  attachCardEvents(card, data, id) {
    const link = card.querySelector(".product-link");
    const addBtn = card.querySelector(".add-to-cart");

    link?.addEventListener("click", (e) => {
      e.preventDefault();
      this.navigateToProductDetails(data, id);
    });

    addBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.addToCart(data);
    });
  },

  navigateToProductDetails(data, id) {
    try {
      localStorage.setItem("selectedProduct", JSON.stringify(data));
      localStorage.setItem("lastProductId", id);
      window.location.href = "product-details.html";
    } catch (err) {
      window.location.href = `product-details.html?id=${id}`;
    }
  },

  addToCart(productData) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.productId === productData.id &&
        item.size === null &&
        item.color === null
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
      showNotification("تم زيادة كمية المنتج في السلة", "success");
    } else {
      cart.push({
        productId: productData.id,
        name: productData.name,
        price: productData.price,
        image: productData.images[0] || "placeholder.webp",
        quantity: 1,
        size: null,
        color: null
      });
      showNotification("تم إضافة المنتج إلى السلة", "success");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartIcon?.();
  },

  getImageUrl(image) {
    if (!image) return "./imgs/placeholder.webp";
    if (image.startsWith("http")) return image;
    return `https://res.cloudinary.com/dxbelrmq1/image/upload/${image}`;
  },

  formatPrice(price) {
    return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
  },

  escapeHtml(text = "") {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
};

window.filterProducts = (type, event) => {
  ProductManager.load(type);
  if (event?.currentTarget) {
    elements.headerButtons.forEach((btn) => btn.classList.remove("active"));
    event.currentTarget.classList.add("active");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // حدث شريط البحث
  elements.searchBtn?.addEventListener("click", () => {
    const searchTerm = elements.searchInput.value;
    ProductManager.searchProducts(searchTerm);
  });

  elements.searchInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchTerm = elements.searchInput.value;
      ProductManager.searchProducts(searchTerm);
    }
  });

  elements.searchInput?.addEventListener("input", (e) => {
    // بحث فوري أثناء الكتابة
    const searchTerm = e.target.value;
    if (searchTerm.length === 0 || searchTerm.length >= 2) {
      ProductManager.searchProducts(searchTerm);
    }
  });

  // أحداث الفلتر الأساسي
  elements.headerButtons.forEach((btn) => {
    const onclickAttr = btn.getAttribute("onclick") || "";
    const match = onclickAttr.match(/filterProducts\(['"](.+?)['"]/);
    if (match) btn.dataset.filter = match[1];

    btn.addEventListener("click", (e) => {
      const type = btn.dataset.filter || "all";
      window.filterProducts(type, e);
    });
  });

  // تحميل المنتجات الأولي
  ProductManager.load("all");
});
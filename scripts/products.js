import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { showNotification, updateCartIcon } from "./script.js";

const elements = {
  loading: document.getElementById("loading"),
  grid: document.getElementById("products-grid"),
  headerButtons: document.querySelectorAll(".products-header button"),
};

const ProductManager = {
  async load(filter = "all") {
    try {
      this.showLoading();
      let colRef = collection(db, "products");

      if (filter === "new") {
        colRef = query(colRef, where("isNew", "==", true));
      } else if (filter === "bestseller") {
        colRef = query(colRef, where("isBestseller", "==", true));
      }

      const snapshot = await getDocs(colRef);
      this.render(snapshot);
    } catch (err) {
      console.error("خطأ في تحميل المنتجات:", err);
      showNotification("حدث خطأ أثناء تحميل المنتجات", "error");
    } finally {
      this.hideLoading();
    }
  },
  showLoading() {
    if (elements.loading) elements.loading.style.display = "block";
  },
  hideLoading() {
    if (elements.loading) elements.loading.style.display = "none";
  },
  render(snapshot) {
    const grid = elements.grid;
    if (!grid) return;
    grid.innerHTML = "";
    if (!snapshot || snapshot.empty) {
      grid.innerHTML = "<p style='text-align:center; padding: 2rem;'>لا توجد منتجات متاحة حالياً</p>";
      return;
    }
    snapshot.forEach((doc) => {
      const product = doc.data();
      const id = doc.id;
      const card = this.createCard(id, product);
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
      colors: product.colors || [],
    };

    card.innerHTML = `
      <div class="pro-img">
        <i class="fa-regular fa-heart favorite-btn"></i>
        <a href="#" class="product-link">
          <img src="${this.getImageUrl(data.images[0])}" alt="${this.escapeHtml(
      data.name
    )}" loading="lazy" onerror="this.src='./imgs/placeholder.webp'">
        </a>
      </div>
      <div class="pro-ditals">
        <div class="pro-name">${this.escapeHtml(data.name)}</div>
        <div class="pro-price">${this.formatPrice(data.price)} ر.ي</div>
        <button class="add-to-cart">إضافة إلى السلة</button>
      </div>
    `;
    
    const link = card.querySelector(".product-link");
    if (link) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        try {
          localStorage.setItem("selectedProduct", JSON.stringify(data));
          localStorage.setItem("lastProductId", id);
          window.location.href = "product-details.html";
        } catch (err) {
          console.error("خطأ في حفظ المنتج محلياً:", err);
          window.location.href = `product-details.html?id=${id}`;
        }
      });
    }

    const heart = card.querySelector(".favorite-btn");
    if (heart) {
      heart.addEventListener("click", (e) => {
        e.target.classList.toggle("fa-regular");
        e.target.classList.toggle("fa-solid");
        e.target.classList.toggle("active");
      });
    }

    const addBtn = card.querySelector(".add-to-cart");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const productData = {
          id: data.id,
          name: data.name,
          price: data.price,
          images: data.images,
        };

        // استخدام الدالة الموحدة لإضافة المنتج
        if (window.addToCart) {
          window.addToCart(productData, null, null);
        } else {
          // الطريقة الاحتياطية
          const cart = JSON.parse(localStorage.getItem("cart") || "[]");
          const existingItemIndex = cart.findIndex(
            (item) =>
              item.productId === data.id &&
              item.size === null &&
              item.color === null
          );

          if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
            showNotification("تم زيادة كمية المنتج في السلة", "success");
          } else {
            cart.push({
              productId: data.id,
              name: data.name,
              price: data.price,
              image: data.images[0] || "placeholder.webp",
              quantity: 1,
              size: null,
              color: null,
            });
            showNotification("تم إضافة المنتج إلى السلة", "success");
          }
          localStorage.setItem("cart", JSON.stringify(cart));
        }

        if (typeof updateCartIcon === "function") updateCartIcon();
      });
    }

    return card;
  },

  getImageUrl(image) {
    if (!image) return "./imgs/placeholder.webp";
    if (image.startsWith("http")) return image;
    return `https://res.cloudinary.com/dxbelrmq1/image/upload/${image}`;
  },

  formatPrice(price) {
    if (price === undefined || price === null) return "0";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  escapeHtml(text = "") {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },
};

const UI = {
  filter(type, event) {
    ProductManager.load(type);
    if (event && event.currentTarget) {
      elements.headerButtons.forEach((b) => b.classList.remove("active"));
      event.currentTarget.classList.add("active");
    } else if (event && event.target) {
      // fallback
      elements.headerButtons.forEach((b) => b.classList.remove("active"));
      event.target.classList.add("active");
    } else {
      elements.headerButtons.forEach((b) => {
        const f = b.getAttribute("data-filter");
        if (f === type) b.classList.add("active");
        else b.classList.remove("active");
      });
    }
  },
};

window.filterProducts = (type, event) => UI.filter(type, event);

document.addEventListener("DOMContentLoaded", () => {
  elements.headerButtons.forEach((btn) => {
    if (!btn.dataset.filter) {
      const onclickAttr = btn.getAttribute("onclick") || "";
      const match = onclickAttr.match(/filterProducts\(['"](.+?)['"]/);
      if (match) btn.dataset.filter = match[1];
    }
    btn.addEventListener("click", (e) => {
      const type = btn.dataset.filter || "all";
      window.filterProducts(type, e);
    });
  });

  ProductManager.load("all");
});
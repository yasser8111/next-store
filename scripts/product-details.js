import { showNotification, updateCartIcon } from "./script.js";
import { db } from "./firebase.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const SELECTORS = {
  containerId: "product-details-container",
  loadingId: "product-loading",
  errorId: "product-error",
  cartIcon: "#cart-icon",
};

const ProductDetails = {
  selectedProduct: null,
  mainSwiper: null,

  async init() {
    this.showLoading();

    // محاولة جلب المنتج من localStorage
    const saved = localStorage.getItem("selectedProduct");
    if (saved) {
      try {
        this.selectedProduct = JSON.parse(saved);
        this.render();
        this.hideLoading();
        this.setupEventListeners();
        return;
      } catch (e) {
        console.warn(
          "Invalid selectedProduct in localStorage, will fallback to id param.",
          e
        );
      }
    }

    const urlId = this.getQueryParam("id");
    if (urlId) {
      try {
        const m = await import("./firebase.js");
        if (m && m.db) {
          const { doc, getDoc } = await import(
            "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js"
          );
          const ref = doc(db, "products", urlId);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            this.selectedProduct = { id: snap.id, ...snap.data() };
            localStorage.setItem(
              "selectedProduct",
              JSON.stringify(this.selectedProduct)
            );
            this.render();
            this.hideLoading();
            this.setupEventListeners();
            return;
          } else {
            showNotification("لم يتم العثور على المنتج المطلوب.", "error");
            return;
          }
        }
      } catch (err) {
        console.warn(
          "Could not load firebase dynamically or fetch product:",
          err
        );
      }
    }
    showNotification(
      "لم يتم العثور على بيانات المنتج. الرجاء العودة واختيار منتج.",
      "erorr"
    );
  },

  render() {
    const container = document.getElementById(SELECTORS.containerId);
    if (!container)
      return console.error("Container not found:", SELECTORS.containerId);

    const p = this.selectedProduct || {};
    const images =
      Array.isArray(p.images) && p.images.length
        ? p.images
        : ["./imgs/placeholder.webp"];
    const description = p.description || "لا يوجد وصف لهذا المنتج.";
    const price = this.formatPrice(p.price || 0);

    // HTML: Gallery (main swiper) + thumbnails grid (non-swiper)
    container.innerHTML = `
      <div class="product-details">
        <div class="product-content" style="display:flex;gap:2rem;align-items:flex-start;justify-content:center;">
          <div class="product-gallery">
            <div class="gallery-main swiper">
              <div class="swiper-wrapper">
                ${images
                  .map(
                    (img) => `
                  <div class="swiper-slide">
                    <img src="${this.getImageUrl(img)}" alt="${this.escapeHtml(
                      p.name || ""
                    )}" onerror="this.src='./imgs/placeholder.webp'"/>
                  </div>
                `
                  )
                  .join("")}
              </div>
              <div class="swiper-button-next"><i class="fa-solid fa-chevron-left"></i></div>
              <div class="swiper-button-prev"><i class="fa-solid fa-chevron-right"></i></div>
              <div class="swiper-pagination"></div>
            </div>
          </div>

          <div class="product-info">
            <div class="product-header">
              <h1 class="product-title">${this.escapeHtml(
                p.name || "منتج بدون اسم"
              )}</h1>
              <p class="product-description">${this.escapeHtml(description)}</p>
              <div class="product-price">${price} ر.ي</div>
            </div>

            <div class="product-options">
              <div class="option-group">
                <label class="option-label">اختر المقاس:</label>
                <div class="size-options">
                  ${this.renderSizes(p.sizes)}
                </div>
              </div>

              <div class="option-group">
                <label class="option-label">اختر اللون:</label>
                <div class="color-options">
                  ${this.renderColors(p.colors)}
                </div>
              </div>
            </div>

            <div class="product-actions">
              <button id="add-to-cart-btn" class="add-to-cart">${
                p.inStock === false ? "غير متاح" : "إضافة إلى السلة"
              }</button>
            </div>

            <div class="product-specs">
              <h4 class="specs-title">مواصفات المنتج</h4>
              <ul class="specs-list">
                <li class="specs-item"><span class="specs-label">المادة:</span> <span class="specs-value">${this.escapeHtml(
                  p.material || "قطن 100%"
                )}</span></li>
                <li class="specs-item"><span class="specs-label">العناية:</span> <span class="specs-value">${this.escapeHtml(
                  p.care || "غسيل آمن"
                )}</span></li>
                <li class="specs-item"><span class="specs-label">المنشأ:</span> <span class="specs-value">${this.escapeHtml(
                  p.origin || "غير محدد"
                )}</span></li>
                ${
                  Array.isArray(p.specs)
                    ? p.specs
                        .map(
                          (s) =>
                            `<li class="specs-item"><span class="specs-label">${this.escapeHtml(
                              s.label
                            )}</span><span class="specs-value">${this.escapeHtml(
                              s.value
                            )}</span></li>`
                        )
                        .join("")
                    : ""
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
    this.initSwipers();
  },

  initSwipers() {
    try {
      if (this.mainSwiper) this.mainSwiper.destroy(true, true);
    } catch {}
    this.mainSwiper = new Swiper(".gallery-main", {
      spaceBetween: 10,
      loop: true,
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  },

  renderSizes(sizes) {
    const list = Array.isArray(sizes) && sizes.length ? sizes : ["S", "M", "L"];
    return list
      .map((s) => {
        const name = typeof s === "object" ? s.name : s;
        return `<button class="size-btn ${
          typeof s === "object" && s.available === false ? "disabled" : ""
        }" data-size="${this.escapeHtml(name)}">${this.escapeHtml(
          name
        )}</button>`;
      })
      .join("");
  },

  renderColors(colors) {
    const list =
      Array.isArray(colors) && colors.length
        ? colors
        : [
            { name: "أسود", code: "#000" },
            { name: "أبيض", code: "#fff" },
          ];
    return list
      .map((c) => {
        const name = typeof c === "object" ? c.name : c;
        const code = typeof c === "object" ? c.code : c;
        return `<button class="color-btn" data-color="${this.escapeHtml(
          name
        )}" title="${this.escapeHtml(
          name
        )}" style="background:${this.escapeHtml(code)}"></button>`;
      })
      .join("");
  },

  setupEventListeners() {
    // size buttons
    document.querySelectorAll(".size-btn").forEach((b) => {
      b.addEventListener("click", () => {
        if (b.classList.contains("disabled")) return;
        document
          .querySelectorAll(".size-btn")
          .forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
      });
    });

    // color buttons
    document.querySelectorAll(".color-btn").forEach((b) => {
      b.addEventListener("click", () => {
        document
          .querySelectorAll(".color-btn")
          .forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
      });
    });

    // في product-details.js داخل setupEventListeners
    const addBtn = document.getElementById("add-to-cart-btn");
    if (addBtn) {
      addBtn.addEventListener("click", (e) => {
        const product = this.selectedProduct;
        if (!product) return showNotification("لا يوجد منتج", "error");
        if (product.inStock === false)
          return showNotification("هذا المنتج غير متاح حالياً.", "error");

        const selectedSize =
          document.querySelector(".size-btn.active")?.dataset.size || null;
        const selectedColor =
          document.querySelector(".color-btn.active")?.dataset.color || null;

        // استخدام الدالة الموحدة لإضافة المنتج
        if (window.addToCart) {
          window.addToCart(product, selectedSize, selectedColor);
        } else {
          // الطريقة الاحتياطية
          const cart = JSON.parse(localStorage.getItem("cart") || "[]");
          const existingItemIndex = cart.findIndex(
            (item) =>
              item.productId === product.id &&
              item.size === selectedSize &&
              item.color === selectedColor
          );

          if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
            showNotification("تم زيادة كمية المنتج في السلة", "success");
          } else {
            const imgSrc = this.getImageUrl(
              product.images?.[0] || "./imgs/placeholder.webp"
            );
            cart.push({
              productId: product.id,
              name: product.name,
              price: product.price || 0,
              image: imgSrc,
              size: selectedSize,
              color: selectedColor,
              quantity: 1,
            });
            showNotification("تمت إضافة المنتج إلى السلة", "success");
            updateCartIcon()
          }
          localStorage.setItem("cart", JSON.stringify(cart));
        }
      });
    }
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
    return String(text).replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        }[m])
    );
  },

  getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  },

  showLoading() {
    const el = document.getElementById(SELECTORS.loadingId);
    if (el) el.style.display = "flex";
  },

  hideLoading() {
    const el = document.getElementById(SELECTORS.loadingId);
    if (el) el.style.display = "none";
  },

  showError(msg) {
    this.hideLoading();
    const el = document.getElementById(SELECTORS.errorId);
    if (el) {
      el.style.display = "block";
      const p = el.querySelector("p");
      if (p) p.textContent = msg;
    } else {
      console.error(msg);
    }
  },
};

document.addEventListener("DOMContentLoaded", () => ProductDetails.init());

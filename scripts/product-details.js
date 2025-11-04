// product-details.js - نسخة محسنة مع إضافة حالة "قريباً"
import { showNotification, updateCartIcon } from "./script.js";
import { db } from "./firebase.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { ProductUtils } from "./productUtils.js";
import { CartManager } from "./cartManager.js";

const SELECTORS = {
  containerId: "product-details-container",
  loadingId: "product-loading",
  errorId: "product-error",
};

class ProductDetails {
  constructor() {
    this.selectedProduct = null;
    this.mainSwiper = null;
    this.selectedSize = null;
    this.selectedColor = null;
    this.hasMultipleSizes = false;
    this.hasMultipleColors = false;
  }

  async init() {
    this.showLoading();

    try {
      const saved = localStorage.getItem("selectedProduct");
      if (saved) {
        this.selectedProduct = JSON.parse(saved);
        this.render();
        this.hideLoading();
        this.setupEventListeners();
        return;
      }

      const urlId = this.getQueryParam("id");
      if (urlId) {
        await this.loadProductFromFirebase(urlId);
      } else {
        this.showError("لم يتم العثور على معرف المنتج");
      }
    } catch (error) {
      console.error("خطأ في تهيئة تفاصيل المنتج:", error);
      this.showError("حدث خطأ أثناء تحميل المنتج");
    }
  }

  async loadProductFromFirebase(productId) {
    try {
      const ref = doc(db, "products", productId);
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
      } else {
        this.showError("لم يتم العثور على المنتج المطلوب");
      }
    } catch (error) {
      console.error("خطأ في جلب المنتج:", error);
      this.showError("حدث خطأ أثناء جلب بيانات المنتج");
    }
  }

  render() {
    const container = document.getElementById(SELECTORS.containerId);
    if (!container) return;

    const product = this.selectedProduct;
    if (!product) {
      this.showError("بيانات المنتج غير متاحة");
      return;
    }

    // استخدام الحالة من البيانات مع قيمة افتراضية إذا لم تكن موجودة
    const productStatus = product.status || "unknown";
    const statusInfo = ProductUtils.getProductStatus(productStatus);
    const isAvailable = productStatus === "available";
    const isComingSoon = productStatus === "coming_soon";

    this.hasMultipleSizes =
      Array.isArray(product.sizes) && product.sizes.length > 1;
    this.hasMultipleColors =
      Array.isArray(product.colors) && product.colors.length > 1;

    if (
      !this.hasMultipleSizes &&
      Array.isArray(product.sizes) &&
      product.sizes.length === 1
    ) {
      this.selectedSize =
        typeof product.sizes[0] === "object"
          ? product.sizes[0].name
          : product.sizes[0];
    }

    if (
      !this.hasMultipleColors &&
      Array.isArray(product.colors) &&
      product.colors.length === 1
    ) {
      this.selectedColor =
        typeof product.colors[0] === "object"
          ? product.colors[0].name
          : product.colors[0];
    }

    container.innerHTML = this.getProductHTML(product, statusInfo, isAvailable, isComingSoon);
    this.initSwipers();
  }

  getProductHTML(product, statusInfo, isAvailable, isComingSoon) {
    const images =
      Array.isArray(product.images) && product.images.length
        ? product.images
        : ["./imgs/placeholder.webp"];

    // تحديد نص السعر بناءً على حالة المنتج
    const priceText = isComingSoon ? "قريباً" : `${ProductUtils.formatPrice(product.price)} ر.ي`;

    return `
      <div class="product-details">
        <div class="product-content">
          <div class="product-gallery">
            <div class="gallery-main swiper">
              <div class="swiper-wrapper">
                ${images
                  .map(
                    (img) => `
                  <div class="swiper-slide">
                    <img src="${ProductUtils.getImageUrl(img)}" 
                         alt="${ProductUtils.escapeHtml(product.name)}" 
                         onerror="this.src='./imgs/placeholder.webp'"/>
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
              <h1 class="product-title">${ProductUtils.escapeHtml(
                product.name || "منتج بدون اسم"
              )}</h1>
              <p class="product-description">${ProductUtils.escapeHtml(
                product.description || "لا يوجد وصف لهذا المنتج."
              )}</p>
              
              <div class="product-status-badge ${statusInfo.class}">
                 ${statusInfo.text}
              </div>

              <div class="product-price">${priceText}</div>
            </div>

            ${
              isAvailable
                ? this.getProductOptionsHTML(product)
                : this.getUnavailableProductHTML(statusInfo)
            }

            <div class="product-specs">
              <h4 class="specs-title">مواصفات المنتج</h4>
              <ul class="specs-list">
                ${this.getProductSpecsHTML(product)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getProductOptionsHTML(product) {
    return `
      <div class="product-options">
        ${
          this.hasMultipleSizes ||
          (Array.isArray(product.sizes) && product.sizes.length > 0)
            ? `
          <div class="option-group">
            <label class="option-label">${
              this.hasMultipleSizes ? "اختر المقاس:" : "المقاس:"
            }</label>
            <div class="size-options">
              ${this.renderSizes(product.sizes)}
            </div>
            ${
              this.hasMultipleSizes
                ? `
              <div class="selection-error" id="size-error" style="display: none; color: var(--error-color); font-size: 0.9rem; margin-top: 0.5rem;">
                ⚠️ يرجى اختيار المقاس
              </div>
            `
                : ""
            }
          </div>
        `
            : ""
        }

        ${
          this.hasMultipleColors ||
          (Array.isArray(product.colors) && product.colors.length > 0)
            ? `
          <div class="option-group">
            <label class="option-label">${
              this.hasMultipleColors ? "اختر اللون:" : "اللون:"
            }</label>
            <div class="color-options">
              ${this.renderColors(product.colors)}
            </div>
            ${
              this.hasMultipleColors
                ? `
              <div class="selection-error" id="color-error" style="display: none; color: var(--error-color); font-size: 0.9rem; margin-top: 0.5rem;">
                ⚠️ يرجى اختيار اللون
              </div>
            `
                : ""
            }
          </div>
        `
            : ""
        }
      </div>

      <div class="product-actions">
        <button id="add-to-cart-btn" class="add-to-cart btn-primary">
          إضافة إلى السلة
        </button>
      </div>
    `;
  }

  getUnavailableProductHTML(statusInfo) {
    let message = "";
    switch (statusInfo.class) {
      case "out-of-stock":
        message = "هذا المنتج غير متوفر حالياً";
        break;
      case "pre-order":
        message = "يمكنك طلب هذا المنتج مسبقاً";
        break;
      case "coming-soon":
        message = "هذا المنتج قريباً في المتجر";
        break;
      case "discontinued":
        message = "هذا المنتج متوقف";
        break;
      case "unknown":
        message = "حالة المنتج غير معروفة";
        break;
      default:
        message = "هذا المنتج غير متاح";
    }

    return `
      <div class="product-unavailable">
        <div class="unavailable-message">
          <i class="fa-solid fa-info-circle"></i>
          <p>${message}</p>
        </div>
      </div>
    `;
  }

  getProductSpecsHTML(product) {
    const specs = [];
    if (Array.isArray(product.specs)) {
      specs.push(
        ...product.specs.map(
          (spec) =>
            `<li class="specs-item"><span class="specs-label">${ProductUtils.escapeHtml(
              spec.title
            )}:</span> <span class="specs-value">${ProductUtils.escapeHtml(
              spec.value
            )}</span></li>`
        )
      );
    }

    return specs.length > 0
      ? specs.join("")
      : "<li class='specs-item'>لا توجد مواصفات متاحة</li>";
  }

  renderSizes(sizes) {
    const list = Array.isArray(sizes) && sizes.length ? sizes : ["S", "M", "L"];
    return list
      .map((s) => {
        const name = typeof s === "object" ? s.name : s;
        const isAvailable =
          typeof s === "object" ? s.available !== false : true;
        const isSelected = !this.hasMultipleSizes || name === this.selectedSize;

        return `<button class="size-btn ${!isAvailable ? "disabled" : ""} ${
          isSelected ? "active" : ""
        }" 
                      data-size="${ProductUtils.escapeHtml(name)}"
                      ${!isAvailable ? "disabled" : ""}>
                ${ProductUtils.escapeHtml(name)}
              </button>`;
      })
      .join("");
  }

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
        const isSelected =
          !this.hasMultipleColors || name === this.selectedColor;

        return `<button class="color-btn ${isSelected ? "active" : ""}" 
                      data-color="${ProductUtils.escapeHtml(name)}" 
                      title="${ProductUtils.escapeHtml(name)}"
                      style="background:${ProductUtils.escapeHtml(code)}">
              </button>`;
      })
      .join("");
  }

  initSwipers() {
    if (this.mainSwiper) {
      this.mainSwiper.destroy(true, true);
    }

    this.mainSwiper = new Swiper(".gallery-main", {
      spaceBetween: 10,
      loop: true,
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }

  setupEventListeners() {
    // أحداث أحجام المنتج
    document.querySelectorAll(".size-btn:not(.disabled)").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (this.hasMultipleSizes) {
          document
            .querySelectorAll(".size-btn")
            .forEach((x) => x.classList.remove("active"));
          btn.classList.add("active");
          this.selectedSize = btn.dataset.size;
          this.hideSelectionError("size");
        }
      });
    });

    // أحداث ألوان المنتج
    document.querySelectorAll(".color-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (this.hasMultipleColors) {
          document
            .querySelectorAll(".color-btn")
            .forEach((x) => x.classList.remove("active"));
          btn.classList.add("active");
          this.selectedColor = btn.dataset.color;
          this.hideSelectionError("color");
        }
      });
    });

    // حدث إضافة إلى السلة
    const addBtn = document.getElementById("add-to-cart-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        // منع إضافة المنتجات القادمة إلى السلة
        if (this.selectedProduct.status === 'coming_soon') {
          showNotification("هذا المنتج قريباً في المتجر وغير متاح للشراء حالياً", "info");
          return;
        }

        if (!this.validateSelections()) {
          return;
        }

        CartManager.addToCart(
          this.selectedProduct,
          this.selectedSize,
          this.selectedColor
        );
      });
    }
  }

  validateSelections() {
    let isValid = true;

    // التحقق من المقاس إذا كان هناك خيارات متعددة
    if (this.hasMultipleSizes && !this.selectedSize) {
      this.showSelectionError("size", "يرجى اختيار المقاس");
      isValid = false;
    }

    // التحقق من اللون إذا كان هناك خيارات متعددة
    if (this.hasMultipleColors && !this.selectedColor) {
      this.showSelectionError("color", "يرجى اختيار اللون");
      isValid = false;
    }

    // إذا لم تكن هناك خيارات متعددة، استخدم القيم الافتراضية
    if (
      !this.hasMultipleSizes &&
      Array.isArray(this.selectedProduct.sizes) &&
      this.selectedProduct.sizes.length === 1
    ) {
      this.selectedSize =
        typeof this.selectedProduct.sizes[0] === "object"
          ? this.selectedProduct.sizes[0].name
          : this.selectedProduct.sizes[0];
    }

    if (
      !this.hasMultipleColors &&
      Array.isArray(this.selectedProduct.colors) &&
      this.selectedProduct.colors.length === 1
    ) {
      this.selectedColor =
        typeof this.selectedProduct.colors[0] === "object"
          ? this.selectedProduct.colors[0].name
          : this.selectedProduct.colors[0];
    }

    if (!isValid) {
      showNotification(
        "يرجى اختيار المقاس واللون قبل الإضافة إلى السلة",
        "error"
      );
    }

    return isValid;
  }

  showSelectionError(type, message) {
    const errorElement = document.getElementById(`${type}-error`);
    if (errorElement) {
      errorElement.textContent = `⚠️ ${message}`;
      errorElement.style.display = "block";
    }
  }

  hideSelectionError(type) {
    const errorElement = document.getElementById(`${type}-error`);
    if (errorElement) {
      errorElement.style.display = "none";
    }
  }

  getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  showLoading() {
    const el = document.getElementById(SELECTORS.loadingId);
    if (el) el.style.display = "flex";
  }

  hideLoading() {
    const el = document.getElementById(SELECTORS.loadingId);
    if (el) el.style.display = "none";
  }

  showError(msg) {
    this.hideLoading();
    const el = document.getElementById(SELECTORS.errorId);
    if (el) {
      el.style.display = "block";
      const p = el.querySelector("p");
      if (p) p.textContent = msg;
    }
  }
}

const productDetails = new ProductDetails();
document.addEventListener("DOMContentLoaded", () => productDetails.init());
import { ProductManager } from "./modules/products.js";
import { CartManager } from "./modules/cart.js";
import {
  getImageUrl,
  formatPrice,
  showNotification,
  getColorCode,
} from "./utils/helpers.js";
import { SIZES } from "./utils/constants.js";

class ProductDetailsPage {
  constructor() {
    this.container = document.getElementById("product-details-container");
    this.selectedSize = null;
    this.selectedColor = null;
    this.product = null;
    this.swiper = null;
    this.init();
  }

  async init() {
    try {
      await this.loadProduct();
      this.renderProduct();
      this.setupEventListeners();
      this.initSwiper();
    } catch (error) {
      console.error("Error initializing product details:", error);
      this.showError("حدث خطأ في تحميل صفحة المنتج");
    }
  }

  async loadProduct() {
    try {
      this.showLoading(true);

      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get("id");

      if (productId) {
        this.product = await ProductManager.getProductById(productId);
      }

      if (!this.product) {
        const storedProduct = localStorage.getItem("selectedProduct");
        if (storedProduct) {
          this.product = JSON.parse(storedProduct);
        }
      }

      if (!this.product) {
        const storedProductId = localStorage.getItem("selectedProductId");
        if (storedProductId) {
          this.product = await ProductManager.getProductById(storedProductId);
        }
      }

      if (!this.product) {
        throw new Error("Product not found");
      }

      setTimeout(() => {
        localStorage.removeItem("selectedProduct");
        localStorage.removeItem("selectedProductId");
      }, 1000);

      this.showLoading(false);
    } catch (error) {
      console.error("Error loading product:", error);
      throw error;
    }
  }

  renderProduct() {
    if (!this.container || !this.product) return;

    const isAvailable = ProductManager.isProductAvailable(this.product);

    this.container.innerHTML = `
      <div class="product-gallery">
        <div class="swiper product-swiper">
          <div class="swiper-wrapper">
            ${this.product.images
              ?.map(
                (image) => `
              <div class="swiper-slide">
                <img src="${getImageUrl(image)}" 
                     alt="${this.product.name}"
                     loading="lazy"
                     onerror="this.src='../public/img/placeholder.webp'">
              </div>
            `
              )
              .join("")}
          </div>
          
          <div class="swiper-button-next">
            <i class="fa-solid fa-chevron-left"></i>
          </div>
          <div class="swiper-button-prev">
            <i class="fa-solid fa-chevron-right"></i>
          </div>
          
          <div class="swiper-pagination"></div>
        </div>
      </div>

      <div class="product-info">
        <div class="product-header">
          <h1 class="product-title">${this.product.name}</h1>
          <p class="product-description">${this.product.description}</p>
          <div class="product-price">${formatPrice(
            this.product.price,
            this.product.currency
          )}</div>
        </div>

        ${
          !isAvailable
            ? `
          <div class="product-unavailable">
            <div class="unavailable-message">
              <i class="fa-solid fa-clock"></i>
              <p>هذا المنتج غير متاح حالياً</p>
            </div>
          </div>
        `
            : `
          <div class="product-options">
            ${
              this.product.sizes?.length > 0
                ? `
              <div class="option-group">
                <label class="option-label">اختر المقاس:</label>
                <div class="size-options">
                  ${SIZES.map(
                    (size) => `
                    <button class="size-btn ${
                      this.product.sizes.includes(size) ? "" : "disabled"
                    }" 
                            data-size="${size}"
                            ${
                              this.product.sizes.includes(size)
                                ? ""
                                : "disabled"
                            }>
                      ${size}
                    </button>
                  `
                  ).join("")}
                </div>
              </div>
            `
                : ""
            }

            ${
              this.product.colors?.length > 0
                ? `
              <div class="option-group">
                <label class="option-label">اختر اللون:</label>
                <div class="color-options">
                  ${this.product.colors
                    .map(
                      (color) => `
                    <div class="color-btn" 
                         data-color="${color}"
                         style="background-color: ${getColorCode(color)}"
                         title="${color}">
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }
          </div>

          <div class="product-actions">
            <button class="btn btn-primary add-to-cart-btn" id="add-to-cart-btn" disabled>
              <i class="fa-solid fa-cart-plus"></i>
              أضف إلى السلة
            </button>
          </div>
        `
        }

        ${
          this.product.specs?.length > 0
            ? `
          <div class="product-specs">
            <h3 class="specs-title">مواصفات المنتج</h3>
            <ul class="specs-list">
              ${this.product.specs
                .map(
                  (spec) => `
                <li class="specs-item">
                  <span class="specs-label">${spec.title}:</span>
                  <span class="specs-value">${spec.value}</span>
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        `
            : ""
        }
      </div>
    `;

    this.setupOptionButtons();
  }

  setupEventListeners() {
    document.addEventListener("click", (e) => {
      if (
        e.target.id === "add-to-cart-btn" ||
        e.target.closest("#add-to-cart-btn")
      ) {
        this.handleAddToCart();
      }
    });
  }

  setupOptionButtons() {
    const sizeButtons = this.container.querySelectorAll(
      ".size-btn:not(.disabled)"
    );
    sizeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.selectSize(btn.dataset.size);
        this.updateOptionButtons(sizeButtons, btn, "size-btn");
      });
    });

    const colorButtons = this.container.querySelectorAll(".color-btn");
    colorButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.selectColor(btn.dataset.color);
        this.updateOptionButtons(colorButtons, btn, "color-btn");
      });
    });

    if (sizeButtons.length === 1) {
      sizeButtons[0].click();
    }
    if (colorButtons.length === 1) {
      colorButtons[0].click();
    }
  }

  selectSize(size) {
    this.selectedSize = size;
    this.checkSelections();
  }

  selectColor(color) {
    this.selectedColor = color;
    this.checkSelections();
  }

  updateOptionButtons(buttons, selectedButton, className) {
    buttons.forEach((btn) => btn.classList.remove("active"));
    selectedButton.classList.add("active");
  }

  checkSelections() {
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    if (!addToCartBtn) return;

    const hasSize =
      !this.product.sizes ||
      this.product.sizes.length === 0 ||
      this.selectedSize;
    const hasColor =
      !this.product.colors ||
      this.product.colors.length === 0 ||
      this.selectedColor;

    addToCartBtn.disabled = !(hasSize && hasColor);
  }

  handleAddToCart() {
    if (!this.selectedSize && this.product.sizes?.length > 0) {
      showNotification("الرجاء اختيار المقاس أولاً", true);
      return;
    }

    if (!this.selectedColor && this.product.colors?.length > 0) {
      showNotification("الرجاء اختيار اللون أولاً", true);
      return;
    }

    try {
      const success = CartManager.addItem(
        this.product,
        this.selectedSize,
        this.selectedColor
      );

      if (success) {
        showNotification("تم إضافة المنتج إلى السلة بنجاح!");
      } else {
        showNotification("حدث خطأ أثناء إضافة المنتج إلى السلة", true);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showNotification("حدث خطأ أثناء إضافة المنتج إلى السلة", true);
    }
  }

  initSwiper() {
    if (typeof Swiper === "undefined") {
      console.error("Swiper not loaded");
      return;
    }

    // انتظر حتى يتم تحميل DOM بالكامل
    setTimeout(() => {
      try {
        this.swiper = new Swiper(".product-swiper", {
          loop: true,
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          slidesPerView: 1,
          spaceBetween: 0,
          centeredSlides: false,
          autoHeight: false,
          effect: "slide",

          // إعدادات التحسين
          resistance: true,
          resistanceRatio: 0.85,

          on: {
            init: function () {
              console.log("Swiper initialized successfully");
              this.update();
            },
          },
        });

        // إعادة حساب الأبعاد
        setTimeout(() => {
          if (this.swiper) {
            this.swiper.update();
            this.swiper.slideTo(0);
          }
        }, 300);
      } catch (error) {
        console.error("Error initializing Swiper:", error);
      }
    }, 100);
  }

  showError(message) {
    if (this.container) {
      this.container.innerHTML = `
        <div class="product-error">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <h2>حدث خطأ</h2>
          <p>${message}</p>
          <a href="../index.html#products" class="btn btn-primary">
            العودة للمنتجات
          </a>
        </div>
      `;
    }
  }

  showLoading(show = true) {
    if (this.loadingElement) {
      this.loadingElement.style.display = show ? "flex" : "none";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ProductDetailsPage();
});

window.ProductDetailsPage = ProductDetailsPage;

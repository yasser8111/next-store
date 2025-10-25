import { ProductManager } from "./modules/products.js";
import { CartManager } from "./modules/cart.js";
import { showNotification, getImageUrl } from "./utils/helpers.js";

class HomePage {
  constructor() {
    this.gridElement = document.getElementById("product-grid");
    this.loadingElement = document.getElementById("loading-container");
    this.customizeCard = document.getElementById("customize-card");
    this.init();
  }

  async init() {
    try {
      await this.loadProducts();
      this.setupHeroInteractions(); // أضف هذا السطر
    } catch (error) {
      console.error("Error initializing home page:", error);
      this.showError("حدث خطأ في تحميل الصفحة");
    }
  }

  setupHeroInteractions() {
    // زر CTA
    const heroCta = document.querySelector(".hero-cta");
    if (heroCta) {
      heroCta.addEventListener("click", () => {
        document.getElementById("products").scrollIntoView({
          behavior: "smooth",
        });
      });
    }

    // زر التمرير للأسفل
    const scrollDown = document.querySelector(".scroll-down");
    if (scrollDown) {
      scrollDown.addEventListener("click", () => {
        document.getElementById("products").scrollIntoView({
          behavior: "smooth",
        });
      });
    }
  }

  async loadProducts() {
    if (!this.gridElement) return;

    this.showLoading(true);

    try {
      const products = await ProductManager.getAllProducts();

      // إضافة منتج التصميم المخصص إلى المنتجات
      const customizeProduct = {
        id: "customize",
        name: "صمّم تيشيرتك",
        price: 15000,
        currency: "YER",
        images: ["customize_qcgbab.webp"],
        description: "صمّم التيشيرت الخاص بك",
        status: "available",
      };

      // إضافة منتج التصميم المخصص كأول منتج
      const allProducts = [customizeProduct, ...products];

      await ProductManager.renderProductsGrid(this.gridElement, allProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      this.showError("فشل في تحميل المنتجات. حاول تحديث الصفحة.");
    } finally {
      this.showLoading(false);
    }
  }

  // إزالة الدوال القديمة التي لم نعد نحتاجها
  // setupCustomizeCard() - إزالة
  // navigateToCustomize() - إزالة

  testImageLoad(url, productName) {
    const img = new Image();
    img.onload = () => {
      console.log(`✅ صورة "${productName}" محملة بنجاح`);
      console.log(`   الرابط: ${url}`);
    };
    img.onerror = () => {
      console.error(`❌ فشل تحميل صورة "${productName}"`);
      console.error(`   الرابط: ${url}`);
    };
    img.src = url;
  }

  // دالة لاختبار تحميل الصورة
  testImageLoad(url, productName) {
    const img = new Image();
    img.onload = () => {
      console.log(`✅ الصورة لـ "${productName}" محملة بنجاح: ${url}`);
    };
    img.onerror = () => {
      console.error(`❌ فشل تحميل الصورة لـ "${productName}": ${url}`);
    };
    img.src = url;
  }

  showLoading(show = true) {
    if (this.loadingElement) {
      this.loadingElement.style.display = show ? "flex" : "none";
    }
  }

  showError(message) {
    if (this.gridElement) {
      this.gridElement.innerHTML = `
                <div class="error-state">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <p>${message}</p>
                    <button onclick="window.location.reload()" class="btn-retry">إعادة المحاولة</button>
                </div>
            `;
    }
  }

  setupCustomizeCard() {
    if (this.customizeCard) {
      this.customizeCard.addEventListener("click", () => {
        this.navigateToCustomize();
      });
    }
  }

  navigateToCustomize() {
    const customizeProduct = {
      id: "customize",
      name: "صمّم تيشيرتك...",
      price: 15000,
      currency: "YER",
      images: ["customize_qcgbab.webp"],
      description: "صمّم التيشيرت الخاص بك",
      status: "available",
    };

    // حفظ في localStorage والانتقال
    localStorage.setItem("selectedProduct", JSON.stringify(customizeProduct));
    window.location.href = "./pages/customize-details.html";
  }

  setupSearchFunctionality() {
    // يمكن إضافة شريط بحث في المستقبل
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "ابحث عن منتج...";
    searchInput.className = "search-input";
    searchInput.style.cssText = `
            width: 100%;
            max-width: 400px;
            margin: 0 auto 2rem;
            padding: 0.8rem 1rem;
            border: 2px solid var(--border-color);
            border-radius: 25px;
            font-size: 1rem;
            display: block;
        `;

    // إضافة شريط البحث إذا كان مطلوباً
    // this.gridElement.parentNode.insertBefore(searchInput, this.gridElement);
    // حفظ في localStorage والانتقال
    localStorage.setItem("selectedProduct", JSON.stringify(customizeProduct));
    window.location.href = "./pages/product-details.html?id=customize";
  }

  // دالة للمساعدة في التصفية (للاستخدام المستقبلي)
  filterProducts(searchTerm) {
    const productCards = this.gridElement.querySelectorAll(".product-card");
    let visibleCount = 0;

    productCards.forEach((card) => {
      const productName = card
        .querySelector(".product-name")
        .textContent.toLowerCase();
      const productDescription =
        card.querySelector(".product-description")?.textContent.toLowerCase() ||
        "";

      const matches =
        productName.includes(searchTerm.toLowerCase()) ||
        productDescription.includes(searchTerm.toLowerCase());

      card.style.display = matches ? "block" : "none";
      if (matches) visibleCount++;
    });

    // عرض حالة عدم وجود نتائج
    if (visibleCount === 0 && searchTerm) {
      this.gridElement.innerHTML += `
                <div class="empty-state">
                    <i class="fa-solid fa-search"></i>
                    <p>لا توجد نتائج لـ "${searchTerm}"</p>
                </div>
            `;
    }
  }
}

// تهيئة الصفحة الرئيسية عند التحميل
document.addEventListener("DOMContentLoaded", () => {
  new HomePage();
});

// جعل الدوال متاحة عالمياً للاستخدام في console
window.HomePage = HomePage;

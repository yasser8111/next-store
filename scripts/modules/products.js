import { db, collection, getDocs, doc, getDoc } from "./firebase.js";
import {
  getImageUrl,
  formatPrice,
  showNotification,
} from "../utils/helpers.js";
import { PRODUCT_STATUS, SIZES } from "../utils/constants.js";

export class ProductManager {
  /**
   * Get all products from Firebase
   */
  static async getAllProducts() {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = [];

      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      showNotification("فشل في تحميل المنتجات", true);
      return [];
    }
  }

  /**
   * Get single product by ID
   */
  static async getProductById(productId) {
    try {
      console.log("🔍 البحث عن المنتج بالمعرف:", productId);

      // جلب جميع المنتجات أولاً
      const products = await this.getAllProducts();
      console.log("📦 جميع المنتجات المتاحة:", products);

      if (!products || products.length === 0) {
        throw new Error("لا توجد منتجات متاحة");
      }

      // البحث عن المنتج - استخدم == بدلاً من === للمقارنة المرنة
      const product = products.find(
        (p) => p.id == productId || p.id === parseInt(productId)
      );

      if (!product) {
        console.log("❌ المنتج غير موجود. الأسباب المحتملة:");
        console.log("   - المعرّف المطلوب:", productId);
        console.log("   - نوع المعرّف:", typeof productId);
        console.log(
          "   - المنتجات المتاحة:",
          products.map((p) => ({ id: p.id, type: typeof p.id, name: p.name }))
        );
        throw new Error(`المنتج بالمعرف ${productId} غير موجود`);
      }

      console.log("✅ المنتج الذي تم العثور عليه:", product);
      return product;
    } catch (error) {
      console.error("💥 Error in getProductById:", error);
      throw error;
    }
  }

  /**
   * Get products by status
   */
  static async getProductsByStatus(status) {
    const products = await this.getAllProducts();
    return products.filter((product) => product.status === status);
  }

  /**
   * Get available products
   */
  static async getAvailableProducts() {
    return this.getProductsByStatus(PRODUCT_STATUS.AVAILABLE);
  }

  /**
   * Get out of stock products
   */
  static async getOutOfStockProducts() {
    return this.getProductsByStatus(PRODUCT_STATUS.OUT_OF_STOCK);
  }

  /**
   * Get coming soon products
   */
  static async getComingSoonProducts() {
    return this.getProductsByStatus(PRODUCT_STATUS.COMING_SOON);
  }

  /**
   * Check if product is available
   */
  static isProductAvailable(product) {
    // إذا كان المنتج هو customize، فهو دائماً متاح
    if (product.id === "customize") {
      return true;
    }

    // إذا لم يكن هناك status، افترض أنه متاح
    if (!product.status) {
      return true;
    }

    // تحقق من الحالة والمخزون
    const statusAvailable = product.status === PRODUCT_STATUS.AVAILABLE;
    const stockAvailable = product.stock === undefined || product.stock > 0;

    console.log(`تحقق توفر المنتج ${product.name}:`, {
      status: product.status,
      stock: product.stock,
      statusAvailable: statusAvailable,
      stockAvailable: stockAvailable,
      finalResult: statusAvailable && stockAvailable,
    });

    return statusAvailable && stockAvailable;
  }

  /**
   * Create product card HTML
   */
  static createProductCard(product) {
    const isAvailable = this.isProductAvailable(product);
    const isCustom = product.id === "customize";

    const card = document.createElement("div");
    card.className = `product-card ${isCustom ? "Customize-card" : ""} ${
      !isAvailable ? "disabled" : ""
    }`;

    // أضف dataset المطلوب للـ event listeners
    card.dataset.id = product.id;
    card.dataset.status = product.status || "available";
    card.dataset.price = product.price || 0;
    card.dataset.currency = product.currency || "YER";

    console.log(`إنشاء بطاقة منتج: ${product.name}`, {
      isAvailable: isAvailable,
      isCustom: isCustom,
      classes: card.className,
      dataset: card.dataset,
    });

    const statusBadge =
      product.status === PRODUCT_STATUS.OUT_OF_STOCK
        ? '<div class="out-of-stock-badge">غير متوفر</div>'
        : product.status === PRODUCT_STATUS.COMING_SOON
        ? '<div class="coming-soon-badge">قريبًا</div>'
        : "";

    // الحصول على رابط الصورة
    const imageUrl = getImageUrl(product.images?.[0]);
    const placeholderUrl = getImageUrl("placeholder.webp");

    card.innerHTML = `
        <div class="product-image">
            <img src="${imageUrl}" 
                 alt="${product.name}" 
                 loading="lazy"
                 onerror="this.src='${placeholderUrl}';">
            ${statusBadge}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${formatPrice(
              product.price,
              product.currency
            )}</p>
            ${
              product.description
                ? `<p class="product-description">${product.description}</p>`
                : ""
            }
        </div>
    `;

    return card;
  }

  /**
   * Navigate to product details page
   */
  static navigateToProduct(product, isCustom = false) {
    try {
      localStorage.setItem("selectedProduct", JSON.stringify(product));

      if (isCustom) {
        window.location.href = "../pages/customize-details.html";
      } else {
        window.location.href = `../pages/product-details.html?id=${product.id}`;
      }
    } catch (error) {
      console.error("Error navigating to product:", error);
      showNotification("حدث خطأ في تحميل صفحة المنتج", true);
    }
  }

  /**
   * Render products grid
   */
  static async renderProductsGrid(container, products) {
    if (!container || !products) return;

    container.innerHTML = products
      .map((product) => {
        const isAvailable = this.isProductAvailable(product);
        const isCustom = product.id === "customize";

        // إذا كان المنتج غير متاح، نعرضه بدون رابط
        if (!isAvailable && !isCustom) {
          return `
            <div class="product-card disabled" 
                 data-id="${product.id}"
                 data-status="${product.status}">
                
                <div class="product-image">
                    <img src="${getImageUrl(product.images?.[0])}" 
                         alt="${product.name}" 
                         loading="lazy"
                         onerror="this.src='${getImageUrl(
                           "placeholder.webp"
                         )}'">
                    
                    ${
                      product.status === "out-of-stock"
                        ? '<div class="out-of-stock-badge">غير متوفر</div>'
                        : ""
                    }
                    ${
                      product.status === "coming-soon"
                        ? '<div class="coming-soon-badge">قريباً</div>'
                        : ""
                    }
                </div>
                
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${formatPrice(
                      product.price,
                      product.currency
                    )}</p>
                    ${
                      product.description
                        ? `<p class="product-description">${product.description}</p>`
                        : ""
                    }
                </div>
            </div>
            `;
        }

        // للمنتجات المتاحة (بما فيها التصميم المخصص)، نضيف رابط
        return `
        <a href="./pages/product-details.html?id=${product.id}" 
           class="product-card"
           onclick="localStorage.setItem('selectedProduct', JSON.stringify(${this.escapeProductForHTML(
             product
           )}))"
           data-id="${product.id}"
           data-status="${product.status}">
            
            <div class="product-image">
                <img src="${getImageUrl(product.images?.[0])}" 
                     alt="${product.name}" 
                     loading="lazy"
                     onerror="this.src='${getImageUrl("placeholder.webp")}'">
                
                ${
                  isCustom
                    ? '<div class="customize-badge">تصميم مخصص</div>'
                    : ""
                }
            </div>
            
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${formatPrice(
                  product.price,
                  product.currency
                )}</p>
                ${
                  product.description
                    ? `<p class="product-description">${product.description}</p>`
                    : ""
                }
            </div>
        </a>
        `;
      })
      .join("");
  }

  /**
   * تهيئة المنتج للتخزين في HTML
   */
  static escapeProductForHTML(product) {
    // تحويل المنتج لـ JSON مع استبدال الـ quotes
    const productJson = JSON.stringify(product)
      .replace(/'/g, "\\'")
      .replace(/"/g, "&quot;");
    return productJson;
  }

  /**
   * تهيئة المنتج للتخزين في HTML
   */
  static escapeProductForHTML(product) {
    // تحويل المنتج لـ JSON مع استبدال الـ quotes
    const productJson = JSON.stringify(product)
      .replace(/'/g, "\\'")
      .replace(/"/g, "&quot;");
    return productJson;
  }

  static checkImages() {
    const images = document.querySelectorAll(".product-card img");
    console.log(`التحقق من ${images.length} صورة...`);

    images.forEach((img, index) => {
      // تحقق إذا كانت الصورة محملة بنجاح
      if (img.complete && img.naturalHeight !== 0) {
        console.log(`✅ الصورة ${index + 1}: محملة بنجاح - ${img.src}`);
      } else {
        console.log(`⏳ الصورة ${index + 1}: جاري التحميل - ${img.src}`);

        img.addEventListener("load", function () {
          console.log(`✅ الصورة ${index + 1}: تم التحميل بنجاح - ${this.src}`);
        });

        img.addEventListener("error", function () {
          console.error(`❌ الصورة ${index + 1}: فشل التحميل - ${this.src}`);
          this.src = getImageUrl("../public/img/placeholder.webp");
        });
      }
    });
  }

  static checkImages() {
    const images = document.querySelectorAll(".product-card img");
    images.forEach((img) => {
      img.addEventListener("error", function () {
        console.warn("فشل تحميل الصورة:", this.src);
        this.src = "images/default-image.jpg";
      });

      img.addEventListener("load", function () {
        console.log("تم تحميل الصورة بنجاح:", this.src);
      });
    });
  }
  /**
   * Filter products by search term
   */
  static filterProducts(products, searchTerm) {
    if (!searchTerm) return products;

    const term = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
    );
  }
  /**
   * Sort products
   */
  static sortProducts(products, sortBy = "name") {
    const sortedProducts = [...products];

    switch (sortBy) {
      case "price-low":
        return sortedProducts.sort((a, b) => a.price - b.price);
      case "price-high":
        return sortedProducts.sort((a, b) => b.price - a.price);
      case "name":
      default:
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
  }
}

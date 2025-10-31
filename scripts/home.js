import { db } from "./firebase.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

class ProductLoader {
  constructor() {
    this.currentFilter = "all";
    this.productsGrid = document.getElementById("products-grid");
  }

  async loadProducts(filter = "all") {
    if (!this.productsGrid) return;

    this.showLoading();
    this.currentFilter = filter;

    try {
      let productsQuery = collection(db, "products");
      
      if (filter === "new") {
        productsQuery = query(productsQuery, where("isNew", "==", true));
      } else if (filter === "bestseller") {
        productsQuery = query(productsQuery, where("isBestseller", "==", true));
      }

      const snapshot = await getDocs(productsQuery);
      this.renderProducts(snapshot);
    } catch (error) {
      console.error("خطأ في تحميل المنتجات:", error);
      this.showError();
    }
  }

  renderProducts(snapshot) {
    this.productsGrid.innerHTML = "";

    // إضافة بطاقة التصميم المخصص أولاً
    this.addCustomizeCard();

    if (snapshot.empty) {
      this.productsGrid.innerHTML += '<p class="no-products">لا توجد منتجات حالياً</p>';
      return;
    }

    snapshot.forEach((doc) => {
      const product = doc.data();
      this.createProductCard(product, doc.id);
    });
  }

  addCustomizeCard() {
    const customizeCard = document.createElement("div");
    customizeCard.className = "product-card customize";
    customizeCard.innerHTML = `
      <div class="pro-img">
        <img src="https://res.cloudinary.com/dxbelrmq1/image/upload/customize_qcgbab.webp" 
             alt="صمم تشيرتك" />
      </div>
      <div class="pro-ditals">
        <div class="pro-name">صمم تشيرتك ...</div>
        <div class="pro-price">15000 ر.ي</div>
        <button class="add-to-cart">إضافة إلى السلة</button>
      </div>
    `;
    this.productsGrid.appendChild(customizeCard);
  }

  createProductCard(product, id) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="pro-img">
        <img src="${this.getImageUrl(product.images?.[0])}" 
             alt="${this.escapeHtml(product.name)}"
             loading="lazy" 
             onerror="this.src='./imgs/placeholder.webp'">
      </div>
      <div class="pro-ditals">
        <div class="pro-name">${this.escapeHtml(product.name)}</div>
        <div class="pro-price">${product.price} ر.ي</div>
        <button class="add-to-cart">إضافة إلى السلة</button>
      </div>
    `;

    // إضافة event listener للصورة
    const img = card.querySelector(".pro-img img");
    img.addEventListener("click", () => {
      this.navigateToProductDetails(product);
    });

    this.productsGrid.appendChild(card);
  }

  navigateToProductDetails(product) {
    try {
      localStorage.setItem("selectedProduct", JSON.stringify(product));
      window.location.href = "./product-details.html";
    } catch (error) {
      console.error("خطأ في حفظ المنتج:", error);
      // استخدام الطريقة البديلة
      window.location.href = `./product-details.html?id=${product.id}`;
    }
  }

  getImageUrl(image) {
    if (!image) return "./imgs/placeholder.webp";
    if (image.startsWith("http")) return image;
    return `https://res.cloudinary.com/dxbelrmq1/image/upload/${image}`;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showLoading() {
    this.productsGrid.innerHTML = '<p class="loading">جاري التحميل...</p>';
  }

  showError() {
    this.productsGrid.innerHTML = '<p class="error">حدث خطأ أثناء تحميل المنتجات</p>';
  }
}

// التهيئة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  const productLoader = new ProductLoader();
  productLoader.loadProducts();
  
  // جعل الدالة متاحة globally للفلترة
  window.filterProducts = (filter, event) => {
    if (event) {
      // إزالة active من جميع الأزرار وإضافتها للزر المضغوط
      document.querySelectorAll('.products-header button').forEach(btn => {
        btn.classList.remove('active');
      });
      event.target.classList.add('active');
    }
    productLoader.loadProducts(filter);
  };
});
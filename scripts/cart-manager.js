import { CartManager } from "./modules/cart.js";
import { formatPrice, getImageUrl, showNotification } from "./utils/helpers.js";

class CartPage {
  constructor() {
    this.cartContainer = document.getElementById("cart-container");
    this.isProcessing = false;
    this.init();
  }

  init() {
    this.renderCart();
    this.setupEventListeners();
  }

  renderCart() {
    if (!this.cartContainer) return;

    const cartSummary = CartManager.getCartSummary();

    if (cartSummary.items.length === 0) {
      this.renderEmptyCart();
      return;
    }

    this.renderCartItems(cartSummary);
  }

  renderEmptyCart() {
    this.cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-cart-shopping"></i>
                <h2>سلة التسوق فارغة</h2>
                <p>لم تقم بإضافة أي منتجات بعد</p>
                <a href="../index.html#products" class="btn btn-primary continue-shopping">
                    ابدأ التسوق الآن
                </a>
            </div>
        `;
  }

  renderCartItems(cartSummary) {
    const { items, subtotal, discount, total, currency } = cartSummary;

    this.cartContainer.innerHTML = `
            <div class="cart-layout">
                <div class="cart-items">
                    ${items
                      .map((item) => this.createCartItemHTML(item))
                      .join("")}
                </div>
                
                <div class="cart-summary">
                    <h2 class="summary-title">ملخص الطلب</h2>
                    
                    <div class="summary-row">
                        <span class="summary-label">المجموع الفرعي (${
                          items.length
                        } منتج)</span>
                        <span class="summary-value">${formatPrice(
                          subtotal,
                          currency
                        )}</span>
                    </div>
                    
                    ${
                      discount.amount > 0
                        ? `
                        <div class="summary-row">
                            <span class="summary-label">الخصم (10%)</span>
                            <span class="summary-value summary-discount">-${formatPrice(
                              discount.amount,
                              currency
                            )}</span>
                        </div>
                    `
                        : `
                        <div class="summary-discount-message">
                            خصم 10% للمشتريات الاكثر من 30,000ر.ي
                        </div>
                    `
                    }
                    
                    <div class="summary-row">
                        <span class="summary-label">المجموع الكلي</span>
                        <span class="summary-value summary-total">${formatPrice(
                          total,
                          currency
                        )}</span>
                    </div>
                    
                    <button class="btn btn-primary checkout-btn" id="checkout-btn">
                        <i class="fa-brands fa-whatsapp"></i>
                        إتمام الطلب عبر واتساب
                    </button>
                </div>
            </div>
        `;

    this.setupCartItemEvents();
  }

  createCartItemHTML(item) {
    return `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${getImageUrl(item.image)}" 
                         alt="${item.name}"
                         data-product-id="${item.id}"
                         class="cart-product-image clickable-image"
                         onerror="this.src='../public/img/placeholder.webp'">
                    <div class="image-overlay">
                        <i class="fa-solid fa-eye"></i>
                    </div>
                </div>
                
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <div class="cart-item-attributes">
                        ${
                          item.size
                            ? `<span class="cart-item-size">المقاس: ${item.size}</span>`
                            : ""
                        }
                        ${
                          item.color
                            ? `<span class="cart-item-color">اللون: ${item.color}</span>`
                            : ""
                        }
                    </div>
                    <p class="cart-item-price">${formatPrice(
                      item.price,
                      item.currency
                    )}</p>
                </div>
                
                <div class="cart-item-controls">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-action="decrease" 
                                ${item.quantity <= 1 ? "disabled" : ""}>
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn plus" data-action="increase"
                                ${item.quantity >= 20 ? "disabled" : ""}>
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <button class="cart-item-remove" data-action="remove">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
  }

  setupEventListeners() {
    window.addEventListener("cartUpdated", () => {
      this.renderCart();
    });

    document.addEventListener("click", (e) => {
      if (e.target.id === "checkout-btn" || e.target.closest("#checkout-btn")) {
        this.handleCheckout();
      }
    });
  }

  setupCartItemEvents() {
    this.cartContainer.removeEventListener("click", this.boundHandleCartClick);
    this.boundHandleCartClick = this.handleCartClick.bind(this);
    this.cartContainer.addEventListener("click", this.boundHandleCartClick);
  }

  handleCartClick(e) {
    if (this.isProcessing) return;

    // التحقق من النقر على صورة المنتج
    const productImage = e.target.closest(
      ".cart-product-image, .image-overlay, .clickable-image"
    );
    if (productImage) {
      e.preventDefault();
      e.stopPropagation();
      const cartItem = productImage.closest(".cart-item");
      const itemId = cartItem?.dataset.itemId;
      if (itemId) {
        this.navigateToProductDetails(itemId);
      }
      return;
    }

    const button = e.target.closest("button");
    if (!button) return;

    const cartItem = button.closest(".cart-item");
    const itemId = cartItem?.dataset.itemId;
    const action = button.dataset.action;

    if (!itemId || !action) return;

    e.preventDefault();
    e.stopPropagation();

    this.isProcessing = true;

    setTimeout(() => {
      this.handleCartAction(itemId, action);
      this.isProcessing = false;
    }, 150);
  }

  navigateToProductDetails(productId) {
    try {
      console.log("🔄 الانتقال إلى تفاصيل المنتج:", productId);

      const cart = CartManager.getCart();
      const product = cart.find((item) => item.id === productId);

      if (product) {
        // إنشاء كائن منتج كامل مع جميع البيانات المطلوبة
        const productData = {
          // البيانات الأساسية من المنتج في السلة
          ...product,

          // إضافة بيانات إضافية مطلوبة لصفحة التفاصيل
          id: product.id,
          name: product.name || "منتج",
          price: product.price || 0,
          currency: product.currency || "YER",
          image: product.image,
          images: product.images || [product.image],
          description:
            product.description || `${product.name} - منتج عالي الجودة`,

          // إذا كان هناك productId منفصل، احتفظ به
          productId: product.productId || product.id.split("_")[0], // استخراج الـ ID الأساسي من الـ ID المركب

          // الخيارات
          size: product.size,
          color: product.color,

          // بيانات افتراضية سيتم إثراؤها لاحقاً
          sizes: product.sizes || ["S", "M", "L", "XL"],
          colors: product.colors || ["أسود", "أبيض", "رمادي"],
          specs: product.specs || [
            { title: "النسيج", value: "قطن 100%" },
            { title: "الوزن", value: "180 جرام" },
          ],
        };

        console.log("💾 حفظ بيانات المنتج في localStorage:", productData);
        localStorage.setItem("selectedProduct", JSON.stringify(productData));

        // الانتقال إلى صفحة تفاصيل المنتج
        setTimeout(() => {
          window.location.href = `product-details.html?id=${productId}`;
        }, 100);
      } else {
        console.error("❌ المنتج غير موجود في السلة:", productId);
        showNotification("المنتج غير موجود في السلة", true);
      }
    } catch (error) {
      console.error("💥 خطأ في navigateToProductDetails:", error);
      showNotification("حدث خطأ في الانتقال إلى صفحة المنتج", true);
    }
  }

  handleCartAction(itemId, action) {
    switch (action) {
      case "increase":
        this.increaseQuantity(itemId);
        break;
      case "decrease":
        this.decreaseQuantity(itemId);
        break;
      case "remove":
        this.removeItem(itemId);
        break;
    }
  }

  increaseQuantity(itemId) {
    const cart = CartManager.getCart();
    const item = cart.find((item) => item.id === itemId);

    if (item && item.quantity < 20) {
      CartManager.updateQuantity(itemId, item.quantity + 1);
      showNotification("تم زيادة الكمية بنجاح");
    } else if (item?.quantity >= 20) {
      showNotification("الحد الأقصى للكمية هو 20", true);
    }
  }

  decreaseQuantity(itemId) {
    const cart = CartManager.getCart();
    const item = cart.find((item) => item.id === itemId);

    if (item && item.quantity > 1) {
      CartManager.updateQuantity(itemId, item.quantity - 1);
      showNotification("تم تقليل الكمية بنجاح");
    }
  }

  removeItem(itemId) {
    CartManager.removeItem(itemId);
    showNotification("تم حذف المنتج من السلة");
  }

  handleCheckout() {
    const cartSummary = CartManager.getCartSummary();

    if (cartSummary.items.length === 0) {
      showNotification("السلة فارغة!", true);
      return;
    }

    const message = this.createWhatsAppMessage(cartSummary);
    const phoneNumber = "+966500000000";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
    showNotification("جاري تحويلك إلى واتساب لإتمام الطلب");
  }

  createWhatsAppMessage(cartSummary) {
    const { items, subtotal, discount, total, currency } = cartSummary;

    let message = `مرحباً، أريد طلب المنتجات التالية من متجر نكست:\n\n`;

    items.forEach((item, index) => {
      message += `🛍️ المنتج ${index + 1}:\n`;
      message += `📦 الاسم: ${item.name}\n`;
      message += `🔢 الكمية: ${item.quantity}\n`;
      if (item.size) message += `📏 المقاس: ${item.size}\n`;
      if (item.color) message += `🎨 اللون: ${item.color}\n`;
      message += `💵 السعر: ${formatPrice(
        item.price * item.quantity,
        currency
      )}\n\n`;
    });

    message += `💰 المجموع الفرعي: ${formatPrice(subtotal, currency)}\n`;

    if (discount.amount > 0) {
      message += `🎁 الخصم: -${formatPrice(discount.amount, currency)}\n`;
    }

    message += `💎 المجموع الكلي: ${formatPrice(total, currency)}\n\n`;
    message += `شكراً لخدمتكم! 🎉`;

    return message;
  }
}

// تهيئة صفحة السلة عند التحميل
document.addEventListener("DOMContentLoaded", () => {
  new CartPage();
});

window.CartPage = CartPage;

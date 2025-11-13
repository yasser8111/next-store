import { loading } from "../core/utils.js";
import { updateCartBadge } from "../core/header.js";

/* =====================================================
   CONSTANTS
===================================================== */
const SHIPPING_COST = 2000;
const DISCOUNT_THRESHOLD = 35000;
const DISCOUNT_RATE = 0.1;

/* =====================================================
   DOM ELEMENTS
===================================================== */
const cartContainer = document.getElementById("cart-container");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const discountEl = document.getElementById("discount");
const totalEl = document.getElementById("cart-total");

/* =====================================================
   MAIN RENDER FUNCTION
===================================================== */
function renderCart() {
  loading(true, cartContainer);

  const cart = getCart();

  if (cart.length === 0) {
    renderEmptyCart();
    loading(false, cartContainer);
    return;
  }

  let subtotal = calculateSubtotal(cart);
  const discount = calculateDiscount(subtotal);
  const shipping = cart.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping - discount;

  renderCartItems(cart);
  renderSummary(subtotal, shipping, discount, total);
  attachCartEvents();
  updateCartBadge();

  loading(false, cartContainer);
}

/* =====================================================
   CART OPERATIONS
===================================================== */
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function calculateSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateDiscount(subtotal) {
  return subtotal >= DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;
}

/* =====================================================
   RENDERING FUNCTIONS
===================================================== */
function renderEmptyCart() {
  cartContainer.innerHTML = `<p class="empty-cart">سلتك فارغة حالياً</p>`;
  subtotalEl.textContent = "0";
  shippingEl.textContent = "0";
  discountEl.textContent = "0";
  totalEl.textContent = "0";
  updateCartBadge();
  updateDiscountBanner(0, 0);
}

function renderCartItems(cart) {
  cartContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";

    itemEl.innerHTML = `
      <img src="https://res.cloudinary.com/dxbelrmq1/image/upload/${
        item.image
      }" alt="${item.name}">
      <div class="cart-info">
        <h3>${item.name}</h3>
        <p>السعر: ${item.price.toLocaleString()} ${item.currency}</p>
        <p>المقاس: ${item.size || "-"}</p>
        <div class="quantity-controls">
          <button class="quantity-btn decrease" data-index="${index}">−</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn increase" data-index="${index}">+</button>
          <button class="remove-btn" data-index="${index}" title="حذف المنتج">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;

    cartContainer.appendChild(itemEl);
  });
}

function renderSummary(subtotal, shipping, discount, total) {
  subtotalEl.textContent = subtotal.toLocaleString();
  shippingEl.textContent = shipping.toLocaleString();

  discountEl.textContent =
    discount > 0 ? `- ${discount.toLocaleString()}` : `0`;

  totalEl.textContent = total.toLocaleString();

  // تحديث شريط الخصم العلوي
  updateDiscountBanner(subtotal, discount);
}

/* =====================================================
   DISCOUNT BANNER
===================================================== */
function updateDiscountBanner(subtotal, discount) {
  const banner = document.getElementById("discount-banner");

  if (!banner) return; // في حال لم يكن العنصر موجود

  if (subtotal >= DISCOUNT_THRESHOLD) {
    banner.textContent = "تم تطبيق خصم 10٪ على طلبك!";
    banner.classList.add("active");
    banner.classList.remove("inactive");
  } else {
    const diff = (DISCOUNT_THRESHOLD - subtotal).toLocaleString();
    banner.textContent = `اشترِ بأكثر من ${DISCOUNT_THRESHOLD.toLocaleString()} ريال لتحصل على خصم 10٪ (تبقى ${diff} ريال فقط)`;
    banner.classList.add("inactive");
    banner.classList.remove("active");
  }
}

/* =====================================================
   EVENT HANDLERS
===================================================== */
function attachCartEvents() {
  document
    .querySelectorAll(".increase")
    .forEach((btn) =>
      btn.addEventListener("click", () => updateQuantity(btn.dataset.index, 1))
    );

  document
    .querySelectorAll(".decrease")
    .forEach((btn) =>
      btn.addEventListener("click", () => updateQuantity(btn.dataset.index, -1))
    );

  document
    .querySelectorAll(".remove-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () => removeItem(btn.dataset.index))
    );
}

function updateQuantity(index, change) {
  const cart = getCart();
  const item = cart[index];
  if (!item) return;

  item.quantity = Math.max(1, item.quantity + change);
  saveCart(cart);
  renderCart();
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

/* =====================================================
   INIT
===================================================== */
document.addEventListener("DOMContentLoaded", renderCart);

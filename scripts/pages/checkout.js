// =====================================================
// CHECKOUT PAGE LOGIC
// =====================================================

import { fixImageUrl } from "../modules/load-products.js";

// DOM
const orderNumberInput = document.getElementById("order-number");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

const customerNameInput = document.getElementById("customer-name");
const customerPhoneInput = document.getElementById("customer-phone");
const citySelect = document.getElementById("customer-city");
const customCityGroup = document.getElementById("custom-city-group");
const customCityInput = document.getElementById("custom-city");
const addressInput = document.getElementById("customer-address");
const noteInput = document.getElementById("customer-note");

// =====================================================
// توليد رقم الطلب
// =====================================================
const randomOrderNumber = "NX-" + Math.floor(100000 + Math.random() * 900000);
orderNumberInput.value = randomOrderNumber;

// =====================================================
// جلب السلة
// =====================================================
function getCart() {
  const cart = JSON.parse(localStorage.getItem("cart"));
  return Array.isArray(cart) ? cart : [];
}

// =====================================================
// إظهار حقل "أخرى"
// =====================================================
citySelect.addEventListener("change", () => {
  if (citySelect.value === "أخرى") {
    customCityGroup.style.display = "block";
  } else {
    customCityGroup.style.display = "none";
    customCityInput.value = "";
  }
});

// =====================================================
// عرض المنتجات في السلة
// =====================================================
function renderCartSummary() {
  const cart = getCart();

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>السلة فارغة.</p>";
    cartTotalEl.textContent = "0 ر.س";
    return;
  }

  let total = 0;
  cartItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <img src="${
        fixImageUrl(item.mainImage) || fixImageUrl(item.image)
      }" class="cart-img" />

      <div class="cart-info">
        <strong>${item.name}</strong>
        <p>الكمية: ${item.quantity}</p>
        <p>المقاس: ${item.size || "-"}</p>
      </div>

      <div class="cart-price">
        ${itemTotal} ر.س
      </div>
    `;

    cartItemsContainer.appendChild(div);
  });

  cartTotalEl.textContent = `${total} ر.س`;
}

renderCartSummary();

// =====================================================
// إرسال الطلب لقاعدة البيانات
// =====================================================
import { createOrder } from "../modules/orders.js";

document
  .getElementById("confirm-order-btn")
  .addEventListener("click", async () => {
    const name = customerNameInput.value.trim();
    const phone = customerPhoneInput.value.trim();
    const selectedCity = citySelect.value;
    const customCity = customCityInput.value.trim();
    const address = addressInput.value.trim();
    const note = noteInput.value.trim();

    const city = selectedCity === "أخرى" ? customCity : selectedCity;

    if (!name || !phone || !city || !address) {
      alert("يرجى تعبئة جميع البيانات المطلوبة.");
      return;
    }

    const cart = getCart();
    if (cart.length === 0) {
      alert("السلة فارغة! لا يمكن تأكيد الطلب.");
      return;
    }

    let total = 0;
    cart.forEach((item) => (total += item.price * item.quantity));

    const orderData = {
      userName: name,
      userPhone: phone,
      userAddress: address,
      location: {
        area: city,
        other: selectedCity === "أخرى" ? customCity : "",
        details: "",
      },
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        selectedSize: item.size || "",
        price: item.price,
      })),
      totalAmount: total,
      currency: "YER",
      note: note || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const success = await createOrder(orderData);
    if (!success) {
      alert("حدث خطأ أثناء إرسال الطلب.");
      return;
    }

    const whatsappNumber = "967770583685";
    window.open(`https://wa.me/${whatsappNumber}`, "_blank");
  });

// =====================================================
// CHECKOUT PAGE LOGIC
// =====================================================

// توليد رقم الطلب العشوائي
const orderNumberInput = document.getElementById("order-number");
const randomOrderNumber = "NX-" + Math.floor(100000 + Math.random() * 900000);
orderNumberInput.value = randomOrderNumber;

// تحميل السلة من localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const customerNameInput = document.getElementById("customer-name");

// عرض السلة
function renderCartSummary() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>السلة فارغة.</p>";
    return;
  }

  let total = 0;
  cartItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item.name} × ${item.quantity}</span>
      <span>${item.price * item.quantity} ر.س</span>
    `;
    total += item.price * item.quantity;
    cartItemsContainer.appendChild(div);
  });

  cartTotalEl.textContent = `${total} ر.س`;
}

renderCartSummary();

// تأكيد الطلب عبر واتساب
document.getElementById("confirm-order-btn").addEventListener("click", () => {
  const name = customerNameInput.value.trim();
  if (!name) {
    alert("يرجى إدخال اسمك لإتمام الطلب.");
    return;
  }

  let message = `مرحبًا، أنا ${name}%0A`;
  message += `رقم الطلب: ${randomOrderNumber}%0A`;
  message += `ملخص الطلب:%0A`;

  cart.forEach((item) => {
    message += `- ${item.name} × ${item.quantity} = ${
      item.price * item.quantity
    } ر.س%0A`;
  });

  message += `%0Aالإجمالي: ${cartTotalEl.textContent}%0A`;
  message += `لقد قمت بالتحويل عبر بنك العمقي أو البسيري، وسأرسل السند الآن.`;

  const whatsappNumber = "966500000000"; // غيّر هذا إلى رقم المتجر
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
  window.open(whatsappURL, "_blank");
});

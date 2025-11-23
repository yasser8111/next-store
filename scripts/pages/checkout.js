// =====================================================
// CHECKOUT PAGE LOGIC
// =====================================================

// عناصر DOM
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

// توليد رقم الطلب العشوائي
const randomOrderNumber = "NX-" + Math.floor(100000 + Math.random() * 900000);
orderNumberInput.value = randomOrderNumber;

// دالة لجلب السلة من localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart"));
}

// =====================================================
// إظهار حقل "أخرى" للمدينة
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
// عرض السلة وحساب الإجمالي
// =====================================================
function renderCartSummary() {
  const cart = getCart(); // جلب السلة في كل مرة
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>السلة فارغة.</p>";
    cartTotalEl.textContent = "0 ر.س";
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

// استدعاء عند تحميل الصفحة
renderCartSummary();

// =====================================================
// استدعاء createOrder من قاعدة البيانات
// =====================================================
import { createOrder } from "../modules/orders.js";

// =====================================================
// زر تأكيد الطلب: رفع الطلب + فتح واتساب بدون رسالة
// =====================================================
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

    // التحقق من البيانات المطلوبة
    if (!name || !phone || !city || !address) {
      alert("يرجى تعبئة جميع البيانات المطلوبة.");
      return;
    }

    const cart = getCart(); // جلب السلة عند الضغط

    if (!cart.length) {
      alert("سلتك فارغة! لا يمكن تأكيد الطلب.");
      return;
    }

    // حساب الإجمالي
    let total = 0;
    cart.forEach((item) => (total += item.price * item.quantity));

    // تجهيز بيانات الطلب طبق الهيكل الجديد
    const orderData = {
      orderNumber: randomOrderNumber,
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

    // رفع الطلب إلى قاعدة البيانات
    const success = await createOrder(orderData);
    if (!success) {
      alert("حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.");
      return;
    }

    // رقم المتجر للواتساب (غيّره لاحقًا)
    const whatsappNumber = "966500000000";

    // فتح واتساب بدون رسالة
    const whatsappURL = `https://wa.me/${whatsappNumber}`;
    window.open(whatsappURL, "_blank");
  });

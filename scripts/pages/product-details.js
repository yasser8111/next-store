import { addToCart } from "../modules/cart.js";
import { showToast } from "../modules/toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("product-details");
  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  if (!product) {
    container.innerHTML = "<p>لم يتم اختيار منتج</p>";
    return;
  }

  // Product status
  const statusHTML =
    product.status === "available"
      ? `<p class="price"><span class="currency">${product.currency}</span>${product.price}</p>`
      : `<p class="status">غير متوفر حالياً</p>`;

  // Size options
  let sizesHTML = "";
  if (product.sizes && product.sizes.length > 0) {
    sizesHTML = `<div class="sizes-container">
      <p>اختر المقاس:</p>
      <div class="sizes-buttons">
        ${product.sizes
          .map(
            (size) =>
              `<button class="size-btn" data-size="${size}">${size}</button>`
          )
          .join("")}
      </div>
    </div>`;
  }

  // Swiper images
  const imagesHTML = `
    <div class="swiper mySwiper">
      <div class="swiper-wrapper">
        ${product.images
          .map(
            (img) => `<div class="swiper-slide">
                    <img src="https://res.cloudinary.com/dxbelrmq1/image/upload/${img}" alt="${product.name}" />
                  </div>`
          )
          .join("")}
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-next"><i class="fa-solid fa-caret-left"></i></div>
      <div class="swiper-button-prev"><i class="fa-solid fa-caret-right"></i></div>
    </div>
  `;

  // Render product details
  container.innerHTML = `
    <div class="product-details">
      <div class="product-images">
        ${imagesHTML}
      </div>
      <div class="d-product-info">
        <h1>${product.name}</h1>
        ${statusHTML}
        <p class="description">${
          product.description || "لا يوجد وصف لهذا المنتج"
        }</p>
        ${sizesHTML}
        <button class="btn-add-to-cart" ${
          product.status !== "available" ? "disabled" : ""
        }>
          أضف إلى السلة
        </button>
      </div>
    </div>
  `;

  const addToCartBtn = document.querySelector(".btn-add-to-cart");
  addToCartBtn.addEventListener("click", () => {
    const selectedSizeBtn = document.querySelector(".size-btn.selected");
    const selectedSize = selectedSizeBtn ? selectedSizeBtn.dataset.size : null;

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      showToast("يرجى اختيار المقاس أولاً!", "warning", 4000);
      return;
    }

    addToCart(product, selectedSize);
    showToast(
      "تمت إضافة المنتج إلى السلة بنجاح!",
      "success",
      4000,
      "./cart.html"
    );
  });

  // Initialize Swiper
  const swiper = new Swiper(".mySwiper", {
    loop: true,
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  // Size selection
  const sizeButtons = document.querySelectorAll(".size-btn");
  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
});

import { fetchProducts } from "../firebase/firestore.js";
import { loading } from "../core/utils.js";

/**
 * Fix image URL if it doesn't have a full path
 * @param {string} url - Original image path
 * @returns {string} - Fixed full URL
 */
function fixImageUrl(url) {
  if (!url) return "https://res.cloudinary.com/dxbelrmq1/image/upload/default.jpg";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://res.cloudinary.com/dxbelrmq1/image/upload/${url}`;
}

/**
 * Load products into a grid with optional filters and sorting
 * @param {Object} options
 * @param {string} options.containerSelector - CSS selector for products grid
 * @param {string} [options.searchTerm] - Filter by name
 * @param {string} [options.sort] - Sorting method ("price-asc" | "price-desc")
 */
export async function loadProducts({
  containerSelector = ".products-grid",
  searchTerm = "",
  sort = "",
} = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  loading(true, container);

  try {
    let products = await fetchProducts();

    // ---------- Apply search ----------
    if (searchTerm) {
      const term = searchTerm.trim().toLowerCase();
      products = products.filter((p) =>
        p.name.toLowerCase().includes(term)
      );
    }

    // ---------- Apply sorting ----------
    if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") products.sort((a, b) => b.price - a.price);

    // ---------- Render products ----------
    container.innerHTML = "";
    if (!products.length) {
      container.innerHTML = `<p class="empty">لا توجد منتجات مطابقة</p>`;
      return;
    }

    products.forEach((product) => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      card.innerHTML = `
        <div class="product-image">
          <img src="${fixImageUrl(product.images[0])}" alt="${product.name}" />
          ${
            product.images[1]
              ? `<img class="hover-img" src="${fixImageUrl(
                  product.images[1]
                )}" alt="${product.name}" />`
              : ""
          }
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="product-bottom">
            ${
              product.status === "available"
                ? `<p class="price"><span class="currency">${product.currency}</span>${product.price.toLocaleString()}</p>`
                : `<p class="coming-soon">قريباً</p>`
            }
            <a href="#" class="icon-add-to-cart" onclick="event.stopPropagation()">
              <i class="fas fa-shopping-cart"></i>
            </a>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        window.location.href = "./product-details.html";
      });

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load products:", err);
    container.innerHTML = `<p class="error-msg">حدث خطأ أثناء تحميل المنتجات</p>`;
  } finally {
    loading(false, container);
  }
}

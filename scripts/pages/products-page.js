import { loadProducts } from "../modules/load-products.js";
import { loading } from "../core/utils.js";

/* =====================================================
   DOM ELEMENTS
===================================================== */

const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const sortSelect = document.getElementById("sort-filter");

// =====================================================
// CHECK FOR SEARCH QUERY FROM HEADER
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const savedQuery = localStorage.getItem("searchQuery");
  if (savedQuery && searchInput) {
    searchInput.value = savedQuery;
    applyFilters();
    localStorage.removeItem("searchQuery");
  }
});

/* =====================================================
   INITIAL LOAD
===================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  if (!productsGrid) return;

  const savedQuery = localStorage.getItem("searchQuery");
  const urlParams = new URLSearchParams(window.location.search);
  const autoSearch = urlParams.get("autoSearch") === "true";

  loading(true, productsGrid);

  if (savedQuery && autoSearch && searchInput) {
    searchInput.value = savedQuery;
    await loadProducts({
      containerSelector: "#products-grid",
      searchTerm: savedQuery,
    });
    localStorage.removeItem("searchQuery");
  } else {
    await loadProducts({ containerSelector: "#products-grid" });
  }
  loading(false, productsGrid);
});

/* =====================================================
   SEARCH & SORT FUNCTION
===================================================== */
function applyFilters() {
  if (!productsGrid) return;

  const searchTerm = searchInput?.value || "";
  const sort = sortSelect?.value || "";

  loadProducts({
    containerSelector: "#products-grid",
    searchTerm,
    sort,
  });
}

/* =====================================================
   EVENT LISTENERS
===================================================== */
let debounceTimer;
searchInput?.addEventListener("keyup", (e) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (e.key === "Enter") applyFilters();
  }, 300);
});
searchBtn?.addEventListener("click", applyFilters);
sortSelect?.addEventListener("change", applyFilters);

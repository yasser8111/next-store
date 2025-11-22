import { showToast } from "../modules/toast.js";

// ===================== Update Cart Badge =====================
export function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const badge = document.querySelector(".cart-badge");

  if (!badge) return;

  const totalQty = cart.reduce((total, item) => total + item.quantity, 0);

  if (totalQty === 0) {
    badge.style.display = "none";
    return;
  }

  // Show badge
  badge.style.display = "flex";
  badge.textContent = totalQty;

  // Add/remove big class
  if (totalQty >= 10) {
    badge.classList.add("big");
  } else {
    badge.classList.remove("big");
  }
}

// ===================== Header Scroll Detection =====================
function handleHeaderScroll() {
  const header = document.querySelector("header");
  if (!header) return;
  header.classList.toggle("top", window.scrollY >= 70);
}

// ===================== Initialize Header Scripts =====================
export function initHeader() {
  const hamburger = document.querySelector(".hamburger");
  const drawer = document.querySelector(".mobile-drawer");
  let drawerOverlay = document.querySelector(".mobile-drawer-close");

  if (!hamburger || !drawer) return;

  if (!drawerOverlay) {
    drawerOverlay = document.createElement("div");
    drawerOverlay.className = "mobile-drawer-close";
    document.body.appendChild(drawerOverlay);
  }

  function toggleDrawer() {
    const isActive = drawer.classList.toggle("active");
    hamburger.classList.toggle("active", isActive);
    drawerOverlay.classList.toggle("active", isActive);
  }

  hamburger.addEventListener("click", toggleDrawer);
  drawerOverlay.addEventListener("click", toggleDrawer);

  updateCartBadge();

  // Scroll behavior
  handleHeaderScroll();
  window.addEventListener("scroll", handleHeaderScroll);

  // Search behavior
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");

  function goToProductsSearch() {
    const query = searchInput?.value.trim();
    if (query) localStorage.setItem("searchQuery", query);
    window.location.href = "./products.html?autoSearch=true";
  }

  searchBtn?.addEventListener("click", goToProductsSearch);
  searchInput?.addEventListener("keyup", (e) => {
    if (e.key === "Enter") goToProductsSearch();
  });
}

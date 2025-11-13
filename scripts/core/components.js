// ===================== PAGE LOADER =====================
export function loading(show = true, parent = null) {
  let loader = document.getElementById("page-loader");

  if (!loader) {
    loader = document.createElement("div");
    loader.id = "page-loader";
    loader.innerHTML = `
      <div class="spinner">
        <div class="dot1"></div>
        <div class="dot2"></div>
      </div>
    `;
    loader.classList.add("hidden");
  }
  
  if (parent) {
    loader.style.position = "absolute";
    parent.style.position = "relative";
    if (!parent.contains(loader)) parent.appendChild(loader);
  } else {
    loader.style.position = "fixed";
    if (!document.body.contains(loader)) document.body.appendChild(loader);
  }
  if (show) loader.classList.remove("hidden");
  else loader.classList.add("hidden");
}

// ===================== Helper: Load HTML =====================
export function loadHTML(selectorId, filePath) {
  const placeholder = document.getElementById(selectorId);
  if (!placeholder) return;

  loading(true);

  fetch(filePath)
    .then((response) => response.text())
    .then((data) => {
      placeholder.innerHTML = data;
      if (selectorId === "header-placeholder") initHeader();

      loading(false);
    })
    .catch((err) => {
      console.error(`Failed to load ${filePath}:`, err);
      loading(false);
    });
}

// ===================== Update Cart Badge =====================
export function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const badge = document.querySelector(".cart-badge");

  if (!badge) return;

  if (cart.length === 0) badge.style.display = "none";
  else {
    badge.style.display = "flex";
    badge.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  }
}

// ===================== Header Scroll Detection =====================
function handleHeaderScroll() {
  const header = document.querySelector("header");
  if (!header) return;
  if (window.scrollY < 100) {
    header.classList.remove("top");
  } else {
    header.classList.add("top");
  }
}

// ===================== Initialize Header Scripts =====================
export function initHeader() {
  const hamburger = document.querySelector(".hamburger");
  const drawer = document.querySelector(".mobile-drawer");
  const drawerOverlay = document.querySelector(".mobile-drawer-close");

  if (!hamburger || !drawer || !drawerOverlay) return;

  function toggleDrawer() {
    const isActive = drawer.classList.toggle("active");
    hamburger.classList.toggle("active", isActive);
    drawerOverlay.classList.toggle("active", isActive);
  }

  hamburger.addEventListener("click", toggleDrawer);
  drawerOverlay.addEventListener("click", toggleDrawer);
  updateCartBadge();

  // ===================== Header Scroll Event =====================
  handleHeaderScroll();
  window.addEventListener("scroll", handleHeaderScroll);

  // ===================== Header Search Redirect =====================
  const headerSearchInput = document.getElementById("search-input");
  const headerSearchBtn = document.getElementById("search-btn");

  function goToProductsSearch() {
    const query = headerSearchInput.value.trim();
    if (query) {
      localStorage.setItem("searchQuery", query);
    }

    window.location.href = "./products.html?autoSearch=true";
  }
  headerSearchBtn?.addEventListener("click", goToProductsSearch);
  headerSearchInput?.addEventListener("keyup", (e) => {
    if (e.key === "Enter") goToProductsSearch();
  });
}

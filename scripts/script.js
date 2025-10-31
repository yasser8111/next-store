// =====================================================
// Notification System
// =====================================================
export function showNotification(message, type = "info", duration = 4000) {
  const containerId = "custom-toast-container";
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
    Object.assign(container.style, {
      position: "fixed",
      top: "110px",
      right: "20px",
      zIndex: "9999",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    });
  }
  const toast = document.createElement("div");
  toast.className = "custom-toast";
  toast.textContent = message;
  const colors = {
    success: "#4CAF50",
    error: "#F44336",
    warning: "#FF9800",
    info: "#2196F3",
  };

  Object.assign(toast.style, {
    background: colors[type] || colors.info,
  });
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  });
  const timeout = setTimeout(() => removeToast(toast), duration);
  toast.addEventListener("click", () => removeToast(toast));

  function removeToast(t) {
    clearTimeout(timeout);
    t.style.opacity = "0";
    t.style.transform = "translateX(100%)";
    setTimeout(() => t.remove(), 400);
  }
}

// =====================================================
// Cart Management Functions
// =====================================================
function updateMobileCartCounter() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const mobileCounter = document.querySelector(".cart-counter-mobile");

  if (mobileCounter) {
    mobileCounter.textContent = totalItems;
    mobileCounter.style.display = totalItems > 0 ? "flex" : "none";
  }
}

export function updateCartIcon() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartIcons = document.querySelectorAll(".cart-icon");
  cartIcons.forEach((icon) => {
    const oldCounter = icon.querySelector(".cart-counter");
    if (oldCounter) oldCounter.remove();

    if (totalItems > 0) {
      const counter = document.createElement("span");
      counter.className = "cart-counter";
      counter.textContent = totalItems;
      counter.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        background: #e74c3c;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      `;
      icon.style.position = "relative";
      icon.appendChild(counter);
    }
  });
  updateMobileCartCounter();
}

// =====================================================
// Mobile Menu Functions
// =====================================================
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger-menu");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      const icon = this.querySelector("i");
      const isOpen = mobileMenu.classList.toggle("active");
      icon.classList.toggle("fa-bars", !isOpen);
      icon.classList.toggle("fa-times", isOpen);
      this.classList.toggle("active");
    });

    document.querySelectorAll(".mobile-nav-link").forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("active");
        hamburger.querySelector("i").classList.replace("fa-times", "fa-bars");
      });
    });
  }
}

// =====================================================
// Active Page Detection
// =====================================================
function updateActiveLinks() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((link) => {
    link.classList.remove("active");
  });
  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (linkHref) {
      const linkPage = linkHref.split("/").pop();
      if (
        (currentPage === "index.html" || currentPage === "") &&
        (linkPage === "index.html" ||
          linkPage === "./index.html" ||
          linkHref === "./")
      ) {
        link.classList.add("active");
      }
      else if (linkPage === currentPage) {
        link.classList.add("active");
      }
      else if (linkHref.startsWith("#") && window.location.hash === linkHref) {
        link.classList.add("active");
      }
    }
  });
}

// =====================================================
// Component Loading System
// =====================================================
async function loadComponent(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
    if (elementId === "header") {
      initMobileMenu();
      updateActiveLinks();
    }
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
}

// =====================================================
// Initialization
// =====================================================

function initializeApp() {
  loadComponent("header", "./components/header.html");
  loadComponent("footer", "./components/footer.html");

  updateCartIcon();
  window.addEventListener("hashchange", updateActiveLinks);
}
document.addEventListener("DOMContentLoaded", initializeApp);

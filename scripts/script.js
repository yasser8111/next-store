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

export function updateCartIcon() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  updateAllCounters(totalItems);
}
function updateAllCounters(totalItems) {
  const elements = document.querySelectorAll(
    ".cart-icon, .hamburger-menu, .cart-counter-mobile, .mobile-nav-link-cart"
  );
  elements.forEach((element) => {
    const existingCounter = element.querySelector(".cart-counter");
    if (existingCounter) {
      existingCounter.remove();
    }
    if (totalItems > 0) {
      const counter = document.createElement("span");
      counter.className = "cart-counter";
      counter.textContent = totalItems;
      element.style.position = "relative";
      element.appendChild(counter);
    }
    if (element.classList.contains("cart-counter-mobile")) {
      element.style.display = totalItems > 0 ? "flex" : "none";
      element.textContent = totalItems;
    }
  });
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

      // تحديث العداد عند فتح/إغلاق القائمة
      updateCartIcon();
    });

    document.querySelectorAll(".mobile-nav-link").forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("active");
        const hamburger = document.querySelector(".hamburger-menu");
        if (hamburger) {
          hamburger.querySelector("i").classList.replace("fa-times", "fa-bars");
          hamburger.classList.remove("active");
        }
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
      } else if (linkPage === currentPage) {
        link.classList.add("active");
      } else if (
        linkHref.startsWith("#") &&
        window.location.hash === linkHref
      ) {
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
      // تحديث أيقونة السلة بعد تحميل الهيدر
      setTimeout(updateCartIcon, 100);
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

  // تحديث أيقونة السلة فور تحميل الصفحة
  updateCartIcon();

  // الاستماع للتغييرات في localStorage لتحديث العداد تلقائياً
  window.addEventListener("storage", updateCartIcon);

  // تحديث العداد عند تغيير الهاش
  window.addEventListener("hashchange", function () {
    updateActiveLinks();
    updateCartIcon();
  });

  // تحديث العداد كل ثانية للتقاط التغييرات (اختياري)
  setInterval(updateCartIcon, 1000);
}

document.addEventListener("DOMContentLoaded", initializeApp);

// ===== NAVBAR FUNCTIONALITY =====
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

// ==== Smooth scroll with offset =====
function setupSmoothScroll() {
  const nav = document.querySelector(".navbar");

  const getOffset = () =>
    (nav?.offsetHeight || 0) + (window.innerWidth >= 992 ? 24 : 12);

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - getOffset();
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  // Handle internal link clicks
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute("href").slice(1);
    if (!id) return;

    e.preventDefault();
    history.replaceState(null, "", "#" + id);
    scrollToId(id);
  });

  // Handle page load with hash
  window.addEventListener("load", () => {
    if (location.hash) scrollToId(location.hash.slice(1));
  });

  // Handle back/forward navigation
  window.addEventListener("hashchange", () => {
    if (location.hash) scrollToId(location.hash.slice(1));
  });
}

// ==== Mobile navigation toggle =====
function setupMobileNav() {
  if (!navToggle || !navMenu) return;

  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    navMenu.classList.toggle("show");
    navToggle.classList.toggle("active");
  });

  // Close menu when clicking on links
  navMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navMenu.classList.remove("show");
      navToggle.classList.remove("active");
    }
  });

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    if (
      !navMenu.contains(event.target) &&
      !navToggle.contains(event.target) &&
      navMenu.classList.contains("show")
    ) {
      navMenu.classList.remove("show");
      navToggle.classList.remove("active");
    }
  });
}

// ===== CART BADGE SYSTEM =====
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("nextstore_cart_cart") || "[]");
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const cartElements = document.querySelectorAll(
    ".cart-btn, .cart-linke, [data-cart-badge]"
  );

  cartElements.forEach((element) => {
    let badge = element.querySelector(".cart-count");

    if (totalItems > 0) {
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "cart-count";
        element.appendChild(badge);
      }
      badge.textContent = totalItems > 99 ? "99+" : totalItems;
    } else if (badge) {
      badge.remove();
    }
  });
}

// ===== init cart badge =====
function initCartBadge() {
  updateCartCount();

  // Listen for cart updates from other tabs
  window.addEventListener("storage", (e) => {
    if (e.key === "nextstore_cart_cart") {
      updateCartCount();
    }
  });

  // Listen for custom cart update events
  window.addEventListener("cartUpdated", () => {
    updateCartCount();
  });
}

// ===== NOTIFICATION SYSTEM =====
function showMessage(message, isError = false) {
  // Remove existing messages
  const existingMessages = document.querySelectorAll(
    "#global-message, .notification"
  );
  existingMessages.forEach((msg) => msg.remove());

  // Create new message
  const messageDiv = document.createElement("div");
  messageDiv.id = "global-message";
  messageDiv.className = `notification ${isError ? "error" : "success"}`;
  messageDiv.textContent = message;

  document.body.appendChild(messageDiv);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.style.animation = "slideUp 0.3s ease-out forwards";
      setTimeout(() => messageDiv.remove(), 300);
    }
  }, 5000);

  return messageDiv;
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function setupPerformance() {
  // Lazy loading for images
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

// ===== INITIALIZATION =====
function init() {
  setupSmoothScroll();
  setupMobileNav();
  initCartBadge();
  setupPerformance();

  console.log("🚀 Next Store initialized successfully!");
}

// ===== USER STATE MANAGEMENT =====
function updateUserState() {
  const userAvatar = document.getElementById("user-avatar");
  const authBtn = document.getElementById("auth-btn");

  if (!userAvatar || !authBtn) return;

  // التحقق من حالة تسجيل الدخول
  const userData = localStorage.getItem("nextstore_user");
  const isLoggedIn = userData !== null;

  if (isLoggedIn) {
    userAvatar.style.display = "block";
    authBtn.style.display = "none";

    // تحديث صورة المستخدم إذا كانت موجودة
    const user = JSON.parse(userData);
    if (user && user.photoURL) {
      document.querySelector(".user-avatar img").src = user.photoURL;
    }
  } else {
    userAvatar.style.display = "none";
    authBtn.style.display = "flex";
  }
}

// ===== Set up logout =====
function setupLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (confirm("هل أنت متأكد من تسجيل الخروج؟")) {
        localStorage.removeItem("nextstore_user");
        updateUserState();
        showNotification("تم تسجيل الخروج بنجاح");

        // إعادة التوجيه إلى الصفحة الرئيسية بعد التسجيل الخروج
        setTimeout(() => {
          window.location.href = ".../index.html";
        }, 1000);
      }
    });
  }
}

// ===== Storage setup listener =====
function setupStorageListener() {
  window.addEventListener("storage", function (e) {
    if (e.key === "nextstore_user") {
      updateUserState();
    }
  });
}

// ===== =====
document.addEventListener("DOMContentLoaded", function () {
  updateUserState();
  setupLogout();
  setupStorageListener();
});

// ===== Initialize when DOM is ready =====
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// ===== GLOBAL EXPORTS =====
window.updateUserState = updateUserState;
window.showMessage = showMessage;
window.updateCartCount = updateCartCount;

// ===== Make functions available for other modules =====
export { showMessage, updateCartCount };

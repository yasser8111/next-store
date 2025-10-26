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
  try {
    const cart = JSON.parse(localStorage.getItem("nextstore_cart") || "[]");
    const totalItems = cart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );

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
  } catch (error) {
    console.error("Error updating cart count:", error);
  }
}

// ===== init cart badge =====
function initCartBadge() {
  updateCartCount();

  // Listen for cart updates from other tabs
  window.addEventListener("storage", (e) => {
    if (e.key === "nextstore_cart") {
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
  messageDiv.style.cssText = `
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    padding: 1rem 2rem;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    z-index: 10000;
    background: ${isError ? "#ff4d4d" : "#4CAF50"};
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    animation: slideDown 0.3s ease-out;
  `;

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

// ===== FIREBASE AUTH INTEGRATION =====
let auth = null;
let onAuthStateChanged = null;
let signOut = null;

async function initializeFirebase() {
  try {
    // استيراد من ملف firebase.js المحلي
    const firebaseModule = await import("./modules/firebase.js");

    // استخراج الدوال من الموديول
    const {
      auth: firebaseAuth,
      onAuthStateChanged: authStateChanged,
      signOut: firebaseSignOut,
    } = firebaseModule;

    auth = firebaseAuth;
    onAuthStateChanged = authStateChanged;
    signOut = firebaseSignOut;

    console.log("✅ Firebase initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    return false;
  }
}

// ===== USER STATE MANAGEMENT =====
function setupAuthStateListener() {
  if (!auth) {
    console.log("❌ Auth not initialized, skipping auth listener");
    return;
  }

  onAuthStateChanged(auth, (user) => {
    console.log("🔄 Auth state changed:", user ? user.email : "No user");
    updateUserState(user);

    if (user) {
      // حفظ بيانات المستخدم في localStorage
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      localStorage.setItem("nextstore_user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("nextstore_user");
    }
  });
}

function updateUserState(user) {
  const userAvatar = document.getElementById("user-avatar");
  const authBtn = document.getElementById("auth-btn");

  console.log("🔄 Updating user state:", user ? "Logged in" : "Logged out");
  console.log(
    "🔄 Found elements - userAvatar:",
    !!userAvatar,
    "authBtn:",
    !!authBtn
  );

  if (!userAvatar || !authBtn) {
    console.log("❌ User avatar or auth button not found in DOM");
    return;
  }

  if (user) {
    // المستخدم مسجل الدخول
    userAvatar.style.display = "block";
    authBtn.style.display = "none";

    // تحديث صورة المستخدم
    if (user.photoURL) {
      const userImg = userAvatar.querySelector("img");
      if (userImg) {
        userImg.src = user.photoURL;
        userImg.alt = user.displayName || "User";
      }
    }

    // تحديث اسم المستخدم في القائمة
    const userNameElement = userAvatar.querySelector(".user-name");
    if (userNameElement) {
      userNameElement.textContent = user.displayName || user.email || "مستخدم";
      console.log("✅ Updated user name:", userNameElement.textContent);
    }
  } else {
    // المستخدم غير مسجل
    userAvatar.style.display = "none";
    authBtn.style.display = "flex";
  }
}

// ===== Set up logout =====
function setupLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (confirm("هل أنت متأكد من تسجيل الخروج؟")) {
        try {
          await signOut(auth);
          showMessage("تم تسجيل الخروج بنجاح");

          setTimeout(() => {
            window.location.href = "../index.html";
          }, 1000);
        } catch (error) {
          console.error("Logout error:", error);
          showMessage("حدث خطأ أثناء تسجيل الخروج", true);
        }
      }
    });
    console.log("✅ Logout button setup complete");
  } else {
    console.log("❌ Logout button not found");
  }
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

// ===== MANUAL USER STATE CHECK =====
function checkManualUserState() {
  const savedUser = localStorage.getItem("nextstore_user");
  if (savedUser) {
    try {
      const userData = JSON.parse(savedUser);
      console.log("📦 Loaded user from localStorage:", userData.email);
      updateUserState(userData);
    } catch (error) {
      console.error("Error parsing saved user:", error);
    }
  }
}

// ===== INITIALIZATION =====
async function init() {
  console.log("🚀 Initializing Next Store...");

  setupSmoothScroll();
  setupMobileNav();
  initCartBadge();
  setupPerformance();

  // Initialize Firebase
  const firebase = await initializeFirebase();
  if (firebase) {
    setupAuthStateListener();
    setupLogout();
  }

  // Check user state from localStorage as fallback
  checkManualUserState();

  console.log("🚀 Next Store initialized successfully!");
}

// ===== Initialize when DOM is ready =====
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// ===== GLOBAL EXPORTS =====
window.showMessage = showMessage;
window.updateCartCount = updateCartCount;
window.updateUserState = updateUserState;

// ===== Make functions available for other modules =====
export { showMessage, updateCartCount, updateUserState };

import { APP_CONFIG, COLOR_MAP } from "./constants.js";

/**
 * Format price with currency
 */
export const formatPrice = (price, currency = APP_CONFIG.CURRENCY) => {
  const priceNumber = parseFloat(price) || 0;

  const formats = {
    YER: (p) => `${p.toLocaleString("ar-YE")} ر.ي`,
    SAR: (p) => `${p.toLocaleString("ar-SA")} ر.س`,
    USD: (p) => `$${p.toLocaleString()}`,
  };

  return formats[currency]
    ? formats[currency](priceNumber)
    : `${priceNumber} ${currency}`;
};

/**
 * Get image URL from Cloudinary or local path
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath.trim() === "") {
    console.warn("No image path provided, using placeholder");
    return "./public/img/placeholder.webp";
  }

  // console.log("Processing image path:", imagePath);

  // Cloudinary full URL
  if (imagePath.includes("res.cloudinary.com")) {
    console.log("Cloudinary full URL detected");
    return imagePath;
  }

  // External URLs
  if (imagePath.startsWith("http")) {
    console.log("External URL detected");
    return imagePath;
  }

  // Everything else is Cloudinary filename
  const fullUrl = `https://res.cloudinary.com/dxbelrmq1/image/upload/${imagePath}`;
  // console.log("Full URL:", fullUrl);
  return fullUrl;
};
/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  // At least 8 characters, contains letter and number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Get color code from color name
 */
export const getColorCode = (colorName) => {
  return COLOR_MAP[colorName] || "#cccccc";
};

/**
 * Show notification message
 */
export const showNotification = (message, isError = false, duration = 5000) => {
  // Remove existing messages
  const existingMessage = document.getElementById("global-message");
  if (existingMessage) existingMessage.remove();

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

  // Auto remove after duration
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.style.animation = "slideUp 0.3s ease-out forwards";
      setTimeout(() => messageDiv.remove(), 300);
    }
  }, duration);

  return messageDiv;
};

/**
 * Debounce function for performance
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

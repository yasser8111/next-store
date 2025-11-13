// Create toast container dynamically if not exists
let toastContainer = document.getElementById("toast-container");
if (!toastContainer) {
  toastContainer = document.createElement("div");
  toastContainer.id = "toast-container";
  document.body.appendChild(toastContainer);
}

/**
 * Show a toast message
 * @param {string} message
 * @param {string} type - "success", "error", "info", "warning"
 * @param {number} duration 
 * @param {string|null} link
 */
export function showToast(message, type = "success", duration = 3000, link = null) {
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  if (link) {
    toast.style.cursor = "pointer";
    toast.addEventListener("click", () => {
      window.location.href = link;
    });
  }

  toastContainer.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add("show"), 50);

  // Remove toast after duration
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, duration);
}
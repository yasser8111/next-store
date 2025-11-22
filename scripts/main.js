import * as utils from "./core/utils.js";
import { loadProducts } from "./modules/load-products.js";

async function initComponents() {
  await utils.loadHTML("header-placeholder", "./components/header.html");
  await utils.loadHTML("footer-placeholder", "./components/footer.html");

}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".comingSoon");
  if (!btn) return;

  e.preventDefault();
  showToast("غير متوفر حالياً", "info", 3000);
});

document.addEventListener("DOMContentLoaded", async () => {
  utils.loading(true);
  await initComponents();
  utils.loading(false);

  await loadProducts();
});

utils.backtotop(1000);

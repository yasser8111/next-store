import * as utils from "./core/utils.js";
import { loadProducts } from "./modules/load-products.js";
import { showToast } from "./modules/toast.js";

async function initComponents() {
  await utils.loadHTML("header-placeholder", "./components/header.html");
  await utils.loadHTML("footer-placeholder", "./components/footer.html");

}

document.addEventListener("click", (e) => {
  const el = e.target.closest(".comingSoon");
  if (!el) return;

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

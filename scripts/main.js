import * as Components from "./core/components.js";
import { loadProducts } from "./modules/load-products.js";

document.addEventListener("DOMContentLoaded", async () => {
  Components.loadHTML("header-placeholder", "./components/header.html");
  Components.loadHTML("footer-placeholder", "./components/footer.html");

  await loadProducts();
});

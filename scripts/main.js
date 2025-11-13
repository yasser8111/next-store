import * as utils from "./core/utils.js";
import { loadProducts } from "./modules/load-products.js";

document.addEventListener("DOMContentLoaded", async () => {
  utils.loadHTML("header-placeholder", "./components/header.html");
  utils.loadHTML("footer-placeholder", "./components/footer.html");

  await loadProducts();
});
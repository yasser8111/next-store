import { initHeader } from "./header.js";

// ===================== Setup Loader ==========================
export function loading(show = true, parent = null) {
  let loader = document.getElementById("page-loader");

  if (!loader) {
    loader = document.createElement("div");
    loader.id = "page-loader";
    loader.innerHTML = `
      <div class="spinner">
        <div class="dot1"></div>
        <div class="dot2"></div>
      </div>
    `;
    loader.classList.add("hidden");
  }

  if (parent) {
    loader.style.position = "absolute";
    parent.style.position = "relative";
    if (!parent.contains(loader)) parent.appendChild(loader);
  } else {
    loader.style.position = "fixed";
    if (!document.body.contains(loader)) document.body.appendChild(loader);
  }

  loader.classList.toggle("hidden", !show);
}

// ===================== Load HTML ============================
export function loadHTML(selectorId, filePath) {
  const placeholder = document.getElementById(selectorId);
  if (!placeholder) return;

  loading(true);

  fetch(filePath)
    .then((response) => response.text())
    .then((data) => {
      placeholder.innerHTML = data;
      if (selectorId === "header-placeholder") initHeader();
      loading(false);
    })
    .catch((err) => {
      console.error(`Failed to load ${filePath}:`, err);
      loading(false);
    });
}

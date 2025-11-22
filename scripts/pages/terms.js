import { backtotop } from "../core/utils.js";

const sections = document.querySelectorAll(".terms-article");
const navLinks = document.querySelectorAll(".terms-sidebar a");

/* =====================================
   DESKTOP SIDEBAR ACTIVE LINK
===================================== */

backtotop();

// ================= Scroll - update active link =================
window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// ================= Click - smooth scroll =================
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const targetId = link.getAttribute("href").replace("#", "");
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;

    const offset = 80;

    const topPos = targetSection.offsetTop - offset;

    window.scrollTo({
      top: topPos,
      behavior: "smooth",
    });
  });
});

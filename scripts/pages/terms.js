import { backtotop } from "../core/utils.js";

const sections = document.querySelectorAll(".terms-article");
const navLinks = document.querySelectorAll(".terms-sidebar a");

/* =====================================
   DESKTOP SIDEBAR ACTIVE LINK
===================================== */

backtotop();

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

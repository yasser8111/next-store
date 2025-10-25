class TermsPage {
  constructor() {
    this.init();
  }

  init() {
    this.setupTableOfContents();
    this.setupSmoothScrolling();
    this.setupActiveLinkTracking();
  }

  setupTableOfContents() {
    const tocLinks = document.querySelectorAll(".terms-toc a");

    tocLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const targetId = link.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          this.scrollToElement(targetElement);
          this.setActiveLink(link);
        }
      });
    });
  }

  setupSmoothScrolling() {
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  setupActiveLinkTracking() {
    const sections = document.querySelectorAll(".terms-article");
    const navLinks = document.querySelectorAll(".terms-toc a");

    // Intersection Observer to track active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            const activeLink = document.querySelector(
              `.terms-toc a[href="#${id}"]`
            );

            if (activeLink) {
              this.setActiveLink(activeLink);
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });
  }

  scrollToElement(element) {
    const offsetTop = element.offsetTop - 100; // Adjust for fixed header

    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }

  setActiveLink(activeLink) {
    // Remove active class from all links
    document.querySelectorAll(".terms-toc a").forEach((link) => {
      link.classList.remove("active");
    });

    // Add active class to clicked link
    activeLink.classList.add("active");
  }

  // Utility method to highlight text
  highlightText(text) {
    const elements = document.querySelectorAll(
      ".article-content p, .term-item span"
    );

    elements.forEach((element) => {
      const innerHTML = element.innerHTML;
      const regex = new RegExp(text, "gi");
      const highlighted = innerHTML.replace(
        regex,
        (match) => `<mark class="text-highlight">${match}</mark>`
      );

      if (highlighted !== innerHTML) {
        element.innerHTML = highlighted;
      }
    });
  }

  // Method to search terms
  searchTerms(query) {
    this.clearHighlights();

    if (query.trim()) {
      this.highlightText(query);
    }
  }

  clearHighlights() {
    const highlights = document.querySelectorAll(".text-highlight");

    highlights.forEach((highlight) => {
      const parent = highlight.parentNode;
      parent.replaceChild(
        document.createTextNode(highlight.textContent),
        highlight
      );
      parent.normalize();
    });
  }
}

// تهيئة صفحة الشروط عند التحميل
document.addEventListener("DOMContentLoaded", () => {
  window.termsPage = new TermsPage();

  // إضافة شريط البحث إذا كان مطلوباً
  // this.addSearchFunctionality();
});

// جعل الدوال متاحة عالمياً
window.TermsPage = TermsPage;

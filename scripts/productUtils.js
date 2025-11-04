export const ProductUtils = {
  getImageUrl(image) {
    if (!image) return "./imgs/placeholder.webp";
    if (image.startsWith("http")) return image;
    return `https://res.cloudinary.com/dxbelrmq1/image/upload/${image}`;
  },

  formatPrice(price) {
    if (price === undefined || price === null) return "0";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  escapeHtml(text = "") {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  },

  getProductStatus(status) {
    const statusMap = {
      available: { text: "متوفر", class: "available" },
      out_of_stock: { text: "غير متوفر", class: "out-of-stock" },
      pre_order: { text: "طلب مسبق", class: "pre-order" },
      coming_soon: { text: "قريباً", class: "coming-soon" },
      discontinued: { text: "متوقف", class: "discontinued" },
    };
    return statusMap[status] || { text: "غير معروف", class: "unknown" };
  },

  validateProductData(product) {
    const required = ["id", "name", "price", "status"];
    return required.every(
      (field) => product[field] !== undefined && product[field] !== null
    );
  },
};

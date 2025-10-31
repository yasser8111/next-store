// checkout.js
import { showNotification, updateCartIcon } from "./script.js";

class CheckoutManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem("cart")) || [];
        this.discountThreshold = 30000;
        this.discountRate = 0.1;
        this.orderNumber = this.generateOrderNumber();
        
        this.init();
    }

    init() {
        this.renderOrderSummary();
        this.setupEventListeners();
        this.updateWhatsAppLink();
    }

    generateOrderNumber() {
        return 'ORD-' + Date.now().toString().slice(-8);
    }

    renderOrderSummary() {
        const orderItemsContainer = document.getElementById("order-items");
        const subtotal = this.calculateSubtotal();
        const discount = this.calculateDiscount(subtotal);
        const total = subtotal - discount;

        if (this.cart.length === 0) {
            orderItemsContainer.innerHTML = '<p class="no-items">لا توجد عناصر في الطلب</p>';
            this.updateSummary(0, 0, 0);
            return;
        }

        orderItemsContainer.innerHTML = this.cart.map(item => `
            <div class="order-item">
                <div class="order-item-image">
                    <img src="${this.getImageUrl(item.image)}" alt="${this.escapeHtml(item.name)}" 
                         onerror="this.src='./imgs/placeholder.webp'">
                </div>
                <div class="order-item-details">
                    <div class="order-item-name">${this.escapeHtml(item.name)}</div>
                    <div class="order-item-meta">
                        ${item.size ? `<span>المقاس: ${this.escapeHtml(item.size)}</span>` : ''}
                        ${item.color ? `<span>اللون: ${this.escapeHtml(item.color)}</span>` : ''}
                    </div>
                    <div class="order-item-price">${this.formatPrice(item.price)} ر.ي</div>
                    <div class="order-item-quantity">الكمية: ${item.quantity}</div>
                </div>
            </div>
        `).join('');

        this.updateSummary(subtotal, discount, total);
    }

    calculateSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    calculateDiscount(subtotal) {
        return subtotal >= this.discountThreshold ? subtotal * this.discountRate : 0;
    }

    updateSummary(subtotal, discount, total) {
        document.getElementById("order-subtotal").textContent = `${this.formatPrice(subtotal)} ر.ي`;
        document.getElementById("order-discount").textContent = `-${this.formatPrice(discount)} ر.ي`;
        document.getElementById("order-total").textContent = `${this.formatPrice(total)} ر.ي`;
        document.getElementById("transfer-amount").textContent = `${this.formatPrice(total)} ر.ي`;
    }

    updateWhatsAppLink() {
        const total = this.calculateSubtotal() - this.calculateDiscount(this.calculateSubtotal());
        const message = `مرحباً، أود تأكيد طلبي رقم ${this.orderNumber}\nالمبلغ: ${this.formatPrice(total)} ر.ي\n\nتفاصيل الطلب:\n${this.getOrderDetails()}`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappBtn = document.getElementById("whatsapp-btn");
        whatsappBtn.href = `https://wa.me/966500000000?text=${encodedMessage}`;
    }

    getOrderDetails() {
        return this.cart.map(item => 
            `- ${item.name}${item.size ? ` (المقاس: ${item.size})` : ''}${item.color ? ` (اللون: ${item.color})` : ''} - ${item.quantity} × ${this.formatPrice(item.price)} ر.ي`
        ).join('\n');
    }

    getImageUrl(image) {
        if (!image) return "./imgs/placeholder.webp";
        if (image.startsWith("http")) return image;
        return `https://res.cloudinary.com/dxbelrmq1/image/upload/${image}`;
    }

    formatPrice(price) {
        if (price === undefined || price === null) return "0";
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    escapeHtml(text = "") {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupEventListeners() {
        // يمكن إضافة أي event listeners إضافية هنا
    }
}

// تهيئة صفحة checkout عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    new CheckoutManager();
});
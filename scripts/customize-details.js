import { CartManager } from './modules/cart.js';
import { showNotification } from './utils/helpers.js';

class CustomizeDetailsPage {
    constructor() {
        this.selectedColor = '#000000';
        this.selectedDesign = 'geometric';
        this.selectedDesignColor = '#e74c3c';
        this.selectedSize = 'M';
        this.previewRotation = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updatePreview();
        this.setupModals();
    }

    setupEventListeners() {
        // Color options
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectColor(option.dataset.color);
            });
        });

        // Design options
        document.querySelectorAll('.design-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectDesign(option.dataset.design);
            });
        });

        // Design color options
        document.querySelectorAll('.design-color-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectDesignColor(option.dataset.designColor);
            });
        });

        // Size options
        document.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectSize(option.dataset.size);
            });
        });

        // Preview controls
        document.getElementById('rotate-preview').addEventListener('click', () => {
            this.rotatePreview();
        });

        document.getElementById('reset-preview').addEventListener('click', () => {
            this.resetPreview();
        });

        // Action buttons
        document.getElementById('add-to-cart-custom').addEventListener('click', () => {
            this.addToCart();
        });

        document.getElementById('whatsapp-order-custom').addEventListener('click', (e) => {
            e.preventDefault();
            this.orderViaWhatsApp();
        });
    }

    setupModals() {
        const modal = document.getElementById('size-guide-modal');
        const openBtn = document.getElementById('size-guide-btn');
        const closeBtn = document.querySelector('.close-modal');

        if (openBtn && modal) {
            openBtn.addEventListener('click', () => {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        }

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    selectColor(color) {
        this.selectedColor = color;
        
        // Update active state
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('active');
        });
        
        event.target.closest('.color-option').classList.add('active');
        
        this.updatePreview();
    }

    selectDesign(design) {
        this.selectedDesign = design;
        
        // Update active state
        document.querySelectorAll('.design-option').forEach(option => {
            option.classList.remove('active');
        });
        
        event.target.closest('.design-option').classList.add('active');
        
        this.updatePreview();
    }

    selectDesignColor(color) {
        this.selectedDesignColor = color;
        
        // Update active state
        document.querySelectorAll('.design-color-option').forEach(option => {
            option.classList.remove('active');
        });
        
        event.target.classList.add('active');
        
        this.updatePreview();
    }

    selectSize(size) {
        this.selectedSize = size;
        
        // Update active state
        document.querySelectorAll('.size-option').forEach(option => {
            option.classList.remove('active');
        });
        
        event.target.classList.add('active');
    }

    rotatePreview() {
        this.previewRotation = (this.previewRotation + 90) % 360;
        this.updatePreview();
    }

    resetPreview() {
        this.previewRotation = 0;
        this.selectedColor = '#000000';
        this.selectedDesign = 'geometric';
        this.selectedDesignColor = '#e74c3c';
        
        // Reset active states
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector('.color-option[data-color="#000000"]').classList.add('active');
        
        document.querySelectorAll('.design-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector('.design-option[data-design="geometric"]').classList.add('active');
        
        document.querySelectorAll('.design-color-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector('.design-color-option[data-design-color="#e74c3c"]').classList.add('active');
        
        this.updatePreview();
        
        showNotification('تم إعادة تعيين التصميم', false);
    }

    updatePreview() {
        const tshirtBase = document.querySelector('.tshirt-base');
        const designOverlay = document.getElementById('design-overlay');
        
        if (tshirtBase) {
            // Apply color filter to t-shirt (in a real app, you'd have different images)
            tshirtBase.style.filter = `hue-rotate(${this.getHueRotation(this.selectedColor)}) brightness(0.9)`;
        }
        
        if (designOverlay) {
            // Update design overlay
            const designImage = this.getDesignImage(this.selectedDesign);
            designOverlay.style.backgroundImage = `url('${designImage}')`;
            designOverlay.style.filter = `hue-rotate(${this.getHueRotation(this.selectedDesignColor)})`;
            designOverlay.style.transform = `translate(-50%, -50%) rotate(${this.previewRotation}deg)`;
        }
    }

    getHueRotation(color) {
        const colorMap = {
            '#000000': '0deg',      // أسود
            '#ffffff': '0deg',      // أبيض
            '#2c3e50': '200deg',    // كحلي
            '#34495e': '200deg',    // رمادي غامق
            '#e74c3c': '0deg',      // أحمر
            '#3498db': '180deg',    // أزرق
            '#2ecc71': '120deg',    // أخضر
            '#f39c12': '40deg',     // برتقالي
            '#9b59b6': '270deg'     // بنفسجي
        };
        
        return colorMap[color] || '0deg';
    }

    getDesignImage(design) {
        const designMap = {
            'geometric': '../public/img/designs/geometric.webp',
            'typography': '../public/img/designs/typography.webp',
            'minimal': '../public/img/designs/minimal.webp',
            'artistic': '../public/img/designs/artistic.webp'
        };
        
        return designMap[design] || '../public/img/designs/geometric.webp';
    }

    addToCart() {
        const customizedProduct = {
            id: `custom-${Date.now()}`,
            name: 'تيشيرت مخصص',
            price: 15000,
            currency: 'YER',
            size: this.selectedSize,
            color: this.getColorName(this.selectedColor),
            design: this.getDesignName(this.selectedDesign),
            designColor: this.getColorName(this.selectedDesignColor),
            image: '../public/img/customize-placeholder.webp',
            quantity: 1,
            isCustom: true,
            customization: {
                baseColor: this.selectedColor,
                designType: this.selectedDesign,
                designColor: this.selectedDesignColor
            }
        };

        try {
            const success = CartManager.addItem(customizedProduct, this.selectedSize, this.getColorName(this.selectedColor));
            
            if (success) {
                this.showCustomizationSuccess();
            }
        } catch (error) {
            console.error('Error adding customized product to cart:', error);
            showNotification('حدث خطأ أثناء إضافة المنتج المخصص إلى السلة', true);
        }
    }

    orderViaWhatsApp() {
        const message = this.createWhatsAppMessage();
        const phoneNumber = '+966500000000';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
        showNotification('جاري تحويلك إلى واتساب لإتمام الطلب المخصص');
    }

    createWhatsAppMessage() {
        let message = `مرحباً، أريد طلب تيشيرت مخصص من متجر نكست:\n\n`;
        message += `🎨 المواصفات:\n`;
        message += `• لون التيشيرت: ${this.getColorName(this.selectedColor)}\n`;
        message += `• نوع التصميم: ${this.getDesignName(this.selectedDesign)}\n`;
        message += `• لون التصميم: ${this.getColorName(this.selectedDesignColor)}\n`;
        message += `• المقاس: ${this.selectedSize}\n\n`;
        message += `💰 السعر: 15,000 ر.ي\n\n`;
        message += `شكراً لخدمتكم! 🎉`;

        return message;
    }

    getColorName(colorCode) {
        const colorMap = {
            '#000000': 'أسود',
            '#ffffff': 'أبيض',
            '#2c3e50': 'كحلي',
            '#34495e': 'رمادي غامق',
            '#e74c3c': 'أحمر',
            '#3498db': 'أزرق',
            '#2ecc71': 'أخضر',
            '#f39c12': 'برتقالي',
            '#9b59b6': 'بنفسجي'
        };
        
        return colorMap[colorCode] || 'غير محدد';
    }

    getDesignName(designCode) {
        const designMap = {
            'geometric': 'هندسي',
            'typography': 'طباعي',
            'minimal': 'بسيط',
            'artistic': 'فني'
        };
        
        return designMap[designCode] || 'هندسي';
    }

    showCustomizationSuccess() {
        const addToCartBtn = document.getElementById('add-to-cart-custom');
        const originalHTML = addToCartBtn.innerHTML;
        
        addToCartBtn.innerHTML = '<i class="fa-solid fa-check"></i> تمت الإضافة بنجاح!';
        addToCartBtn.disabled = true;
        
        // Create celebration effect
        this.createCelebrationEffect();
        
        setTimeout(() => {
            addToCartBtn.innerHTML = originalHTML;
            addToCartBtn.disabled = false;
        }, 3000);
    }

    createCelebrationEffect() {
        const previewSection = document.querySelector('.design-preview-section');
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.animationDelay = Math.random() * 1 + 's';
                confetti.style.background = this.getRandomColor();
                
                previewSection.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 2000);
            }, i * 100);
        }
    }

    getRandomColor() {
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Add confetti styles
const confettiStyles = document.createElement('style');
confettiStyles.textContent = `
    .confetti {
        position: absolute;
        width: 10px;
        height: 10px;
        background: #e74c3c;
        border-radius: 50%;
        animation: confettiFall 2s ease-out forwards;
        z-index: 1000;
    }
    
    @keyframes confettiFall {
        0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(500px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyles);

// Initialize the customization page
document.addEventListener('DOMContentLoaded', () => {
    new CustomizeDetailsPage();
});
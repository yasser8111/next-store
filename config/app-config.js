// Application Configuration
export const APP_CONFIG = {
    // App Information
    APP_NAME: 'Next Store',
    APP_VERSION: '2.0.0',
    
    // Business Information
    BUSINESS: {
        name: 'Next Store',
        email: 'hello@nextstore.com',
        phone: '+966500000000',
        whatsapp: '+966500000000',
        address: 'المملكة العربية السعودية'
    },
    
    // Currency Configuration
    CURRENCY: {
        primary: 'YER',
        secondary: 'SAR',
        symbol: 'ر.ي',
        exchangeRate: 1 // YER to SAR
    },
    
    // Shipping Configuration
    SHIPPING: {
        enabled: true,
        freeShippingThreshold: 30000,
        defaultCost: 2000,
        estimatedDays: {
            min: 3,
            max: 7
        }
    },
    
    // Features Configuration
    FEATURES: {
        auth: true,
        cart: true,
        customization: true,
        whatsappOrders: true,
        productStatus: true
    },
    
    // Social Media Links
    SOCIAL_MEDIA: {
        facebook: '#',
        instagram: '#',
        twitter: '#',
        tiktok: '#'
    },
    
    // API Configuration
    API: {
        timeout: 10000,
        retryAttempts: 3
    },
    
    // Local Storage Keys
    STORAGE_KEYS: {
        cart: 'nextstore_cart_cart',
        user: 'nextstore_user',
        theme: 'nextstore_theme',
        settings: 'nextstore_settings'
    }
};

// Product Configuration
export const PRODUCT_CONFIG = {
    STATUS: {
        AVAILABLE: 'available',
        OUT_OF_STOCK: 'out-of-stock',
        COMING_SOON: 'coming-soon'
    },
    
    SIZES: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    
    COLORS: {
        'أسود': '#000000',
        'أبيض': '#ffffff',
        'أزرق': '#3498db',
        'أحمر': '#e74c3c',
        'أخضر': '#2ecc71',
        'رمادي': '#95a5a6',
        'كحلي': '#2c3e50'
    },
    
    DEFAULT_IMAGE: '../public/img/placeholder.webp'
};

// Theme Configuration
export const THEME_CONFIG = {
    COLORS: {
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#007bff',
        success: '#4CAF50',
        error: '#ff4d4d',
        warning: '#ff9800',
        info: '#2196F3'
    },
    
    BREAKPOINTS: {
        mobile: '480px',
        tablet: '768px',
        desktop: '1024px',
        large: '1200px'
    },
    
    ANIMATION: {
        duration: '0.3s',
        timing: 'ease-in-out'
    }
};

// Export configuration object
export default {
    APP_CONFIG,
    PRODUCT_CONFIG,
    THEME_CONFIG
};

export const GOOGLE_CONFIG = {
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // استبدل بـ client ID الفعلي
    scope: 'profile email',
    redirectUri: window.location.origin + '/auth.html'
};
next-store/
│
├── index.html
│
├── pages/                                  ← جميع الصفحات الفرعية
│   ├── products.html
│   ├── product-details.html
│   ├── about.html
│   ├── contact.html
│   └── cart.html
│
├── assets/                                ← كل الموارد (صور، خطوط، أيقونات...)
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── styles/
│   ├── main.css                           ← الملف الرئيسي الذي يستورد باقي الملفات
│   │
│   ├── base/                              ← الأساسيات
│   │   ├── reset.css                      ← إعادة تهيئة تنسيقات المتصفح الافتراضية
│   │   ├── variables.css                  ← الألوان، الخطوط، المسافات...
│   │   ├── typography.css                 ← أنماط النصوص (h1, h2, p...)
│   │   └── utilities.css                  ← كلاسات مساعدة عامة (مثل .hidden, .flex-center)
│   │
│   ├── components/                        ← مكونات الموقع
│   │   ├── header.css
│   │   ├── footer.css
│   │   ├── navbar.css
│   │   ├── card.css                       ← كروت المنتجات
│   │   ├── button.css
│   │   └── modal.css                      ← النوافذ المنبثقة (إن وجدت)
│   │
│   ├── pages/                             ← تنسيقات خاصة بكل صفحة
│   │   ├── home.css
│   │   ├── products.css
│   │   ├── product-details.css
│   │   ├── cart.css
│   │   └── about.css
│
├── scripts/
│   ├── main.js                            ← الملف الرئيسي الذي يستورد كل الملفات الأخرى
│   │
│   ├── core/                              ← الأكواد الأساسية
│   │   ├── config.js                      ← إعدادات عامة (روابط API، ثوابت)
│   │   ├── helpers.js                     ← دوال عامة (مثل formatPrice، scrollToTop)
│   │   └── storage.js                     ← التعامل مع localStorage أو sessionStorage
│   │
│   ├── components/                        ← مكونات JavaScript
│   │   ├── navbar.js
│   │   ├── cart.js
│   │   ├── product-card.js
│   │   └── modal.js
│   │
│   ├── pages/                             ← أكواد خاصة بكل صفحة
│   │   ├── home.js
│   │   ├── products.js
│   │   ├── product-details.js
│   │   └── about.js
│
├── favicon.ico
└── manifest.json                          ← ملف معلومات المشروع (للمتصفحات والـPWA)


scripts/
│
├── main.js                     ← الملف الرئيسي (نقطة البداية)
│
├── core/                       ← الأكواد الأساسية للموقع
│   ├── components.js           ← تحميل الهيدر والفوتر أو الأجزاء المشتركة
│   ├── utils.js                ← دوال عامة قابلة لإعادة الاستخدام
│   ├── events.js               ← إدارة الأحداث العامة (السكروول، النقر...)
│   └── router.js               ← مستقبلاً لتنقل الصفحات (اختياري)
│
├── firebase/                   ← ملفات الربط مع Firebase
│   ├── firebase-config.js      ← إعداد الاتصال بقاعدة البيانات
│   ├── firestore.js            ← التعامل مع Firestore (إضافة / جلب / حذف)
│   └── storage.js              ← رفع الصور أو الملفات إلى التخزين (اختياري)
│
├── modules/                    ← الأكواد الخاصة بكل صفحة أو قسم
│   ├── fetch-products.js       ← جلب المنتجات وعرضها
│   ├── cart.js                 ← إدارة السلة
│   ├── product-details.js      ← صفحة تفاصيل المنتج
│   ├── filters.js              ← الفلاتر / الفرز
│   └── banner.js               ← قسم البانر (تحكم بالحركة أو التبديل)
│
└── ui/                         ← واجهة المستخدم (أنيميشن + إشعارات)
    ├── toast.js                ← إشعارات نجاح / خطأ
    ├── loading.js              ← شاشة التحميل أو الـ Spinner
    └── animations.js           ← الحركات العامة (fade, slide, zoom...)

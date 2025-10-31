// about.js - للرسوم المتحركة والإحصاءات
class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupAnimations();
        this.setupCounters();
    }

    setupAnimations() {
        // إضافة تأثيرات ظهور عند التمرير
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // مراقبة العناصر لإضافة تأثيرات الظهور
        const animatedElements = document.querySelectorAll('.mission-card, .feature, .team-member');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200; // كلما قل الرقم كلما كان العد أسرع

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-count');
                const count = +counter.innerText;
                const increment = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };

            // بدء العد عند ظهور العنصر
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCount();
                        observer.unobserve(entry.target);
                    }
                });
            });

            observer.observe(counter);
        });
    }
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    new AboutPage();
});
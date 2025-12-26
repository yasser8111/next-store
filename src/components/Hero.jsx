import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative flex items-center overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-20 relative z-10 max-w-screen-xl">
        <div className="flex flex-col items-center md:items-end justify-between gap-8 md:gap-12">
          
          <div className="w-full text-center md:text-right">
            {/* العنوان: تصغير الحجم قليلاً في الجوال ليتناسب مع الشاشة */}
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-gray-900 dark:text-white leading-[1.1] mb-6">
              تيشيرت يعبّر عنك
              <br />
              قبل ما تتكلم
            </h1>

            {/* النص الوصفي: تحسين التوزيع في الشاشات الصغيرة */}
            <div className="my-6 inline-flex items-center justify-center md:justify-start gap-2 py-2 rounded-xl flex-wrap">
              <p className="text-sm sm:text-lg md:text-xl font-bold text-gray-500 dark:text-gray-400 leading-relaxed">
                عرض خاص! اشتري بأكثر من
                <span className="text-black dark:text-white mx-1 text-xl sm:text-2xl font-black">
                  35,000
                </span>
                ريال واحصل على خصم
                <span className="dark:text-black dark:bg-white bg-black text-white px-2 py-0.5 rounded-lg mx-2 transform rotate-3 inline-block shadow-lg">
                  10%
                </span>
                فوري على مشترياتك!
              </p>
            </div>

            {/* الأزرار: منع w-full واستخدام w-fit للتوسط في الجوال */}
            <div className="flex flex-row justify-center md:justify-end">
              <Link
                to="/products"
                className="w-fit px-10 py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold rounded-2xl transition-all active:scale-95 cursor-pointer shadow-xl"
              >
                ابدأ التسوق
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
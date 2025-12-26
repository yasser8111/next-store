import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative flex items-center overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-6 py-12 relative z-10 max-w-screen-xl">
        <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12">
          <div className="w-full text-right">
            <h1 className="text-3xl sm:text-6xl md:text-8xl font-black text-gray-900 dark:text-white leading-tight mb-6">
              .تيشيرت يعبّر عنك
              <br/>
               .قبل ما تتكلم
            </h1>
            <div className="my-4 inline-flex flex-wrap items-center gap-2  pr-4 py-2 rounded-l-xl">
              <p className="text-xs sm:text-lg md:text-xl font-bold text-gray-500 dark:text-gray-400">
                عرض خاص! اشتري بأكثر من
                <span className="text-black dark:text-white mx-1 text-2xl">
                  35,000
                </span>
                ريال واحصل على خصم
                <span className="dark:text-black dark:bg-white bg-black text-white px-2 py-0.5 rounded-lg mx-2 transform rotate-3 inline-block shadow-lg">
                  10%
                </span>
                فوري على مشترياتك!
              </p>
            </div>

            <div className="flex gap-4 justify-end">
              <Link
              to="/products"
                href="#products"
                className="px-8 py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold rounded-2xl transition-all cursor-pointer"
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

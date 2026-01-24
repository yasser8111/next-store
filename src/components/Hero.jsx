import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="py-8 md:py-12 px-4 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 md:gap-6 min-h-[500px]">
          {/* Main Hero Block (Top on mobile, Left/Main on desktop) */}
          <div className="lg:col-span-8 bg-black dark:bg-white rounded-[2rem] p-4 sm:p-8 md:p-12 flex flex-col justify-center items-start text-right relative overflow-hidden group animate-fade-in-up">
            {/* Abstract Decorative Circle */}
            <div className="absolute -left-20 -bottom-40 w-80 h-80 bg-blue-600/20 dark:bg-blue-400/20 rounded-full blur-3xl group-hover:bg-blue-500/40 transition-colors duration-500"></div>

            <div className="relative z-20 w-full flex flex-col items-end">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight text-right mb-6 tracking-tighter bg-gradient-to-r from-gray-500 via-white to-gray-500 dark:from-gray-600 dark:via-gray-900 dark:to-gray-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(37,99,235,0.3)] dark:drop-shadow-none py-2">
                تيشيرت <br />
                يعبّر عنك.
              </h1>

              <p
                className="text-gray-400 dark:text-gray-500 text-lg md:text-xl font-medium max-w-md leading-relaxed"
                dir="rtl"
              >
                خليك مميز بتصاميم عصرية وخامات مريحة تناسب كل أوقاتك.
              </p>
            </div>
          </div>

          {/* Sidebar (Bottom on mobile, Right on desktop) */}
          <div
            className="lg:col-span-4 grid grid-cols-2 lg:flex lg:flex-col gap-2 md:gap-6 animate-fade-in-up opacity-0"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            {/* Offer Block */}
            <div className="bg-black dark:bg-white rounded-[2rem] p-4 sm:p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group min-h-[200px] lg:flex-1">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#000_1px,transparent_1px)]"></div>

              <div className="relative z-10">
                <p className="text-gray-400 dark:text-gray-500 font-bold mb-1 text-sm">
                  عرض خاص لفترة محدودة
                </p>
                <h3
                  className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-right mb-2 tracking-tighter bg-gradient-to-r from-gray-500 via-white to-gray-500 dark:from-gray-600 dark:via-gray-900 dark:to-gray-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(37,99,235,0.3)] dark:drop-shadow-none py-1"
                  dir="rtl"
                >
                  خصم 10%
                </h3>
                <p className="text-white/80 dark:text-black/80 text-sm font-medium">
                  عند الشراء بأكثر من 35,000 ريال
                </p>
              </div>
            </div>

            {/* CTA Block */}
            <Link
              to="/products"
              className="bg-blue-600 dark:bg-blue-600 rounded-[2rem] p-4 sm:p-8 flex flex-row-reverse items-center justify-between group cursor-pointer hover:bg-blue-700 transition-colors min-h-[200px] lg:flex-1"
            >
              <div className="text-right">
                <h3 className="text-white text-2xl font-bold mb-1">
                  تسوق الآن
                </h3>
                <p className="text-blue-200 text-sm">تصفح المنتجات &larr;</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white rotate-180"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

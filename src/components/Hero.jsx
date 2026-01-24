import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const HeroSection = () => {
  const MainBlock = () => (
    <div className="bg-black rounded-[2rem] p-8 md:p-12 flex flex-col justify-center items-end text-right relative overflow-hidden h-full w-full">
      <div className="absolute -left-20 -bottom-40 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl"></div>
      <div className="relative z-20 w-full flex flex-col items-end">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-4 tracking-tighter bg-gradient-to-r from-gray-500 via-white to-gray-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]">
          تيشيرت <br />
          يعبّر عنك.
        </h1>
        <p
          className="text-gray-400 text-lg md:text-xl font-medium max-w-md leading-relaxed"
          dir="rtl"
        >
          خليك مميز بتصاميم عصرية وخامات مريحة تناسب كل أوقاتك.
        </p>
      </div>
    </div>
  );

  const OfferBlock = () => (
    <div className="bg-black rounded-[2rem] p-8 flex flex-col justify-center items-center text-center relative overflow-hidden h-full w-full border border-white/5">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="relative z-10 flex flex-col items-center">
        <p className="text-gray-400 font-bold mb-2 text-lg">
          عرض خاص لفترة محدودة
        </p>
        <h3
          className="text-6xl md:text-5xl font-black leading-tight mb-4 tracking-tighter bg-gradient-to-r from-gray-500 via-white to-gray-500 bg-clip-text text-transparent py-1"
          dir="rtl"
        >
          خصم 10%
        </h3>
        <p className="text-white/80 text-lg font-medium">
          عند الشراء بأكثر من 35,000 ريال
        </p>
      </div>
    </div>
  );

  const CTABlock = () => (
    <Link
      to="/products"
      className="bg-blue-600 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-blue-700 transition-colors h-full w-full relative overflow-hidden"
    >
      <div className="relative z-10 flex flex-col items-center">
        <h3 className="text-white text-4xl md:text-2xl font-bold mb-4">
          تسوق الآن
        </h3>
        <div className="w-16 h-16 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
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
        <p className="text-blue-100 text-lg">تصفح المنتجات &larr;</p>
      </div>
    </Link>
  );

  return (
    <section className="py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-12 gap-6 min-h-[550px]">
          <div className="col-span-8">
            <MainBlock />
          </div>
          <div className="col-span-4 flex flex-col gap-6">
            <div className="flex-1">
              <OfferBlock />
            </div>
            <div className="flex-1">
              <CTABlock />
            </div>
          </div>
        </div>

        {/* Mobile Swiper Layout (Uniform Banners) */}
        <div className="lg:hidden">
          <Swiper
            style={{
              "--swiper-pagination-color": "#ffffff",
              "--swiper-pagination-bullet-inactive-color": "#ffffff",
            }}
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            spaceBetween={16}
            slidesPerView={1}
            className="pb-12 h-[350px]"
          >
            <SwiperSlide>
              <MainBlock />
            </SwiperSlide>
            <SwiperSlide>
              <OfferBlock />
            </SwiperSlide>
            <SwiperSlide>
              <CTABlock />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

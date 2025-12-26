import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../firebase/GetProducts";
import { fixImageUrl } from "../utils/fixImg";
import { handleWhatsApp } from "../utils/goToWhatsApp";
import BackButton from "../components/common/BackButton";

const DetailsSkeleton = () => (
  <div
    className="container mx-auto max-w-screen-lg lg:py-12 px-4 sm:px-8 animate-pulse"
    dir="rtl"
  >
    <div className="w-22 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl mb-5"></div>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-5 items-start">
      <div className="md:col-span-6">
        <div className="aspect-square w-full bg-gray-200 dark:bg-gray-800 rounded-[1em] md:rounded-[2rem]"></div>
      </div>
      <div className="md:col-span-6 flex flex-col py-2 space-y-6">
        <div className="w-24 h-6 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        <div className="space-y-3">
          <div className="w-full h-10 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="w-2/3 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
        <div className="w-40 h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        <div className="space-y-5 pt-2">
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
        <div className="mt-auto pt-4">
          <div className="w-full md:w-[250px] h-17 bg-gray-200 dark:bg-gray-800 rounded-2xl md:rounded-[1.5rem]"></div>
        </div>
      </div>
    </div>
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        if (data) setProduct(data);
        else navigate("/");
      } catch (error) {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) return <DetailsSkeleton />;
  if (!product) return null;

  return (
    <div
      className="container mx-auto max-w-screen-lg lg:py-12 px-4 sm:px-8 text-right"
      dir="rtl"
    >
      <BackButton />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-5 items-start">
        {/* Left Side: Product Image */}
        <div className="md:col-span-6 md:sticky lg:top-20">
          <div className="relative aspect-square rounded-[1em] md:rounded-[2rem] overflow-hidden bg-gray-50 dark:bg-gray-800/50 shadow-xl">
            <img
              src={fixImageUrl(product.mainImage)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10 rounded-[2rem] md:rounded-[3rem]"></div>
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="md:col-span-6 flex flex-col py-2">
          <div className="mb-6">
            <span
              className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                product.isAvailable
                  ? "text-emerald-700 bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "text-rose-700 bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ml-2 ${
                  product.isAvailable ? "bg-emerald-500" : "bg-rose-500"
                }`}
              ></span>
              {product.isAvailable ? "متوفر" : "نفدت الكمية"}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 dark:text-white mb-3 md:mb-5 leading-[1.2]">
            {product.name}
          </h1>

          <div className="inline-flex items-baseline gap-2 mb-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl w-fit">
            <span className="text-2xl md:text-3xl lg:text-4xl font-black text-black dark:text-white">
              {product.price}
            </span>
            <span className="text-sm md:text-base lg:text-lg font-bold text-gray-500 dark:text-gray-400">
              {product.currency}
            </span>
          </div>

          {/* Description Section with Show More */}
          <div className="pt-2 md:pt-4 mb-6 md:mb-8">
            <p
              className={`text-base md:text-lg lg:text-xl break-words text-gray-600 dark:text-gray-300 leading-relaxed font-medium transition-all duration-300 ${
                !isExpanded ? "line-clamp-3" : ""
              }`}
            >
              {product.description}
            </p>
            {product.description?.length > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-sm font-bold text-gray-600 dark:text-gray-100 underline underline-offset-4 hover:opacity-70 transition-opacity cursor-pointer"
              >
                {isExpanded ? "إخفاء التفاصيل" : "عرض المزيد..."}
              </button>
            )}
          </div>

          <div className="mt-auto">
            <button
              onClick={handleWhatsApp}
              className="w-full md:w-auto md:min-w-[250px] px-6 md:px-10 py-4 md:py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl md:rounded-[1.5rem] font-black text-lg md:text-xl hover:opacity-90 transition-all active:scale-[0.98] shadow-xl shadow-black/10 dark:shadow-white/5 cursor-pointer"
            >
              طلب عبر الواتساب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

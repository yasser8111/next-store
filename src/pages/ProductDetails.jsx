import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../firebase/GetProducts";
import { fixImageUrl } from "../utils/fixImg";
import { handleWhatsApp } from "../utils/goToWhatsApp";
import BackButton from "../components/common/BackButton";

const DetailsSkeleton = () => (
  <div
    className="container mx-auto max-w-screen-lg lg:py-12 px-4 sm:px-8 animate-pulse text-right"
    dir="rtl"
  >
    <div className="w-24 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl mb-5"></div>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6 items-start">
      <div className="md:col-span-6">
        <div className="aspect-square w-full bg-gray-200 dark:bg-gray-800 rounded-[2rem]"></div>
      </div>
      <div className="md:col-span-6 flex flex-col py-2 space-y-6">
        <div className="w-28 h-7 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        <div className="space-y-3">
          <div className="w-full h-10 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
        <div className="w-32 h-16 bg-gray-200 dark:bg-gray-800 rounded-4xl"></div>
        <div className="space-y-4">
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="w-48 h-12 bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
        </div>
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
        <div className="mt-auto">
          <div className="w-full md:w-[280px] h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
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

  const availableSizes = product.sizes
    ? Object.keys(product.sizes).filter((size) => product.sizes[size] > 0)
    : [];

  return (
    <div
      className="container mx-auto max-w-screen-lg lg:py-12 px-4 sm:px-8 text-right mb-10"
      dir="rtl"
    >
      <BackButton />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6 items-start">
        {/* قسم الصورة */}
        <div className="md:col-span-6 md:sticky lg:top-24">
          <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-50 dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700">
            <img
              src={fixImageUrl(product.mainImage)}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-6 flex flex-col py-2">
          <div className="mb-4">
            <span
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${
                product.isAvailable
                  ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10"
                  : "text-rose-600 bg-rose-50 dark:bg-rose-500/10"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  product.isAvailable ? "bg-emerald-500" : "bg-rose-500"
                }`}
              ></span>
              {product.isAvailable ? "متوفر الآن" : "نفدت الكمية"}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="inline-flex items-baseline gap-2 mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-4xl w-fit">
            <span className="text-3xl md:text-4xl font-black text-black dark:text-white">
              {product.price}
            </span>
            <span className="text-sm font-bold text-gray-500">
              {product.currency}
            </span>
          </div>

          <div className="mb-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
              المقاسات المتوفرة:
            </h3>

            <div className="flex flex-wrap gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-3xl w-fit">
              {availableSizes.length > 0 ? (
                availableSizes.map((size) => (
                  <span
                    key={size}
                    className="flex items-center justify-center min-w-[3rem] h-9 px-3 text-gray-800 dark:text-gray-100 font-bold text-sm rounded-xl"
                  >
                    {size}
                  </span>
                ))
              ) : (
                <div className="flex items-center gap-2 px-4 py-1 text-rose-500 font-bold text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  لا توجد مقاسات متوفرة
                </div>
              )}
            </div>
          </div>

          <div className="mb-8 border-t border-gray-100 dark:border-gray-800 pt-6">
            <p
              className={`text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed ${
                !isExpanded ? "line-clamp-2" : ""
              }`}
            >
              {product.description}
            </p>
            {product.description?.length > 150 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-sm font-bold text-black dark:text-white underline cursor-pointer"
              >
                {isExpanded ? "إخفاء" : "عرض الوصف الكامل"}
              </button>
            )}
          </div>

          <div className="mt-auto">
            <button
              disabled={!product.isAvailable || availableSizes.length === 0}
              onClick={() => handleWhatsApp(product)}
              className="w-full md:w-auto md:min-w-[280px] px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-xl hover:opacity-90 transition-all cursor-pointer"
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

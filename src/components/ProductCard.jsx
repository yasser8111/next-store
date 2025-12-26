import React from "react";
import { Link } from "react-router-dom";
import { fixImageUrl } from "../utils/fixImg";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="block bg-gray-100 dark:bg-gray-800 rounded-2xl p-2 active:scale-99 transition-all md:hover:-translate-y-1 cursor-pointer sm:p-4 group relative"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl">
        <img
          src={fixImageUrl(product.mainImage)}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            product.hoverImage ? "group-hover:opacity-0" : ""
          }`}
        />

        {product.hoverImage && (
          <img
            src={fixImageUrl(product.hoverImage)}
            alt={`${product.name} hover`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}
      </div>

      <div className="text-right mt-3 lg:mt-5" dir="rtl">
        <h3 className="font-bold text-gray-800 dark:text-white text-md sm:text-lg mb-1 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        <div className="flex  items-center  justify-between mt-auto gap-2">
          {!product.isAvailable ? (
            <span
              className="flex items-center justify-center gap-1.5 
                w-6 h-6 p-0 sm:w-auto sm:h-auto sm:px-3 sm:py-1 
                rounded-full sm:rounded-xl 
                text-[10px] font-bold bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>

              <span className="hidden sm:inline">نفدت الكمية</span>
            </span>
          ) : (
            <div />
          )}

          <div className="flex flex-col items-end">
            <span className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
              {product.price}
              <span className="text-xs font-bold mr-1 text-gray-500 dark:text-gray-400">
                {product.currency}
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

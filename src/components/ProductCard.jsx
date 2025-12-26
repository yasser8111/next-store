import React from "react";
import { Link } from "react-router-dom";
import { fixImageUrl } from "../utils/fixImg";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="block bg-gray-100 dark:bg-gray-800 rounded-2xl p-2 active:scale-99 transition-all md:hover:-translate-y-1 cursor-pointer sm:p-4 group"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={fixImageUrl(product.mainImage)}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            product.hoverImg ? "group-hover:opacity-0" : ""
          }`}
        />
        {product.hoverImage && (
          <img
            src={fixImageUrl(product.hoverImage)}
            alt={`${product.name} hover`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-100"
          />
        )}
      </div>

      <div className="text-right mt-3 lg:mt-5" dir="rtl">
        <h3 className="font-bold text-gray-800 dark:text-white text-md sm:text-lg mb-1 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center justify-end">
          <span className="text-md sm:text-xl font-black text-black dark:text-white mb-1">
            {product.price} {product.currency}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

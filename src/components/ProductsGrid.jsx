import { useState, useEffect } from "react";
import { getAllProducts } from "../firebase/GetProducts";
import ProductCard from "../components/ProductCard";

const ProductSkeleton = () => (
  <div className="w-full max-w-[350px] sm:max-w-none bg-gray-100 dark:bg-gray-800 rounded-2xl p-2 sm:p-4 animate-pulse">
    <div className="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
    <div className="flex flex-col items-end gap-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3"></div>
      <div className="mt-4 h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3"></div>
    </div>
  </div>
);

function ProductsGrid({ initialLimit, searchTerm = "" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const DEFAULT_LIMIT = initialLimit || 4;
  const [visibleCount, setVisibleCount] = useState(DEFAULT_LIMIT);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const handleShowMore = () => setVisibleCount((prev) => prev + DEFAULT_LIMIT);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8 justify-items-center">
        {loading
          ? [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
          : visibleProducts.map((product) => (
              <div key={product.id} className="w-full max-w-[350px] sm:max-w-none">
                <ProductCard product={product} />
              </div>
            ))}
      </div>

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center min-h-[300px] py-10 text-gray-500 w-full col-span-full">
          لا توجد نتائج تطابق بحثك
        </div>
      )}

      {!loading && visibleCount < filteredProducts.length && (
        <div className="flex justify-start mt-10">
          <button
            onClick={handleShowMore}
            className="px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold transition cursor-pointer"
          >
            عرض المزيد
          </button>
        </div>
      )}
    </>
  );
}

export default ProductsGrid;
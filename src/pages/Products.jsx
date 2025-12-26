import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductsGrid from "../components/ProductsGrid";
import BackButton from "../components/common/BackButton";

function Products() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <section
        className="container mx-auto max-w-screen-xl lg:py-10 px-4 sm:px-6 text-right transition-colors duration-300 "
        dir="rtl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <BackButton />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            className="w-full max-w-md px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none outline-none text-right transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ProductsGrid initialLimit={8} searchTerm={searchTerm} />
      </section>
    </>
  );
}

export default Products;

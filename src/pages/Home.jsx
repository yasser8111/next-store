import Hero from "../components/Hero";
import ProductsGrid from "../components/ProductsGrid";

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full">
        <Hero />
      </section>

      {/* Products Section */}
      <section
        className="container mx-auto max-w-screen-xl lg:py-10 px-4 sm:px-6 text-right transition-colors duration-300 "
        dir="rtl"
      >
        <ProductsGrid />
      </section>
    </>
  );
}

export default Home;

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import Footer from "../components/Footer";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://biller-backend-xdxp.onrender.com/api/products"
        ); // Adjust if your backend is hosted elsewhere
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  console.log(products);
  return (
    <div className="w-full relative bg-white min-h-screen flex flex-col">
      <Navbar />
      {/* Banner */}
      <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://demo.htmlcodex.com/3402/drinking-water-website-template/img/breadcrumb.jpg"
          alt="Drinking Water"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1d2b4a4f]" />
        <h1 className="relative text-[#fff] text-4xl md:text-5xl font-bold text-center z-10">
          Our Product
        </h1>
      </div>

      {/* Products Section */}
      <div className="flex-1 flex justify-center items-start bg-[#f7fdff] py-12">
        {loading ? (
          <div className="text-xl text-[#1d8599]">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-xl text-gray-500">No products found.</div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Shop;

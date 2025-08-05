import ProductCard from "../../components/ProductCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
const HomeProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://biller-backend-xdxp.onrender.com/api/products"
        );
        setProducts(res.data.slice(0, 4));
      } catch (error) {
        console.log("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  console.log(products);

  return (
    <div className="w-full min-h-screen relative  ">
      <div className="top w-full overflow-hidden">
        <h5 className="my-4 uppercase font-semibold text-center text-xl text-[#1D8599]">
          Our Products
        </h5>
        <h1 className="text-6xl font-bold w-1/2 mx-auto my-6 text-center text-[#001442]">
          We Deliver Best Quality Bottle Packs.
        </h1>
      </div>

      <div className="bottom product-cards flex justify-center  gap-10 my-10 flex-wrap">
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
      <div className="w-full flex justify-center items-center">
        <Link
          to={"/shop"}
          className="my-3 text-[#1d8599] border  hover:border-[#1d8599] w-34 text-center rounded-3xl py-2 hover:w-40 duration-500 transition-all"
        >
          Shop More
        </Link>
      </div>
    </div>
  );
};

export default HomeProducts;

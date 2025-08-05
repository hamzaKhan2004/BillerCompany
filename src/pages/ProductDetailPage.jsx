/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const BASE_URL = "https://biller-backend-xdxp.onrender.com";

const ProductDetailPage = () => {
  // Accept both slug and id in the URL param (could be either)
  const { slug, id } = useParams();
  const { user } = useContext(AuthContext);

  // Get the passed "slugOrId" name (support both /product/:slug and /product/:id routes)
  const param = slug || id;

  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(2);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      toast.info("Please login to add items to your cart.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/api/cart/add`,
        { productId: product._id, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Added 1 "${product.title}" to cart.`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to add product to cart."
      );
    }
  };

  useEffect(() => {
    setLoading(true);

    const fetchProduct = async () => {
      try {
        // 1. Try by slug
        let prodRes;
        try {
          prodRes = await axios.get(`${BASE_URL}/api/products/slug/${param}`);
        } catch (e) {
          // 2. If 404 or any error, try by _id
          if (e.response && e.response.status === 404) {
            prodRes = await axios.get(`${BASE_URL}/api/products/${param}`);
          } else {
            throw e;
          }
        }
        setProduct(prodRes.data);

        // Similar products logic
        const simRes = await axios.get(`${BASE_URL}/api/products`);
        const all = simRes.data.filter(
          (p) =>
            p.slug !== prodRes.data.slug &&
            p._id !== prodRes.data._id &&
            (p.type === prodRes.data.type || p.brand === prodRes.data.brand)
        );
        setSimilar(all.slice(0, 4));
      } catch (err) {
        setProduct(null);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [param]);

  if (loading) return <Spinner />;
  if (!product)
    return (
      <div className="text-center p-20 text-2xl text-[#1d8599]">
        Product not found.
      </div>
    );

  // Image helper
  const getImageSrc = (img) =>
    img?.startsWith("/uploads") ? BASE_URL + img : img;

  const handleQty = (delta) => setQty((q) => Math.max(2, q + delta));
  const handleOrderNow = () => {
    if (!user) {
      toast.info("Please login to buy this product.");
      return;
    }
    // Build a single-product checkout payload compatible with your checkout page
    const orderProduct = {
      product,
      quantity: qty,
    };
    // Navigate to checkout page with router state
    navigate("/checkout", { state: { products: [orderProduct] } });
  };

  return (
    <div className="w-full min-h-screen relative bg-[#f7fdff] flex flex-col">
      <Navbar />
      {/* Banner image & title */}
      <div className="relative w-full h-[40vh] flex items-center justify-center overflow-hidden">
        <img
          src={getImageSrc(product.image)}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          alt={product.title}
        />
        <div className="absolute inset-0 bg-[#16264b3e]" />
        <h1 className="relative text-white text-4xl md:text-5xl font-bold z-10">
          {product.title}
        </h1>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto bg-white rounded-xl shadow-lg mt-[-50px] p-8 gap-10 z-10 relative">
        {/* Product image */}
        <div className="flex flex-1 justify-center items-start">
          <img
            src={getImageSrc(product.image)}
            alt={product.title}
            className="rounded-lg object-cover max-h-96 w-[320px] border shadow"
          />
        </div>

        {/* Product details */}
        <div className="flex-1 py-4 flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-[#1d8599] mb-2">
            {product.title}
          </h2>
          <div className="flex flex-wrap gap-6 mb-3 text-[#1d8599] text-base">
            <span>
              <strong>Brand:</strong> {product.brand}
            </span>
            <span>
              <strong>Type:</strong> {product.type}
            </span>
            <span>
              <strong>Capacity:</strong> {product.size}
            </span>
            <span>
              <strong>Material:</strong> {product.material || "-"}
            </span>
            {product.mrp && (
              <span>
                <strong>MRP:</strong>{" "}
                <span className="line-through text-gray-400">
                  ₹{product.mrp}
                </span>
              </span>
            )}
            <span>
              <strong>In Stock:</strong>{" "}
              {product.inStock > 0 ? (
                <span className="text-green-600">{product.inStock}</span>
              ) : (
                <span className="text-red-500">Out of stock</span>
              )}
            </span>
          </div>
          <div className="text-xl font-semibold text-[#001442]">
            Price: <span className="text-[#1d8599]">₹{product.price}</span>
          </div>
          <div className="text-gray-700 text-base mt-2">
            {product.description}
          </div>
          {/* Order section */}
          <div className="mt-6 flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Qty:</span>
              <button
                disabled={qty <= 2}
                className="bg-[#f0fbff] px-3 py-1 text-xl rounded-l hover:bg-[#e7f9fb] border border-[#bee6ee]"
                onClick={() => handleQty(-1)}
                type="button"
              >
                -
              </button>
              <span className="px-4 font-bold">{qty}</span>
              <button
                className="bg-[#f0fbff] px-3 py-1 text-xl rounded-r hover:bg-[#e7f9fb] border border-[#bee6ee]"
                onClick={() => handleQty(1)}
                type="button"
              >
                +
              </button>
            </div>
            <button
              className="bg-[#1d8599] text-white font-bold rounded px-8 py-2 hover:bg-[#135a6d] disabled:opacity-50"
              disabled={qty < 2 || product.inStock < qty}
              onClick={handleOrderNow}
            >
              {product.inStock < qty ? "Not enough stock" : "Order Now"}
            </button>
          </div>
          <div className="text-sm text-gray-500 mt-1 pl-1">
            *Minimum order quantity is <b>2</b>.
          </div>
          <div>
            <button
              className="bg-[#1d8599] text-white font-bold rounded px-8 py-2 hover:bg-[#135a6d] disabled:opacity-50"
              disabled={qty < 2 || product.inStock < qty}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Similar products */}
      <div className="max-w-6xl mx-auto py-12">
        <h2 className="text-2xl font-bold text-[#1d8599] mb-5 px-2">
          Similar Products
        </h2>
        <div className="flex flex-wrap gap-8 justify-center">
          {similar.length === 0 ? (
            <div className="text-gray-400">No similar products found.</div>
          ) : (
            similar.map((sim) => <ProductCard key={sim._id} product={sim} />)
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;

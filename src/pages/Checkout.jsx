import React, { useState, useEffect, useContext } from "react";
import Stepper from "../components/Stepper";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegTrashAlt, FaTimes } from "react-icons/fa";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showServiceBanner, setShowServiceBanner] = useState(true);

  // Load initial checkout products
  const initialProducts =
    location.state?.products && location.state.products.length
      ? location.state.products
      : (() => {
          try {
            return JSON.parse(
              localStorage.getItem("pendingCheckoutProducts") || "[]"
            );
          } catch {
            return [];
          }
        })();

  const [productsToCheckout, setProductsToCheckout] = useState(initialProducts);
  useEffect(() => {
    localStorage.setItem(
      "pendingCheckoutProducts",
      JSON.stringify(productsToCheckout)
    );
  }, [productsToCheckout]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // for address save errors
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
    altPhone: "",
  });

  // Fetch address on page load
  useEffect(() => {
    if (!user) return;
    async function fetchAddress() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://biller-backend-xdxp.onrender.com/api/users/me/address",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data) setAddress(res.data);
      } catch {
        console.log("error");
      }
      setLoading(false);
    }
    fetchAddress();
  }, [user]);

  function handleChange(e) {
    setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleRemoveProduct(idx) {
    setProductsToCheckout((prev) => prev.filter((_, i) => i !== idx));
  }

  // Address validation: must be filled to proceed
  const allAddressFieldsFilled =
    address.line1 &&
    address.city &&
    address.state &&
    address.zipcode &&
    address.country &&
    address.phone &&
    address.altPhone;

  // Auto-save address & proceed on Deliver Here
  async function handleDeliverHere() {
    if (!allAddressFieldsFilled) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://biller-backend-xdxp.onrender.com/api/users/me/address",
        address,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
      navigate("/payment", { state: { products: productsToCheckout } });
    } catch {
      setLoading(false);
      setError("Failed to save address. Please check your details.");
    }
  }

  if (!productsToCheckout.length) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-1 flex items-center justify-center text-[#1d8599] font-semibold">
          {showServiceBanner && (
            <div
              className="relative w-full mt-8 bg-yellow-100 border-b border-red-300 py-3 text-center font-semibold text-yellow-800 text-sm md:text-base"
              style={{ zIndex: 20 }}
            >
              <span className="mx-2">⚠️</span>
              Our service is only available in <b>Navi Mumbai</b> at this time.
              <button
                className="absolute right-5 top-1/2 -translate-y-1/2 text-red-600 hover:bg-red-100 rounded-full p-1"
                aria-label="Close notice"
                onClick={() => setShowServiceBanner(false)}
              >
                <FaTimes />
              </button>
            </div>
          )}
          No products selected for checkout.{" "}
          <a href="/cart" className="ml-3 underline">
            Go back to cart
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f7fdff]">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full flex-1 px-4 py-12">
        {showServiceBanner && (
          <div
            className="relative w-full mt-8 bg-yellow-100 border-b border-red-300 py-3 text-center font-semibold text-yellow-800 text-sm md:text-base"
            style={{ zIndex: 20 }}
          >
            <span className="mx-2">⚠️</span>
            Our service is only available in <b>Navi Mumbai</b> at this time.
            <button
              className="absolute right-5 top-1/2 -translate-y-1/2 text-red-600 hover:bg-red-100 rounded-full p-1"
              aria-label="Close notice"
              onClick={() => setShowServiceBanner(false)}
            >
              <FaTimes />
            </button>
          </div>
        )}
        <Stepper currentStep={1} />
        <div className="flex flex-col md:flex-row gap-10">
          {/* LEFT: Products */}
          <div className="flex-1 border bg-white rounded shadow p-6 min-w-[300px]">
            <h2 className="text-2xl font-bold mb-4 text-[#1d8599]">
              Your Product(s)
            </h2>
            {productsToCheckout.map(({ product, quantity }, idx) => (
              <div
                key={product._id}
                className="mb-4 flex items-center border-b pb-2"
              >
                <img
                  src={
                    product.image.startsWith("/uploads")
                      ? `https://biller-backend-xdxp.onrender.com${product.image}`
                      : product.image
                  }
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded mr-3"
                />
                <div className="flex-grow min-w-0">
                  <div className="font-semibold text-[#1d8599]">
                    {product.title}
                  </div>
                  <div
                    className="text-gray-700 text-sm truncate max-w-xs whitespace-nowrap overflow-hidden"
                    title={product.description}
                  >
                    {product.description}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    ₹{product.price} × {quantity}
                  </div>
                </div>
                <button
                  className="ml-2 text-red-500 hover:bg-red-100 rounded-full p-2"
                  title="Remove from checkout"
                  onClick={() => handleRemoveProduct(idx)}
                  disabled={loading}
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            ))}
          </div>
          {/* RIGHT: Address Form */}
          <div className="w-full max-w-md border rounded shadow p-6 bg-white">
            <h2 className="text-xl font-bold text-[#1d8599] mb-4">
              Shipping Address
            </h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <input
                  required
                  name="line1"
                  onChange={handleChange}
                  value={address.line1}
                  className="border w-full px-3 py-1 rounded"
                  placeholder="Address Line 1"
                />
                <input
                  name="line2"
                  onChange={handleChange}
                  value={address.line2}
                  className="border w-full px-3 py-1 rounded"
                  placeholder="Address Line 2"
                />
                <input
                  required
                  name="city"
                  onChange={handleChange}
                  value={address.city}
                  className="border w-full px-3 py-1 rounded"
                  placeholder="City"
                />
                <input
                  required
                  name="state"
                  onChange={handleChange}
                  value={address.state}
                  className="border w-full px-3 py-1 rounded"
                  placeholder="State"
                />
                <input
                  required
                  name="zipcode"
                  onChange={handleChange}
                  value={address.zipcode}
                  className="border w-full px-3 py-1 rounded"
                  placeholder="Zipcode"
                />
                <input
                  required
                  name="country"
                  onChange={handleChange}
                  value={address.country}
                  className="border w-full px-3 py-1 rounded"
                  placeholder="Country"
                />
                <input
                  required
                  name="phone"
                  onChange={handleChange}
                  value={address.phone}
                  className="border w-full px-3 py-1 rounded"
                  placeholder="Phone Number"
                />
                <input
                  required
                  name="altPhone"
                  onChange={handleChange}
                  value={address.altPhone}
                  className="border w-full px-3 py-1 rounded"
                  placeholder="Alternate Phone Number"
                />
              </div>
            </form>
            {error && (
              <div className="text-red-600 font-medium py-2">{error}</div>
            )}
            {/* Deliver Here button only if ALL fields are filled */}
            <button
              className={`mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded ${
                (!allAddressFieldsFilled || loading) &&
                "opacity-60 cursor-not-allowed"
              }`}
              onClick={handleDeliverHere}
              disabled={!allAddressFieldsFilled || loading}
            >
              {loading ? "Saving & Proceeding..." : "Deliver Here"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;

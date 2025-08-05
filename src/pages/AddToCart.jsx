/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Stepper from "../components/Stepper";
import Spinner from "../components/Spinner";
import RemoveModal from "../components/RemoveModal";
import { FaRegTrashAlt } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://biller-backend-xdxp.onrender.com";
const AddToCart = () => {
  const { user } = useContext(AuthContext);
  const { cart, loading, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [checkoutMode, setCheckoutMode] = useState("all"); // "all" or "single"
  const [selectedIndexes, setSelectedIndexes] = useState([]); // for single checkout

  // Always call ALL hooks before any render/return!!!

  // Remove index from selectedIndexes if product removed from cart
  useEffect(() => {
    if (selectedIndexes.length > 0 && checkoutMode === "single") {
      setSelectedIndexes((prev) =>
        prev.filter((itemIdx) => itemIdx < cart.items.length)
      );
    }
    // eslint-disable-next-line
  }, [cart.items.length]); // don't return early before the hook

  // Deselect all when mode changes
  useEffect(() => {
    if (checkoutMode === "all") setSelectedIndexes([]);
  }, [checkoutMode]);

  // --- END OF HOOKS ---

  const openDeleteModal = (idx) => setDeleteIndex(idx);
  const closeDeleteModal = () => setDeleteIndex(null);

  const handleRemoveConfirm = () => {
    if (deleteIndex === null) return;
    const productId = cart.items[deleteIndex].product._id;
    removeFromCart(productId);
    closeDeleteModal();
  };

  let priceTotal = 0,
    deliveryChargeTotal = 0,
    itemsCount = 0;
  let productsForPriceDetails = cart.items;

  if (checkoutMode === "single") {
    productsForPriceDetails =
      selectedIndexes.length > 0
        ? selectedIndexes.map((idx) => cart.items[idx])
        : [];
  }

  itemsCount = productsForPriceDetails.length;
  priceTotal = productsForPriceDetails.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );
  deliveryChargeTotal = productsForPriceDetails.reduce(
    (acc, item) => acc + item.quantity * (item.product.deliveryCharge || 0),
    0
  );
  const discount = 0;
  const totalAmount = priceTotal + deliveryChargeTotal - discount;

  // -- EARLY RETURNS only after ALL hooks:

  if (loading) return <Spinner />;

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-[#1d8599] font-semibold">
          Please login to view your cart.
        </div>
        <Footer />
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-500 font-semibold">
          Your cart is empty.
        </div>
        <Footer />
      </div>
    );
  }

  // --- Added function for single product checkout ("Buy Now") ---
  const handleSingleCheckout = (product, quantity) => {
    window.location.href = `/checkout?productId=${product._id}&qty=${quantity}`;
    // Or use navigate('/checkout', { state: { product, quantity } });
  };

  // Add/remove product index to selectedIndexes
  const handleAddToSelection = (idx) => {
    setSelectedIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };
  // Disable checkout if nothing selected in single mode
  const isCheckoutDisabled =
    (checkoutMode === "all" &&
      cart.items.some((item) => item.product.price === 0)) ||
    (checkoutMode === "single" && selectedIndexes.length === 0);

  // Actual submit handler changes (for demo)

  const handleCheckout = () => {
    let productsToCheckout = [];
    if (checkoutMode === "all") {
      productsToCheckout = cart.items;
    } else {
      productsToCheckout = selectedIndexes.map((idx) => cart.items[idx]);
    }

    // Optionally, validate productsToCheckout.length > 0 etc!
    navigate("/checkout", { state: { products: productsToCheckout } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f7fdff]">
      <Navbar />
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-14">
        <Stepper currentStep={0} />

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 border rounded shadow p-6 bg-white">
            {/* Header with select option */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold text-[#1d8599] tracking-wide">
                My Cart
              </h2>
              <select
                className="border rounded text-[#1d8599] font-semibold px-2 py-1 outline-none"
                value={checkoutMode}
                onChange={(e) => setCheckoutMode(e.target.value)}
              >
                <option value="all">Checkout All</option>
                <option value="single">Checkout Single</option>
              </select>
            </div>
            <div className="flex flex-col gap-5">
              {cart.items.map(({ product, quantity }, idx) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 border-b pb-4 last:border-none"
                >
                  <img
                    src={
                      product.image.startsWith("/uploads")
                        ? `${BASE_URL}${product.image}`
                        : product.image
                    }
                    alt={product.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-grow min-w-0">
                    <div className="text-lg font-bold text-[#146e88] truncate">
                      {product.title}
                    </div>
                    <div className="text-gray-600 text-sm line-clamp-2">
                      {product.description}
                    </div>
                    <div className="mt-2 text-[#1d8599] font-semibold">
                      ₹{product.price} × {quantity} = ₹
                      {product.price * quantity}
                    </div>
                    <div className="text-sm text-gray-500">
                      Delivery Charge: ₹
                      {(product.deliveryCharge ?? 0).toFixed(2)} per unit
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center border rounded overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(product._id, Math.max(2, quantity - 1))
                        }
                        disabled={quantity <= 2}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 w-10 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(product._id, quantity + 1)
                        }
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    {/* "Add" button for single mode only */}
                    {checkoutMode === "single" && (
                      <button
                        onClick={() => handleAddToSelection(idx)}
                        className={`rounded px-3.5 py-1 text-sm mt-1 ${
                          selectedIndexes.includes(idx)
                            ? "bg-red-600 text-white"
                            : "bg-[#1d8599] text-white"
                        } hover:bg-[#146e88] transition`}
                      >
                        {selectedIndexes.includes(idx)
                          ? "Uncheckout"
                          : "Checkout"}
                      </button>
                    )}
                    <button
                      onClick={() => openDeleteModal(idx)}
                      className="flex items-center hover:border p-1 px-2 rounded-2xl gap-1 text-red-600 hover:text-red-800 text-sm mt-1 transition"
                    >
                      <FaRegTrashAlt /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Details box */}
          <div className="w-full max-w-sm border rounded shadow p-7 bg-white flex flex-col gap-4 sticky top-20 self-start">
            <h2 className="text-xl font-bold text-[#1d8599] border-b pb-3">
              {checkoutMode === "all"
                ? "Price Details"
                : "Selected Product(s) Details"}
            </h2>
            {/* Show short summary for single products */}
            {checkoutMode === "single" &&
              selectedIndexes.length > 0 &&
              selectedIndexes.map((idx) => {
                const { product, quantity } = cart.items[idx];
                return (
                  <div
                    key={product._id}
                    className="flex justify-between text-sm my-1"
                  >
                    <span className="truncate max-w-[100px]">
                      {product.title}
                    </span>
                    <span>
                      ₹{product.price}×{quantity}
                    </span>
                  </div>
                );
              })}
            <div className="flex justify-between">
              <span>
                Price ({itemsCount} {itemsCount === 1 ? "item" : "items"})
              </span>
              <span>₹{priceTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-700">
              <span>Discount</span>
              <span>₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>₹{deliveryChargeTotal.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <button
              disabled={isCheckoutDisabled}
              className={`mt-4 rounded py-2 ${
                isCheckoutDisabled
                  ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                  : "bg-[#1d8599] text-white"
              }`}
              onClick={handleCheckout}
            >
              {checkoutMode === "all" ? "Checkout All" : "Checkout Selected"}
            </button>
          </div>
        </div>
      </div>

      {deleteIndex !== null && (
        <RemoveModal
          product={cart.items[deleteIndex].product}
          open={deleteIndex !== null}
          onCancel={closeDeleteModal}
          onConfirm={handleRemoveConfirm}
        />
      )}
      <Footer />
    </div>
  );
};

export default AddToCart;

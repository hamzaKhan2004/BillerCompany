/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import Stepper from "../components/Stepper";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

// Helper: dynamically load Razorpay script
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showServiceBanner, setShowServiceBanner] = useState(true);

  // Product state: prefer router state, fallback to localStorage if reloading/back
  const productsToCheckout = location.state?.products || [];
  const safeProducts = productsToCheckout.length
    ? productsToCheckout
    : (() => {
        try {
          return JSON.parse(
            localStorage.getItem("pendingCheckoutProducts") || "[]"
          );
        } catch {
          return [];
        }
      })();

  useEffect(() => {
    if (safeProducts.length) {
      localStorage.setItem(
        "pendingCheckoutProducts",
        JSON.stringify(safeProducts)
      );
    }
  }, [safeProducts]);

  // Get user address (read-only display)
  const { user } = useContext(AuthContext);
  const [address, setAddress] = useState(null);
  useEffect(() => {
    async function fetchAddress() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://biller-backend-xdxp.onrender.com/api/users/me/address",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAddress(res.data);
      } catch (e) {
        setAddress(null);
      }
    }
    fetchAddress();
  }, []);

  // Payment logic/states
  const [paymentType, setPaymentType] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  // Modal states
  const [modal, setModal] = useState({
    show: false,
    type: "info", // 'success', 'error', 'warning', 'info'
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
    showCancel: false,
  });

  function showModal(
    type,
    title,
    message,
    onConfirm = null,
    onCancel = null,
    showCancel = false
  ) {
    setModal({
      show: true,
      type,
      title,
      message,
      onConfirm,
      onCancel,
      showCancel,
    });
  }

  function hideModal() {
    setModal((prev) => ({ ...prev, show: false }));
  }

  function handleSelectPaymentOption(type) {
    setPaymentType(type);
    if (type === "cod") {
      setDeliveryMessage("Free delivery under 2km!");
    } else {
      setDeliveryMessage("");
    }
  }

  // Price details for selected products
  const priceTotal = safeProducts.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );
  const deliveryChargeTotal = safeProducts.reduce(
    (acc, item) => acc + item.quantity * (item.product.deliveryCharge || 0),
    0
  );
  const discount = 0;
  const totalAmount = priceTotal + deliveryChargeTotal - discount;
  const itemCount = safeProducts.reduce((acc, item) => acc + item.quantity, 0);

  function handleBack() {
    navigate("/checkout", { state: { products: safeProducts } });
  }

  // Create order in your DB (common util used by both COD and Razorpay success)
  async function createOrderInBackend(paymentMethod, amount) {
    const token = localStorage.getItem("token");
    await axios.post(
      "https://biller-backend-xdxp.onrender.com/api/orders",
      {
        products: safeProducts,
        address,
        payment: { method: paymentMethod, amount },
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  // Online: initialize Razorpay checkout and on success place the order
  async function startRazorpayCheckout() {
    // Load script
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      showModal(
        "error",
        "Script Loading Failed",
        "Failed to load Razorpay payment gateway. Please check your internet connection and try again.",
        () => hideModal()
      );
      return;
    }
    try {
      // Create a Razorpay order on backend for secure amount/currency
      const token = localStorage.getItem("token");
      const rpOrderRes = await axios.post(
        "https://biller-backend-xdxp.onrender.com/api/razorpay/create-order",
        { amount: totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { keyId, orderId, amount, currency } = rpOrderRes.data;

      const options = {
        key: keyId,
        amount, // in paise, from backend
        currency, // "INR"
        name: "Biller",
        description: "Order Payment",
        order_id: orderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: address?.phone || "",
        },
        theme: { color: "#1d8599" },
        handler: async function (response) {
          try {
            setPlacingOrder(true);
            await createOrderInBackend("RAZORPAY", totalAmount);
            localStorage.removeItem("pendingCheckoutProducts");
            setPlacingOrder(false);

            showModal(
              "success",
              "Payment Successful!",
              "Your payment has been processed successfully. You will be redirected to your orders.",
              () => {
                hideModal();
                navigate("/orders");
              }
            );
          } catch (err) {
            setPlacingOrder(false);
            showModal(
              "warning",
              "Order Creation Failed",
              "Your payment was successful, but there was an issue creating your order. Please contact our support team with your payment details.",
              () => hideModal()
            );
          }
        },
        modal: {
          ondismiss: function () {
            // User closed the modal
          },
        },
        notes: {
          address_line1: address?.line1 || "",
          address_city: address?.city || "",
          address_state: address?.state || "",
          address_zipcode: address?.zipcode || "",
          address_country: address?.country || "",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        showModal(
          "error",
          "Payment Failed",
          "Your payment could not be processed. Please try a different payment method or contact your bank.",
          () => hideModal()
        );
      });
      rzp.open();
    } catch (e) {
      showModal(
        "error",
        "Payment Initialization Failed",
        "Unable to initialize online payment. Please try again or choose Cash on Delivery.",
        () => hideModal()
      );
    }
  }

  // Place Order (COD) or start Razorpay
  async function handlePayment() {
    if (!paymentType) return;
    if (paymentType === "online") {
      await startRazorpayCheckout();
      return;
    }
    // COD flow (unchanged)
    setPlacingOrder(true);
    try {
      await createOrderInBackend("COD", totalAmount);
      localStorage.removeItem("pendingCheckoutProducts");
      setPlacingOrder(false);

      showModal(
        "success",
        "Order Placed Successfully!",
        "Your order has been placed successfully. You will be redirected to your orders.",
        () => {
          hideModal();
          navigate("/orders");
        }
      );
    } catch (e) {
      setPlacingOrder(false);
      showModal(
        "error",
        "Order Failed",
        "Failed to place your order. Please check your internet connection and try again.",
        () => hideModal()
      );
    }
  }

  // Reusable Modal Component
  function CustomModal() {
    if (!modal.show) return null;

    const getIcon = () => {
      switch (modal.type) {
        case "success":
          return <FaCheckCircle className="text-green-500 text-3xl mb-4" />;
        case "error":
          return <FaTimesCircle className="text-red-500 text-3xl mb-4" />;
        case "warning":
          return (
            <FaExclamationTriangle className="text-yellow-500 text-3xl mb-4" />
          );
        default:
          return (
            <FaExclamationTriangle className="text-blue-500 text-3xl mb-4" />
          );
      }
    };

    const getButtonColor = () => {
      switch (modal.type) {
        case "success":
          return "bg-green-600 hover:bg-green-700";
        case "error":
          return "bg-red-600 hover:bg-red-700";
        case "warning":
          return "bg-yellow-600 hover:bg-yellow-700";
        default:
          return "bg-[#1d8599] hover:bg-[#165a6b]";
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
          <div className="text-center">
            {getIcon()}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {modal.title}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {modal.message}
            </p>
            <div className="flex gap-3 justify-center">
              {modal.showCancel && (
                <button
                  onClick={() => {
                    hideModal();
                    if (modal.onCancel) modal.onCancel();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {
                  hideModal();
                  if (modal.onConfirm) modal.onConfirm();
                }}
                className={`px-6 py-2 text-white rounded-lg font-semibold transition-colors ${getButtonColor()}`}
              >
                {modal.showCancel ? "Confirm" : "OK"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle nothing to checkout
  if (!safeProducts || !safeProducts.length) {
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
          No products selected for payment.{" "}
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
      <CustomModal />
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
        <Stepper currentStep={2} />
        <button
          className="mb-5 text-[#1d8599] bg-white border p-2 rounded shadow font-bold"
          onClick={handleBack}
        >
          &larr; Back
        </button>
        <div className="flex flex-col md:flex-row gap-10">
          {/* LEFT: Address Summary and Payment */}
          <div className="flex-1 border rounded bg-white shadow p-6 min-w-[300px] mb-6 md:mb-0">
            <h2 className="text-xl font-bold text-[#1d8599] mb-2">
              Shipping Address
            </h2>
            {address ? (
              <div>
                <div>
                  {address.line1}, {address.line2 && `${address.line2}, `}
                  {address.city}
                </div>
                <div>
                  {address.state}, {address.zipcode}, {address.country}
                </div>
                <div>
                  Phone: <span className="font-semibold">{address.phone}</span>
                </div>
                <div>
                  Alternate:{" "}
                  <span className="font-semibold">{address.altPhone}</span>
                </div>
              </div>
            ) : (
              <div>Loading address...</div>
            )}
            <hr className="my-4" />
            <h3 className="font-semibold mt-4 mb-2 text-[#1d8599]">Buying:</h3>
            <div>
              {safeProducts.map(({ product, quantity }) => (
                <div
                  key={product._id}
                  className="flex items-center gap-2 mb-2 bg-[#f5fafd] p-2 rounded"
                >
                  <img
                    src={
                      product.image.startsWith("/uploads")
                        ? `https://biller-backend-xdxp.onrender.com${product.image}`
                        : product.image
                    }
                    alt={product.title}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <span className="font-medium">
                    {product.title} × {quantity}
                  </span>
                </div>
              ))}
            </div>
            {/* Payment Options */}
            <div className="mt-4">
              <div>
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  checked={paymentType === "cod"}
                  onChange={() => handleSelectPaymentOption("cod")}
                />
                <label htmlFor="cod" className="ml-2 text-lg font-semibold">
                  Cash on Delivery
                </label>
                {paymentType === "cod" && (
                  <span className="ml-3 text-green-600 font-bold">
                    {deliveryMessage}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <input
                  type="radio"
                  id="online"
                  name="payment"
                  checked={paymentType === "online"}
                  onChange={() => handleSelectPaymentOption("online")}
                />
                <label htmlFor="online" className="ml-2 text-lg font-semibold">
                  Online Payment
                </label>
              </div>
            </div>
            <button
              disabled={!paymentType || placingOrder}
              className="mt-6 w-full bg-[#1d8599] text-white font-bold py-2 rounded disabled:opacity-60"
              onClick={handlePayment}
            >
              {placingOrder
                ? "Placing Order..."
                : paymentType
                ? paymentType === "online"
                  ? "Pay Now"
                  : "Place Order"
                : "Select a Payment Option"}
            </button>
          </div>
          {/* RIGHT: Price Details for Selected Product(s) */}
          <div className="w-full max-w-md border rounded shadow p-7 bg-white flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[#1d8599] border-b pb-3">
              Price Details
            </h2>
            <div className="flex justify-between">
              <span>
                Price ({itemCount} {itemCount === 1 ? "item" : "items"})
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;

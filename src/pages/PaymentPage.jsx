/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect, useContext } from "react";
// import Stepper from "../components/Stepper";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import { AuthContext } from "../context/AuthContext";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";

// const PaymentPage = () => {
//   // -- Grab router state and navigation helpers --
//   const location = useLocation();
//   const navigate = useNavigate();

//   // -- 1. Get the selected products for payment --
//   // Read from route state (from Deliver Here), else localStorage (for reload/back)
//   const productsToCheckout = location.state?.products || [];
//   // Fallback to localStorage if route state is missing (eg on reload)
//   const safeProducts = productsToCheckout.length
//     ? productsToCheckout
//     : (() => {
//         try {
//           return JSON.parse(
//             localStorage.getItem("pendingCheckoutProducts") || "[]"
//           );
//         } catch {
//           return [];
//         }
//       })();

//   // -- 2. Persist to localStorage (so page reload/back works) --
//   useEffect(() => {
//     if (safeProducts.length) {
//       localStorage.setItem(
//         "pendingCheckoutProducts",
//         JSON.stringify(safeProducts)
//       );
//     }
//   }, [safeProducts]);

//   // -- 3. Fetch shipping address --
//   const { user } = useContext(AuthContext);
//   const [address, setAddress] = useState(null);

//   useEffect(() => {
//     async function fetchAddress() {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           "https://biller-backend-xdxp.onrender.com/api/users/me/address",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setAddress(res.data);
//       } catch (e) {
//         setAddress(null);
//       }
//     }
//     fetchAddress();
//   }, []);

//   // -- 4. Payment state/logic --
//   const [paymentType, setPaymentType] = useState("");
//   const [deliveryMessage, setDeliveryMessage] = useState("");

//   function handleSelectPaymentOption(type) {
//     setPaymentType(type);
//     if (type === "cod") {
//       setDeliveryMessage("Free delivery under 2km!");
//     } else {
//       setDeliveryMessage("");
//     }
//   }

//   function handlePayment() {
//     alert("Payment Done! (fake)");
//     // Clear pending checkout state
//     localStorage.removeItem("pendingCheckoutProducts");
//     navigate("/");
//   }

//   // -- 5. Always calculate prices from safeProducts! --
//   const priceTotal = safeProducts.reduce(
//     (acc, item) => acc + item.quantity * item.product.price,
//     0
//   );
//   const deliveryChargeTotal = safeProducts.reduce(
//     (acc, item) => acc + item.quantity * (item.product.deliveryCharge || 0),
//     0
//   );
//   const discount = 0;
//   const totalAmount = priceTotal + deliveryChargeTotal - discount;
//   const itemCount = safeProducts.reduce((acc, item) => acc + item.quantity, 0);

//   // -- 6. Go back: retain product selection --
//   function handleBack() {
//     navigate("/checkout", { state: { products: safeProducts } });
//   }

//   // -- 7. If nothing to checkout, warn and go back --
//   if (!safeProducts || !safeProducts.length) {
//     return (
//       <div className="flex flex-col min-h-screen">
//         <Navbar />
//         <div className="flex-1 flex items-center justify-center text-[#1d8599] font-semibold">
//           No products selected for payment.{" "}
//           <a href="/cart" className="ml-3 underline">
//             Go back to cart
//           </a>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-[#f7fdff]">
//       <Navbar />
//       <div className="max-w-7xl mx-auto w-full flex-1 px-4 py-12">
//         <Stepper currentStep={2} />

//         <button
//           className="mb-5 text-[#1d8599] bg-white border p-2 rounded shadow font-bold"
//           onClick={handleBack}
//         >
//           &larr; Back
//         </button>
//         <div className="flex flex-col md:flex-row gap-10">
//           {/* LEFT: Address Summary and Payment */}
//           <div className="flex-1 border rounded bg-white shadow p-6 min-w-[300px] mb-6 md:mb-0">
//             <h2 className="text-xl font-bold text-[#1d8599] mb-2">
//               Shipping Address
//             </h2>
//             {address ? (
//               <div>
//                 <div>
//                   {address.line1}, {address.line2 && `${address.line2}, `}
//                   {address.city}
//                 </div>
//                 <div>
//                   {address.state}, {address.zipcode}, {address.country}
//                 </div>
//                 <div>
//                   Phone: <span className="font-semibold">{address.phone}</span>
//                 </div>
//                 <div>
//                   Alternate:{" "}
//                   <span className="font-semibold">{address.altPhone}</span>
//                 </div>
//               </div>
//             ) : (
//               <div>Loading address...</div>
//             )}
//             <hr className="my-4" />
//             {/* List the products being paid for */}
//             <h3 className="font-semibold mt-4 mb-2 text-[#1d8599]">Buying:</h3>
//             <div>
//               {safeProducts.map(({ product, quantity }) => (
//                 <div
//                   key={product._id}
//                   className="flex items-center gap-2 mb-2 bg-[#f5fafd] p-2 rounded"
//                 >
//                   <img
//                     src={
//                       product.image.startsWith("/uploads")
//                         ? `https://biller-backend-xdxp.onrender.com${product.image}`
//                         : product.image
//                     }
//                     alt={product.title}
//                     className="w-8 h-8 rounded object-cover"
//                   />
//                   <span className="font-medium">
//                     {product.title} × {quantity}
//                   </span>
//                 </div>
//               ))}
//             </div>
//             {/* Payment Options */}
//             <div className="mt-4">
//               <div>
//                 <input
//                   type="radio"
//                   id="cod"
//                   name="payment"
//                   checked={paymentType === "cod"}
//                   onChange={() => handleSelectPaymentOption("cod")}
//                 />
//                 <label htmlFor="cod" className="ml-2 text-lg font-semibold">
//                   Cash on Delivery
//                 </label>
//                 {paymentType === "cod" && (
//                   <span className="ml-3 text-green-600 font-bold">
//                     {deliveryMessage}
//                   </span>
//                 )}
//               </div>
//               <div className="mt-2">
//                 <input
//                   type="radio"
//                   id="online"
//                   name="payment"
//                   checked={paymentType === "online"}
//                   onChange={() => handleSelectPaymentOption("online")}
//                 />
//                 <label htmlFor="online" className="ml-2 text-lg font-semibold">
//                   Online Payment (Demo)
//                 </label>
//               </div>
//             </div>
//             <button
//               disabled={!paymentType}
//               className="mt-6 w-full bg-[#1d8599] text-white font-bold py-2 rounded disabled:opacity-60"
//               onClick={handlePayment}
//             >
//               {paymentType ? "Pay Now" : "Select a Payment Option"}
//             </button>
//           </div>
//           {/* RIGHT: Price Details for Selected Product(s) */}
//           <div className="w-full max-w-md border rounded shadow p-7 bg-white flex flex-col gap-4">
//             <h2 className="text-xl font-bold text-[#1d8599] border-b pb-3">
//               Price Details
//             </h2>
//             <div className="flex justify-between">
//               <span>
//                 Price ({itemCount} {itemCount === 1 ? "item" : "items"})
//               </span>
//               <span>₹{priceTotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between text-green-700">
//               <span>Discount</span>
//               <span>₹{discount.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Delivery Charges</span>
//               <span>₹{deliveryChargeTotal.toFixed(2)}</span>
//             </div>
//             <div className="border-t pt-3 flex justify-between font-semibold text-lg">
//               <span>Total Amount</span>
//               <span>₹{totalAmount.toFixed(2)}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default PaymentPage;
import React, { useState, useEffect, useContext } from "react";
import Stepper from "../components/Stepper";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

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
  const [showOnlineModal, setShowOnlineModal] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

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

  // Place Order (COD)
  async function handlePayment() {
    if (paymentType === "online") {
      setShowOnlineModal(true);
      return;
    }
    setPlacingOrder(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://biller-backend-xdxp.onrender.com/api/orders",
        {
          products: safeProducts,
          address,
          payment: { method: "COD", amount: totalAmount },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("pendingCheckoutProducts");
      setPlacingOrder(false);
      navigate("/orders");
    } catch (e) {
      alert("Failed to place order. Please try again.");
      setPlacingOrder(false);
    }
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

  // Online payment modal
  function OnlinePaymentModal() {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9998]">
        <div className="bg-white shadow-md rounded p-8 w-80 text-center">
          <div className="text-2xl font-bold mb-2 text-[#1d8599]">
            Online Payment Unavailable
          </div>
          <div className="mb-6 text-zinc-700">
            Sorry, online payment service is
            <br />
            not available now.
          </div>
          <button
            className="bg-[#1d8599] text-white px-6 py-2 rounded font-bold"
            onClick={() => setShowOnlineModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f7fdff]">
      <Navbar />
      {showOnlineModal && <OnlinePaymentModal />}
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
                  Online Payment (Demo)
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

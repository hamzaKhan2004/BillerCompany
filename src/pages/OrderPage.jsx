/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const statusColors = {
  processing: "bg-yellow-100 text-yellow-700",
  "out for delivery": "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-700",
};

const OrdersPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://biller-backend-xdxp.onrender.com/api/orders/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(res.data);
      } catch (e) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Separate current and delivered orders
  const currentOrders = orders.filter(
    (order) => (order.status || "").toLowerCase() !== "delivered"
  );
  const deliveredOrders = orders.filter(
    (order) => (order.status || "").toLowerCase() === "delivered"
  );

  // Helper to render order card (used in both sections)
  function OrderCard({ order }) {
    return (
      <div
        key={order._id}
        className="rounded-lg border bg-white shadow mb-8 p-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-semibold text-[#146e88]">
              Order #{order._id.slice(-6).toUpperCase()}
            </span>
            <span className="ml-4 text-gray-500 text-xs">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>
          <div
            className={`px-3 py-1 rounded capitalize font-bold text-sm ${
              statusColors[order.status] || "bg-gray-50 text-gray-500"
            }`}
          >
            {order.status}
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-700">
          <div>
            <span className="font-semibold">Address:</span>{" "}
            {order.address.line1},{" "}
            {order.address.line2 && order.address.line2 + ", "}
            {order.address.city}, {order.address.state}, {order.address.zipcode}
            , {order.address.country}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {order.address.phone}
            {order.address.altPhone && (
              <>
                {" "}
                <span className="ml-2 font-semibold">Alt:</span>{" "}
                {order.address.altPhone}
              </>
            )}
          </div>
        </div>
        <div className="border-t mt-3 pt-3">
          <span className="font-semibold text-[#1d8599]">Products:</span>
          {order.products.map((item, i) => {
            const image = (item.product?.image || item.image || "").startsWith(
              "/uploads"
            )
              ? `https://biller-backend-xdxp.onrender.com${
                  item.product?.image || item.image || ""
                }`
              : item.product?.image || item.image || "/placeholder.png";
            const title =
              item.product?.title || item.title || "Unknown product";
            const description =
              item.product?.description || item.description || "";
            const price = item.product?.price ?? item.price ?? 0;
            const deliveryCharge =
              item.product?.deliveryCharge ?? item.deliveryCharge ?? 0;
            const quantity = item.quantity || 1;
            return (
              <div
                key={(item.product?._id || item._id || i) + "-product"}
                className="flex items-start gap-3 mt-2 border-b p-2 last:border-0"
              >
                <img
                  src={image}
                  alt={title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-grow min-w-0">
                  <div className="font-semibold text-[#146e88] line-clamp-1">
                    {title}
                  </div>
                  <div className="text-gray-500 text-xs truncate max-w-sm">
                    {description}
                  </div>
                  <div className="text-xs mt-1">
                    Price:{" "}
                    <span className="font-medium">₹{price.toFixed(2)}</span>
                    <br />
                    Delivery Charge (per item):{" "}
                    <span className="font-medium">
                      ₹{deliveryCharge.toFixed(2)}
                    </span>
                    <br />
                    Quantity: <span className="font-medium">{quantity}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end text-xs font-semibold">
                  <span className="text-[#1d8599]">
                    Subtotal: ₹{(quantity * price).toFixed(2)}
                  </span>
                  <span className="text-[#e06710]">
                    Delivery: ₹{(quantity * deliveryCharge).toFixed(2)}
                  </span>
                  <span className="text-black">
                    <span className="text-[11px] font-normal text-gray-400">
                      Line Total
                    </span>{" "}
                    <br />₹
                    {(quantity * price + quantity * deliveryCharge).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t mt-3 pt-3 font-bold flex justify-between">
          <span>Total</span>
          <span>₹{order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f7fdff]">
      <Navbar />
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-12 my-5">
        <h1 className="text-2xl md:text-3xl mb-8 font-bold text-[#1d8599]">
          My Orders
        </h1>
        {loading ? (
          <div>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-400 font-semibold mt-32">
            No orders yet.
          </div>
        ) : (
          <>
            {/* Current Orders (not delivered) */}
            {currentOrders.length > 0 && (
              <section className="mb-14">
                <h2 className="text-xl font-bold mb-4 text-[#13b7b8]">
                  Current Orders
                </h2>
                {currentOrders.map((order) => (
                  <OrderCard order={order} key={order._id} />
                ))}
              </section>
            )}

            {/* History (Delivered Orders) */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-[#2e4870]">History</h2>
              {deliveredOrders.length === 0 ? (
                <div className="text-center text-gray-400 font-semibold">
                  No delivered orders yet.
                </div>
              ) : (
                deliveredOrders.map((order) => (
                  <OrderCard order={order} key={order._id} />
                ))
              )}
            </section>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;

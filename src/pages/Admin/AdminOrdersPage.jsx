/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext, useMemo } from "react";
import AdminSideBar from "../../components/AdminSidebar";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaDownload, FaEye } from "react-icons/fa";
import { format } from "date-fns";

// Utility to download CSV from an array of objects
function downloadCSV(orders) {
  if (!orders.length) return;
  const replacer = (_, v) => (v === null ? "" : v);
  const fields = [
    "orderId",
    "userName",
    "userEmail",
    "userPhone",
    "createdAt",
    "status",
    "totalAmount",
    "products",
    "address",
    "payment",
  ];
  const csv = [
    fields.join(","),
    ...orders.map((row) =>
      fields
        .map((fieldName) => {
          if (fieldName === "products") {
            return JSON.stringify(
              row.products.map((item) => `${item.title} (x${item.quantity})`)
            );
          }
          if (fieldName === "address") {
            return [
              row.address.line1,
              row.address.line2,
              row.address.city,
              row.address.state,
              row.address.zipcode,
              row.address.country,
              row.address.phone,
              row.address.altPhone,
            ]
              .filter(Boolean)
              .join(" ");
          }
          if (fieldName === "payment") {
            // Use real Unicode ₹ regardless of file encoding
            return `${row.payment?.method || ""} ₹${row.payment?.amount || ""}`;
          }
          if (fieldName === "totalAmount") {
            // Always use Unicode rupee here too
            return `₹${row[fieldName]}`;
          }
          return JSON.stringify(row[fieldName], replacer);
        })
        .join(",")
    ),
  ].join("\r\n");
  // Add UTF-8 BOM at start for Excel compatibility
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "orders.csv";
  a.click();
  window.URL.revokeObjectURL(url);
}

const statusColors = {
  processing: "bg-yellow-100 text-yellow-700",
  "out for delivery": "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-700",
};
const statusOptions = ["processing", "out for delivery", "delivered"];

function AdminOrdersPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [error, setError] = useState(null);

  // --- Filters and search ---
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [detailOrder, setDetailOrder] = useState(null);

  // --- Fetch orders from backend once ---
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://biller-backend-xdxp.onrender.com/api/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(res.data || []);
        setError(null);
      } catch (e) {
        setError("Failed to fetch orders");
        setOrders([]);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  // --- Filtering and search logic (runs on every filter/search update) ---
  useEffect(() => {
    let filtered = [...orders];
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          (order._id && order._id.toLowerCase().includes(q)) ||
          (order.user?.email && order.user.email.toLowerCase().includes(q)) ||
          (order.user?.name && order.user.name.toLowerCase().includes(q))
      );
    }
    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }
    if (dateStart) {
      const start = new Date(dateStart).getTime();
      filtered = filtered.filter(
        (order) => new Date(order.createdAt).getTime() >= start
      );
    }
    if (dateEnd) {
      const end = new Date(dateEnd).getTime();
      filtered = filtered.filter(
        (order) => new Date(order.createdAt).getTime() <= end + 86400000 // include last day
      );
    }
    setFilteredOrders(filtered);
  }, [orders, search, statusFilter, dateStart, dateEnd]);

  // --- Debounced search for UX ---
  const [tempSearch, setTempSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setSearch(tempSearch), 300);
    return () => clearTimeout(t);
  }, [tempSearch]);

  // --- Status change handler ---
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating((prev) => ({ ...prev, [orderId]: true }));
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `https://biller-backend-xdxp.onrender.com/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: res.data.status } : o
        )
      );
    } catch (e) {
      alert("Failed to update order status.");
    }
    setUpdating((prev) => ({ ...prev, [orderId]: false }));
  };

  // --- Export filtered orders as CSV ---
  const handleExportCSV = () => {
    // Flatten out products user info for CSV
    const rows = filteredOrders.map((order) => ({
      orderId: order._id,
      userName: order.user?.name || "",
      userEmail: order.user?.email || "",
      userPhone: order.user?.phone || "",
      createdAt: format(new Date(order.createdAt), "yyyy-MM-dd HH:mm:ss"),
      status: order.status || "",
      totalAmount: order.totalAmount ?? "",
      products: order.products.map(
        (p) => `${p.title || p.product?.title || "-"} (x${p.quantity})`
      ),
      address: order.address,
      payment: order.payment,
    }));
    downloadCSV(rows);
  };

  // --- RenderTable ---
  return (
    <div className="flex min-h-screen bg-[#f7fdff] flex-row">
      <AdminSideBar />

      <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl mb-8 font-bold text-[#146e88]">
          All Orders (Admin)
        </h1>

        {/* Toolbar: Search, filters, export */}
        <div className="flex flex-wrap gap-3 mb-3 items-end">
          <div className="flex items-center bg-white border rounded px-2">
            <FaSearch className="text-[#151818e3] mr-2" />
            <input
              className="p-1 bg-transparent outline-none"
              value={tempSearch}
              onChange={(e) => setTempSearch(e.target.value)}
              placeholder="Search by Order ID, name, or email"
              type="search"
              style={{ width: 220 }}
            />
          </div>
          <div>
            <label className="text-sm mr-1">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">All</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm mr-1">Start Date:</label>
            <input
              type="date"
              value={dateStart}
              className="border rounded px-2 py-1"
              onChange={(e) => setDateStart(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm mr-1">End Date:</label>
            <input
              type="date"
              value={dateEnd}
              className="border rounded px-2 py-1"
              onChange={(e) => setDateEnd(e.target.value)}
            />
          </div>
          <button
            className="flex items-center bg-[#19b1ae] hover:bg-[#127c76] text-white px-4 py-2 rounded font-medium ml-auto"
            onClick={handleExportCSV}
            title="Export filtered orders as CSV"
          >
            <FaDownload className="mr-2" /> Export CSV
          </button>
        </div>
        {/* Table */}
        {error && <div className="text-red-600 mb-3">{error}</div>}
        {loading ? (
          <div>Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center text-gray-400 font-semibold mt-32">
            No orders.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl shadow-2xl  p-1">
            <table className="min-w-full text-[15px] rounded-2xl">
              <thead>
                <tr className="bg-[#f0fbff] text-[#146e88] rounded-3xl text-left">
                  <th className="py-2 px-4">Order #</th>
                  <th className="py-2 px-4">Customer</th>
                  <th className="py-2 px-4">Contact</th>
                  <th className="py-2 px-4">Order Date</th>
                  <th className="py-2 px-4">Total (₹)</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t  hover:bg-[#f7fdff] transition"
                  >
                    <td className="py-2 px-4">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-2 px-4">
                      <div className="font-semibold">
                        {order.user?.name || "-"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.user?.email}
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div>{order.user?.phone}</div>
                    </td>
                    <td className="py-2 px-4">
                      {format(new Date(order.createdAt), "yyyy-MM-dd HH:mm")}
                    </td>
                    <td className="py-2 px-4 font-semibold">
                      {order.totalAmount?.toFixed(2) ?? "-"}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs capitalize font-bold ${
                          statusColors[order.status] ||
                          "bg-gray-50 text-gray-500"
                        }`}
                      >
                        {order.status}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="ml-2 border px-1 py-1 rounded text-xs"
                        disabled={updating[order._id]}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        className="bg-[#19b1ae] hover:bg-[#127c76] text-white px-3 py-1 rounded font-medium"
                        onClick={() =>
                          navigate(`/admin/customers/${order.user?._id || ""}`)
                        }
                      >
                        View Customer
                      </button>
                      <button
                        className="bg-[#146e88] hover:bg-[#0d566e] px-3 py-1 rounded text-white flex items-center font-medium"
                        onClick={() => setDetailOrder(order)}
                        title="Order Details"
                      >
                        <FaEye className="mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Detailed Modal */}
        {detailOrder && (
          <OrderDetailModal
            order={detailOrder}
            onClose={() => setDetailOrder(null)}
          />
        )}
      </div>
    </div>
  );
}

// Order Detail Modal (simple, you can style further)
function OrderDetailModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded shadow-xl w-full max-w-2xl p-8 relative">
        <button
          className="absolute top-2 right-4 text-xl font-bold text-gray-500 hover:text-red-600"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-2 text-[#146e88]">
          Order #{order._id.slice(-6).toUpperCase()}
        </h2>
        <div className="mb-2 text-gray-700">
          <span className="font-semibold">Customer:</span> {order.user?.name} (
          {order.user?.email}) | <span>Phone:</span> {order.user?.phone}
        </div>
        <div className="mb-2 text-gray-700">
          <span className="font-semibold">Placed:</span>{" "}
          {format(new Date(order.createdAt), "yyyy-MM-dd HH:mm")}
        </div>
        <div>
          <span className="font-semibold">Shipping Address:</span>
          <div className="pl-3">
            {order.address.line1},{" "}
            {order.address.line2 && order.address.line2 + ", "}
            {order.address.city}, {order.address.state}, {order.address.zipcode}
            , {order.address.country}
          </div>
          <div className="pl-3">
            Phone: {order.address.phone}{" "}
            {order.address.altPhone && <>| Alt: {order.address.altPhone}</>}
          </div>
        </div>
        <div className="my-4">
          <span className="font-semibold text-[#1d8599]">Products:</span>
          {order.products.map((item, i) => {
            const imgSrc = (item.product?.image || item.image || "").startsWith(
              "/uploads"
            )
              ? `https://biller-backend-xdxp.onrender.com${
                  item.product?.image || item.image || ""
                }`
              : item.product?.image || item.image || "/placeholder.png";
            const title = item.product?.title || item.title || "Unknown";
            const price = item.product?.price ?? item.price ?? 0;
            return (
              <div
                key={i}
                className="flex items-center gap-2 mt-2 border-b pb-2 last:border-b-0"
              >
                <img
                  src={imgSrc}
                  alt={title}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-grow">
                  <div className="font-semibold">{title}</div>
                  <div className="text-xs text-gray-500">
                    {item.description || item.product?.description}
                  </div>
                  <div className="text-gray-500 text-xs">
                    Qty: {item.quantity} @ ₹{price} ={" "}
                    <span className="font-semibold">
                      ₹{item.quantity * price}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t pt-3 font-bold flex justify-between">
          <span>Total</span>
          <span>₹{order.totalAmount?.toFixed(2) ?? "-"}</span>
        </div>
        <div className="mt-3 text-sm text-gray-700 flex gap-6">
          <div>
            <span className="font-semibold">Payment:</span>{" "}
            {order.payment?.method?.toUpperCase() || "-"} <br />
            <span>
              Amount: ₹
              {order.payment?.amount?.toFixed(2) ??
                order.totalAmount?.toFixed(2) ??
                "-"}
            </span>
          </div>
          <div>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded text-xs capitalize font-bold 
              ${statusColors[order.status] || "bg-gray-50 text-gray-500"}`}
            >
              {order.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrdersPage;

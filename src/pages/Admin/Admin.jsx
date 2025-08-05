/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import {
  FaRupeeSign,
  FaBoxOpen,
  FaUsers,
  FaShoppingCart,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Badge for order status
const OrdersStatusBadge = ({ status }) => {
  let color = "bg-gray-200 text-gray-800";
  if (status === "Delivered") color = "bg-green-100 text-green-700";
  if (status === "Pending") color = "bg-yellow-100 text-yellow-900";
  if (status === "Processing" || status === "In Progress")
    color = "bg-blue-100 text-blue-700";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    y: { beginAtZero: true, grid: { color: "#e7f6fc" } },
    x: { grid: { color: "#e7f6fc" } },
  },
};

const Admin = () => {
  const { user, loading } = useContext(AuthContext);

  // Dashboard summary stats
  const [dashStats, setDashStats] = useState({
    revenue: 0,
    totalOrders: 0,
    customerCount: 0,
    productCount: 0,
  });

  // Recent orders
  const [recentOrders, setRecentOrders] = useState([]);

  // All orders for chart
  const [ordersForChart, setOrdersForChart] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard stats, recent orders, and all orders for the chart
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        // 1. Summary stats
        const dashRes = await axios.get(
          "https://biller-backend-xdxp.onrender.com/api/admin/dashboard-stats",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDashStats(dashRes.data);

        // 2. Recent orders (limit 5)
        const recentOrdersRes = await axios.get(
          "https://biller-backend-xdxp.onrender.com/api/orders?limit=5",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecentOrders(
          (recentOrdersRes.data || []).map((o) => ({
            id: "#" + (o._id?.slice(-6) || o._id),
            customer: o.user?.name || "Unknown",
            product: o.products?.[0]?.title
              ? o.products[0].title +
                (o.products.length > 1 ? ` +${o.products.length - 1}` : "")
              : "-",
            amount: "₹" + (o.totalAmount || o.total || 0),
            status:
              o.status === "delivered"
                ? "Delivered"
                : o.status === "processing"
                ? "Processing"
                : o.status === "pending"
                ? "Pending"
                : o.status === "out for delivery"
                ? "In Progress"
                : o.status || "Pending",
            date: o.createdAt?.slice(0, 10) || "",
          }))
        );

        // 3. All orders (for sales chart)
        const allOrdersRes = await axios.get(
          "https://biller-backend-xdxp.onrender.com/api/orders",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrdersForChart(allOrdersRes.data || []);
      } catch (e) {
        setDashStats({
          revenue: 0,
          totalOrders: 0,
          customerCount: 0,
          productCount: 0,
        });
        setRecentOrders([]);
        setOrdersForChart([]);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // Format the stats array for widgets
  const stats = [
    {
      name: "Revenue",
      icon: <FaRupeeSign />,
      value: "₹" + dashStats.revenue?.toLocaleString(),
      color: "bg-[#e6fbfd] text-[#1d8599]",
    },
    {
      name: "Orders",
      icon: <FaShoppingCart />,
      value: dashStats.totalOrders?.toLocaleString(),
      color: "bg-[#f5eaff] text-[#a946f0]",
    },
    {
      name: "Customers",
      icon: <FaUsers />,
      value: dashStats.customerCount?.toLocaleString(),
      color: "bg-[#fbfbe6] text-[#bcc600]",
    },
    {
      name: "Products",
      icon: <FaBoxOpen />,
      value: dashStats.productCount?.toLocaleString(),
      color: "bg-[#ffecec] text-[#e34f4f]",
    },
  ];

  // Compute chart data from orders
  React.useEffect(() => {
    // Show sales per week or per day this month; for simplicity, last 7 days
    const daysAgo = 6;
    const salesPerDay = {};
    const now = new Date();
    for (let i = daysAgo; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      salesPerDay[key] = 0;
    }
    // Sum order totals per day
    ordersForChart.forEach((order) => {
      const d = order.createdAt?.slice(0, 10);
      if (d && d in salesPerDay) {
        salesPerDay[d] += order.totalAmount || 0;
      }
    });
    // Prepare labels/datasets for chartjs
    const labels = Object.keys(salesPerDay);
    const dataArr = Object.values(salesPerDay);

    setChartData({
      labels: labels.map((d) =>
        new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        })
      ),
      datasets: [
        {
          label: "Sales (₹)",
          data: dataArr,
          borderColor: "#1d8599",
          backgroundColor: "rgba(29, 133, 153, 0.15)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: "#1d8599",
        },
      ],
    });
  }, [ordersForChart]);

  if (loading || isLoading) return <div>Loading...</div>;
  if (!user || !user.isAdmin) return <Navigate to="/" replace />;

  return user ? (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-[#fbfeff] overflow-x-auto">
        <h1 className="text-3xl font-bold text-[#1d8599] mb-5">Dashboard</h1>
        {/* Top Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className={`flex items-center gap-4 p-5 rounded-xl shadow-md ${stat.color} border-l-4 border-[#ecf8ff]`}
            >
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-xs font-semibold text-gray-700">
                  {stat.name}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Charts + Recent Orders */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Sales Chart */}
          <div className="flex-1 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-[#1d8599] mb-3">
              Sales Last 7 Days
            </h2>
            <Line data={chartData} options={chartOptions} height={210} />
          </div>
          {/* Recent Orders */}
          <div className="flex-1 max-w-[800px] bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-[#1d8599] mb-4">
              Recent Orders
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-[#1d8599] text-left">
                    <th className="py-2 px-3">Order ID</th>
                    <th className="py-2 px-3">Customer</th>
                    <th className="py-2 px-3">Amount</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-b last:border-none text-gray-700 hover:bg-[#f0faff]"
                    >
                      <td className="py-2 px-3 font-mono">{o.id}</td>
                      <td className="py-2 px-3">{o.customer}</td>
                      <td className="py-2 px-3">{o.amount}</td>
                      <td className="py-2 px-3">
                        <OrdersStatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* You can add more sections: Top Selling, Recent Customers, etc. */}
      </main>
    </div>
  ) : (
    loading
  );
};

export default Admin;

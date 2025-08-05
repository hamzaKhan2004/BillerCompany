import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "../pages/Home/Home";
import Shop from "../pages/Shop";
import Blog from "../pages/Blog";
import UserSetting from "../pages/UserSettings";
import Profile from "../pages/Profile";
import Admin from "../pages/Admin/Admin";
import AddProduct from "../pages/AddProduct";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import About from "../pages/About/About";
import ContactUs from "../pages/ContactUs";
import Spinner from "../components/Spinner"; // ⬅️ Add this at the top
import AdminAllProducts from "../pages/Admin/AdminAllProducts";
import ProductDetailPage from "../pages/ProductDetailPage";
import AdminCustomers from "../pages/Admin/AdminCutomers";
import AdminCustomerDetail from "../pages/Admin/AdminCustomerDetail";
import AddToCart from "../pages/AddToCart";
import AddBlog from "../pages/Admin/AddBlog";
import BlogDetail from "../pages/BlogDetail";
import AdminAllBlogs from "../pages/Admin/AdminAllBlogs";
import AdminProfile from "../pages/Admin/AdminProfile";
import Checkout from "../pages/Checkout";
import PaymentPage from "../pages/PaymentPage";
import OrdersPage from "../pages/OrderPage";
import AdminOrdersPage from "../pages/Admin/AdminOrdersPage";
import ReturnPolicy from "../pages/ReturnPolicy";
import RefundPolicy from "../pages/RefundPolicy";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Disclaimer from "../pages/Disclaimer";

// ✅ Protect routes for logged-in users
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" />;
};

// ✅ Protect routes for admin only
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <Spinner />;
  return user?.isAdmin ? children : <Navigate to="/" />;
};

const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/usersetting" element={<UserSetting />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/admin-product"
          element={
            <AdminRoute>
              <AdminAllProducts />
            </AdminRoute>
          }
        />
        <Route path="/admin/customers/:id" element={<AdminCustomerDetail />} />
        <Route
          path="/admin/customers"
          element={
            <AdminRoute>
              <AdminCustomers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-blog"
          element={
            <AdminRoute>
              <AddBlog />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/admin-blogs"
          element={
            <AdminRoute>
              <AdminAllBlogs />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrdersPage />
            </AdminRoute>
          }
        />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/blog/id/:id" element={<BlogDetail />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/product/id/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<AddToCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/orders" element={<OrdersPage />} />

        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
      </Routes>
    </Router>
  );
};

export default Routing;

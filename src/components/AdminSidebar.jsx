/* eslint-disable no-unused-vars */
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaClipboardList,
  FaPlusCircle,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaBookOpen,
  FaArrowLeft,
} from "react-icons/fa";
import { IoMdHome, IoMdClose } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const navLinks = [
  {
    name: "Dashboard",
    icon: <FaTachometerAlt />,
    to: "/admin",
    key: "dashboard",
  },
  {
    name: "Products",
    icon: <FaBoxOpen />,
    to: "/admin/admin-product",
    key: "products",
  },
  {
    name: "Blogs",
    icon: <FaBookOpen />,
    to: "/admin/admin-blogs",
    key: "blogs",
  },
  {
    name: "Customers",
    icon: <FaUsers />,
    to: "/admin/customers",
    key: "customers",
  },
  {
    name: "Orders",
    icon: <FaClipboardList />,
    to: "/admin/orders",
    key: "orders",
  },
];

const bottomLinks = [
  {
    name: "Settings",
    icon: <FaCog />,
    to: "/admin/settings",
    key: "settings",
  },
  {
    name: "Home",
    icon: <IoMdHome />,
    to: "/",
    key: "home",
  },
];

const AdminSidebarContent = ({
  profile,
  user,
  isLinkActive,
  navigate,
  logout,
}) => {
  const imgSrc =
    profile && profile.avatar?.startsWith("/uploads")
      ? `https://biller-backend-xdxp.onrender.com${profile.avatar}`
      : (profile && profile.avatar) || null;

  return (
    <div className="bg-white h-screen w-[260px] py-6 px-4 flex flex-col border-r shadow-lg sticky md:top-0">
      {/* Admin Profile */}
      <div className="flex items-center gap-3 mb-8">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={profile.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-yellow-500"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold uppercase border-2 border-[#1d8599]">
            {profile.name?.charAt(0) || "A"}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-[#001442]">
            {profile.name}
          </span>
          <span className="text-xs text-gray-500">{profile.email}</span>
          <span className="text-xs bg-yellow-500 text-white w-20 text-center my-1 py-0.5 rounded">
            Admin
          </span>
        </div>
      </div>
      <hr className="mb-6" />

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {navLinks.map((nav) => (
          <button
            key={nav.key}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium
              ${
                isLinkActive(nav.to)
                  ? "bg-[#e6fbfd] text-[#1d8599] font-bold shadow-md border-r-4 border-[#1d8599]"
                  : "text-gray-700 hover:text-[#1d8499] hover:bg-[#f5fafd] "
              }
              transition-all`}
            onClick={() => navigate(nav.to)}
          >
            <span className="text-xl">{nav.icon}</span>
            {nav.name}
          </button>
        ))}
      </nav>

      {/* Bottom Links */}
      <div className="mt-10">
        {bottomLinks.map((buttonNav) => (
          <button
            key={buttonNav.key}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-[#f5fafd] w-full transition-all`}
            onClick={() => navigate(buttonNav.to)}
          >
            <span className="text-xl">{buttonNav.icon}</span>
            {buttonNav.name}
          </button>
        ))}
        <button
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 w-full transition-all mt-2"
          onClick={logout}
        >
          <span className="text-xl">
            <FaSignOutAlt />
          </span>
          Logout
        </button>
      </div>
    </div>
  );
};

// MAIN COMPONENT
const AdminSidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false); // <-- NEW FOR MOBILE
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarClosing, setSidebarClosing] = useState(false);

  // Open sidebar (reset closing state)
  const openSidebar = () => {
    setSidebarOpen(true);
    setSidebarClosing(false);
  };

  // Close sidebar: trigger animation, then set open false after it finishes
  const closeSidebar = () => {
    setSidebarClosing(true);
    setTimeout(() => {
      setSidebarOpen(false);
      setSidebarClosing(false);
    }, 250); // same as your animation duration
  };

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://biller-backend-xdxp.onrender.com/api/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(res.data);
      } catch (e) {
        console.error("Failed to fetch admin profile", e);
      }
    }

    fetchProfile();
  }, [user]);

  if (!profile || !user?.isAdmin)
    return (
      <div className="h-full flex items-center justify-center text-red-600 font-bold">
        Admin access required.
      </div>
    );

  const isLinkActive = (to) => location.pathname === to;

  // --- DESKTOP/LARGE SCREEN: Original sidebar, always show
  // Show for md and above (unchanged)
  return (
    <>
      <div className="hidden md:block">
        <AdminSidebarContent
          profile={profile}
          user={user}
          isLinkActive={isLinkActive}
          navigate={navigate}
          logout={logout}
        />
      </div>

      {/* --- MOBILE/SMALL SCREEN: Sidebar drawer --- */}
      {/* Burger/arrow button, fixed bottom left */}
      <button
        className="fixed left-5 bottom-7 z-[100] bg-[#1d8599] text-white p-3 rounded-full shadow-lg md:hidden flex items-center justify-center text-2xl transition-all"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open admin sidebar"
        style={{ boxShadow: "0 2px 8px 1px #1d849944" }}
      >
        <GiHamburgerMenu />
      </button>

      {/* Overlay and sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[120] flex">
          {/* Overlay, click to close */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>
          {/* Sidebar drawer */}
          <div
            className={`relative z-10 ${
              sidebarClosing ? "animate-slideOutLeft" : "animate-slideInLeft"
            }`}
          >
            <div className="w-[260px] h-screen bg-white shadow-xl border-r flex flex-col">
              {/* Close button at the top of sidebar */}
              <button
                className="absolute bottom-7 right-[-50px] bg-[#1d8599] text-white p-3 rounded-full shadow-md flex items-center justify-center text-xl"
                onClick={closeSidebar}
                aria-label="Close admin sidebar"
              >
                <IoMdClose />
              </button>
              <AdminSidebarContent
                profile={profile}
                user={user}
                isLinkActive={isLinkActive}
                navigate={(to) => {
                  setSidebarOpen(false);
                  navigate(to);
                }}
                logout={() => {
                  setSidebarOpen(false);
                  logout();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;

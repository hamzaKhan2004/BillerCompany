import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import {
  MdAdd,
  MdChecklistRtl,
  MdAdminPanelSettings,
  MdListAlt,
} from "react-icons/md";
import { LuBookPlus } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { useCart } from "../context/CartContext";

// Import your login/signup modal components!
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartProductCount } = useCart();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const toggleMobileMenu = () => setMobileMenuOpen((v) => !v);
  const toggleProfileMenu = () => setProfileMenuOpen((v) => !v);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#ffffffcd] backdrop-blur-2xl shadow-md z-[100]">
      <div className="flex justify-between items-center px-4 py-3 md:px-14 h-14">
        {/* Left: Company Name and desktop links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="font-bold text-xl text-[#1d8599]">
            Biller
          </Link>
          {/* Desktop Nav Menu */}
          <div className="hidden md:flex items-center space-x-6 text-[#1d8599]">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/contact">Contact</Link>
            {user?.isAdmin && <Link to="/admin">Admin</Link>}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Desktop Cart */}
          <Link
            to="/cart"
            className="hidden md:flex relative items-center justify-center w-8 h-8 rounded-full bg-[#1d8599] text-white text-xl"
            aria-label="Cart"
          >
            <FaShoppingCart />
            {cartProductCount > 0 && (
              <span className="absolute top-[-8px] right-[-8px] flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold leading-none text-white shadow-lg">
                {cartProductCount > 9 ? "9+" : cartProductCount}
              </span>
            )}
          </Link>

          {/* Desktop Profile */}
          <div className="hidden md:block relative">
            <button
              onClick={toggleProfileMenu}
              className={`flex items-center justify-center w-8 h-8 rounded-full bg-[#1d8599] text-white text-xl focus:outline-none ${
                user?.isAdmin ? "border-3 border-yellow-400" : ""
              }`}
              style={{ minWidth: "2.3rem", minHeight: "2.3rem" }}
              aria-label="Profile menu"
            >

              {user && user.avatar ? (
                <img
                  src={user.avatar}
                  alt="profile"
                  className="w-9 h-9 object-cover rounded-full"
                />
              ) : (
                <FaUser />
              )}
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div
                className="absolute right-0 mt-2 min-w-[180px] rounded shadow-md bg-white text-black z-50"
                onMouseLeave={() => setProfileMenuOpen(false)}
              >
                {!user ? (
                  // Not logged in: show Login/Signup
                  <div>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-[#f0fbff] font-medium"
                      onClick={() => {
                        setShowLoginModal(true);
                        setProfileMenuOpen(false);
                      }}
                    >
                      Login
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-[#f0fbff] font-medium"
                      onClick={() => {
                        setShowSignupModal(true);
                        setProfileMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Profile summary */}
                    <div className="flex items-center gap-2 px-4 py-2 border-b">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center bg-[#1d8599] text-white text-xl ${
                          user.isAdmin ? "border-2 border-yellow-400" : ""
                        }`}
                      >
                        {user && user.avatar ? (
                          <img
                            src={user.avatar}
                            alt="profile"
                            className="w-9 h-9 object-cover rounded-full"
                          />
                        ) : (
                          <FaUser />
                        )}
                      </span>
                      <span className="text-[#1d8599] font-semibold">
                        {user.name}
                      </span>
                    </div>
                    {/* User links */}
                    {user.isAdmin ? (
                      <>
                        <button
                          className="flex items-center gap-2 text-[#001442] w-full px-4 py-2 hover:bg-[#f0fbff] font-medium"
                          onClick={() => goTo("/admin")}
                        >
                          <MdAdminPanelSettings className="text-[#1d8599]" />
                          Admin Panel
                        </button>
                        <button
                          className="flex items-center gap-2 text-[#001442] w-full px-4 py-2 hover:bg-[#f0fbff] font-medium"
                          onClick={() => goTo("/admin/orders")}
                        >
                          <MdListAlt className="text-[#1d8599]" />
                          Check Orders
                        </button>
                        <button
                          className="flex items-center gap-2 text-[#001442] w-full px-4 py-2 hover:bg-[#f0fbff] font-medium"
                          onClick={() => goTo("/admin/add-product")}
                        >
                          <MdAdd className="text-[#1d8599]" />
                          Add Product
                        </button>
                        <button
                          className="flex items-center gap-2 text-[#001442] w-full px-4 py-2 hover:bg-[#f0fbff] font-medium"
                          onClick={() => goTo("/admin/add-blog")}
                        >
                          <LuBookPlus className="text-[#1d8599]" />
                          Add Blog
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="flex items-center gap-2 text-[#001442] w-full px-4 py-2 hover:bg-[#f0fbff] font-medium"
                          onClick={() => {
                            goTo("/orders");
                            setMobileMenuOpen(false);
                          }}
                        >
                          <MdChecklistRtl className="text-[#1d8599]" />
                          My Orders
                        </button>
                        <button
                          className="flex items-center gap-2 text-[#001442] w-full px-4 py-2 hover:bg-[#f0fbff] font-medium"
                          onClick={() => goTo("/usersetting")}
                        >
                          <IoMdSettings className="text-[#1d8599]" />
                          Settings
                        </button>
                      </>
                    )}

                    <button
                      className="flex items-center gap-2 text-red-500 justify-center w-full px-4 py-2 hover:bg-[#f0fbff] font-medium"
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <button
            className="md:hidden flex items-center justify-center text-2xl text-[#1d8599]"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile menu - shown on small screens when hamburger is clicked */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg px-4 pb-4">
          <nav className="flex flex-col space-y-2 py-2 text-[#1d8599]">
            <Link
              to="/"
              className="block px-2 py-1 hover:bg-[#f0fbff] rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-2 py-1 hover:bg-[#f0fbff] rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/blog"
              className="block px-2 py-1 hover:bg-[#f0fbff] rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/shop"
              className="block px-2 py-1 hover:bg-[#f0fbff] rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/contact"
              className="block px-2 py-1 hover:bg-[#f0fbff] rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="block px-2 py-1 hover:bg-[#f0fbff] rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}

            {/* Profile section */}
            {user ? (
              <div>
                <button
                  onClick={toggleProfileMenu}
                  className="w-full text-left px-2 py-1 hover:bg-[#f0fbff] rounded flex items-center gap-2"
                >
                  {user && user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="profile"
                      className="w-9 h-9 object-cover rounded-full"
                    />
                  ) : (
                    <FaUser />
                  )}

                  <span className="ml-auto">
                    {isProfileMenuOpen ? "▲" : "▼"}
                  </span>
                </button>

                {isProfileMenuOpen && (
                  <div className="pl-6 pt-1 flex flex-col space-y-1">
                    {user.isAdmin ? (
                      <>
                        <button
                          className="text-left px-2 py-1 hover:bg-[#f0fbff] rounded"
                          onClick={() => {
                            goTo("/cart");
                            setMobileMenuOpen(false);
                          }}
                        >
                          My Cart
                        </button>
                        <button
                          className="text-left px-2 py-1 hover:bg-[#f0fbff] rounded"
                          onClick={() => {
                            goTo("/admin/orders");
                            setMobileMenuOpen(false);
                          }}
                        >
                          Check Orders
                        </button>
                        <button
                          className="text-left px-2 py-1 hover:bg-[#f0fbff] rounded"
                          onClick={() => {
                            goTo("/admin/add-product");
                            setMobileMenuOpen(false);
                          }}
                        >
                          Add Product
                        </button>
                        <button
                          className="text-left px-2 py-1 hover:bg-[#f0fbff] rounded"
                          onClick={() => {
                            goTo("/admin/add-blog");
                            setMobileMenuOpen(false);
                          }}
                        >
                          Add Blog
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="text-left px-2 py-1 hover:bg-[#f0fbff] rounded"
                          onClick={() => {
                            goTo("/cart");
                            setMobileMenuOpen(false);
                          }}
                        >
                          My Cart
                        </button>
                        <button
                          className="text-left px-2 py-1 hover:bg-[#f0fbff] rounded"
                          onClick={() => {
                            goTo("/orders");
                            setMobileMenuOpen(false);
                          }}
                        >
                          My Orders
                        </button>
                        <button
                          className="text-left px-2 py-1 hover:bg-[#f0fbff] rounded"
                          onClick={() => {
                            goTo("/usersetting");
                            setMobileMenuOpen(false);
                          }}
                        >
                          Settings
                        </button>
                      </>
                    )}

                    <button
                      className="text-left px-2 py-1 text-red-500 hover:bg-[#f0fbff] rounded font-medium"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col space-y-1">
                {/* Show login/signup on mobile menu if not logged in */}
                <button
                  className="block px-2 py-1 hover:bg-[#f0fbff] rounded text-left"
                  onClick={() => {
                    setShowLoginModal(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </button>
                <button
                  className="block px-2 py-1 hover:bg-[#f0fbff] rounded text-left"
                  onClick={() => {
                    setShowSignupModal(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </button>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* The login/sign up modals (show regardless of device) */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      {showSignupModal && (
        <SignupModal onClose={() => setShowSignupModal(false)} />
      )}
    </nav>
  );
};

export default Navbar;

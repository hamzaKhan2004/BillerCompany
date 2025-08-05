/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const cartRef = useRef(cart);

  // --------
  // Fetch Cart on mount or when user changes
  // --------
  useEffect(() => {
    if (!user) return setCart({ items: [] });
    fetchCart();
    // eslint-disable-next-line
  }, [user]);

  const fetchCart = async () => {
    if (!user) return setCart({ items: [] });
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://biller-backend-xdxp.onrender.com/api/cart",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCart(res.data);
    } catch (e) {
      setCart({ items: [] });
    }
    setLoading(false);
  };

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]); // <-- Make sure to update this dependency!

  // --------
  // Add to Cart (quantity 1, prevent duplicates)
  // --------
  const addToCart = async (product) => {
    if (!user) {
      toast.info("Please login to add items to your cart.");
      return false;
    }
    if (
      cartRef.current.filteredItems.some(
        (item) => item.product._id === product._id
      )
    ) {
      toast.info("Product is already in the cart.");
      return false;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://biller-backend-xdxp.onrender.com/api/cart/add",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data);
      toast.success(`Added "${product.title}" to cart!`);
      return true;
    } catch (error) {
      if (error.response?.data?.message === "Product already in cart") {
        toast.info("Product is already in the cart.");
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to add product to cart."
        );
      }
      return false;
    }
  };

  // --------
  // Update product quantity (minimum 2)
  // --------
  const updateQuantity = async (productId, newQty) => {
    if (newQty < 2) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://biller-backend-xdxp.onrender.com/api/cart/add",
        { productId, quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data);
    } catch (e) {
      toast.error("Failed to update quantity");
    }
  };

  // --------
  // Remove from cart
  // --------
  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `https://biller-backend-xdxp.onrender.com/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data);
      toast.success("Removed product from cart.");
    } catch (e) {
      toast.error("Failed to remove product from cart.");
    }
  };

  // Filter out items with missing (deleted) product references
  const filteredItems = cart.items.filter(
    (item) => item.product && item.product.title
  );

  // Cart statistics use filtered items
  const cartProductCount = filteredItems.length; // Unique products count
  const cartQuantityTotal = filteredItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  ); // Total quantity

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        cartProductCount,
        cartQuantityTotal,
        filteredItems, // NEW: always use this for display!
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

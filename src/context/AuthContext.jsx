/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // NEW

  // login returns true/false for success/failure
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "https://biller-backend-xdxp.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      toast.success("Logged in successfully!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.info("Logged out!");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const storedUser = JSON.parse(atob(token.split(".")[1]));
        setUser({
          name: storedUser.name,
          email: storedUser.email,
          isAdmin: storedUser.isAdmin,
          phone: storedUser.phone,
          avatar: storedUser.avatar, // include if your token does
        });
      } catch (e) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

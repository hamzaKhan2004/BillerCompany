import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const SignupModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://biller-backend-xdxp.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
        }
      );
      setSuccess(true);
      toast.success("Registration successful!");
      setTimeout(onClose, 1200);
    } catch (e) {
      setErr(e?.response?.data?.message || "Signup failed");
      toast.error(e?.response?.data?.message || "Signup failed");
    }
  };

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0  flex items-center h-screen w-full justify-center bg-black/50 backdrop-blur-sm z-[9999]"
      onClick={onClose} // close modal on outside click
    >
      <div
        className="bg-white p-6 rounded shadow-md w-80 relative"
        onClick={stopPropagation} // prevent modal content click from closing
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-xl cursor-pointer"
          aria-label="Close Signup Modal"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-dark">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            className="mb-2 w-full px-3 py-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="mb-2 w-full px-3 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-4 w-full px-3 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {err && <div className="text-red-500 text-xs mb-1">{err}</div>}
          {success && (
            <div className="text-green-600 text-xs mb-1">
              Registration successful!
            </div>
          )}
          <button className="bg-[#1D8599] text-white w-full py-2 rounded cursor-pointer">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const LoginModal = ({ onClose }) => {
  const { login } = useContext(AuthContext);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(emailOrUsername, password);
    if (ok) {
      onClose();
    } else {
      setErr("Invalid username or password");
    }
  };

  // Prevents modal content clicks from closing the modal
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center h-screen w-full bg-black/50 backdrop-blur-xl z-[9999]"
      onClick={onClose} // Click on overlay closes modal
    >
      <div
        className="bg-white p-6 rounded shadow-md w-80 relative"
        onClick={stopPropagation} // Prevent closing when clicking inside modal content
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-xl cursor-pointer"
          aria-label="Close Login Modal"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-dark">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email or Username"
            className="mb-2 w-full px-3 py-2 border rounded"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
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
          <button className="bg-[#1D8599] text-white w-full py-2 rounded cursor-pointer">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;

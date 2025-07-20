import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { verify2FA } from "../api/authServices";
import invImage from "../assets/inventory.jpg";
const Verify2FAPage = () => {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const tempToken =
    location.state?.tempToken || localStorage.getItem("tempToken");

  const handleVerify = async () => {
    if (!tempToken) {
      setError("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const res = await verify2FA(token, tempToken);
      login(res.token); // Save final JWT
      localStorage.removeItem("tempToken");
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid code");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 dark:bg-gray-700 bg-[#f4f0ec]">
      {/* Left Side: Form */}
      <div className="flex items-center justify-center p-8 bg-white shadow">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-xl font-bold mb-4">Two-Factor Verification</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <input
            type="text"
            placeholder="Enter 6-digit code"
            className="w-full p-2 border rounded mb-4"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button
            className="w-full bg-[#c16e02] text-white py-2 rounded-md hover:bg-[#a5793f] transition"
            onClick={handleVerify}
          >
            Verify
          </button>
        </div>
      </div>
      <div className="hidden md:block relative">
        <img
          src={invImage}
          alt="Warehouse"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center px-12 text-white">
          <h2 className="text-3xl font-bold mb-2">
            A simple approach to managing inventory
          </h2>
          <p className="text-sm">
            The simplest inventory software for business and teams to stay on
            top of their stuff.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify2FAPage;

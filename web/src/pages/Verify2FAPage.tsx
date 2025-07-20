import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { verify2FA } from "../api/authServices";

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
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
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
        className="w-full bg-blue-600 text-white py-2 rounded"
        onClick={handleVerify}
      >
        Verify
      </button>
    </div>
  );
};

export default Verify2FAPage;

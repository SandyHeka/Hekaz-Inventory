import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import invImage from "../assets/inventory.jpg";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data.token);
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#f4f0ec]">
      {/* Left Side: Form */}
      <div className="flex items-center justify-center p-8 bg-white shadow">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Sign-In</h2>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="pasword"
              placeholder="Password"
              className="w-full border border-gray-300 p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-sm text-center text-gray-600">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 underline">
                Sign up
              </Link>
            </p>

            <button className="w-full bg-[#c16e02] text-white py-2 rounded-md hover:bg-[#a5793f] transition">
              Login
            </button>
          </form>
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

export default LoginPage;

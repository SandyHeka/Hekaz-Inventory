import { useEffect, useState } from "react";
import { setup2FA, verify2FA } from "../api/authServices";
import ToastMessage from "../components/ToastMessage";
import DashboardPage from "./DasboardPage";

const TwoFactorSetupPage = () => {
  const [qrCode, setQrCode] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const generateQR = async () => {
      try {
        const res = await setup2FA();
        setQrCode(res.qrcode);
      } catch (err: any) {
        setError("Failed to generate QR code");
      }
    };
    generateQR();
  }, []);

  const handleVerify = async () => {
    try {
      const res = await verify2FA(token);
      setMessage(res.message);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid Token");
    }
  };

  return (
    <DashboardPage>
      <div className="max-w-md mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">
          {" "}
          Enable Two-Factor Authentication
        </h2>

        {message && <ToastMessage message={message} type="success" />}
        {error && <ToastMessage message={error} type="error" />}

        {qrCode && (
          <div className="mb-4">
            <p className="mb-2">Scan this QR code with Google Authenticator:</p>
            <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
          </div>
        )}
        <input
          type="text"
          placeholder="Enter your 2FA code"
          className="w-full p-2 border rounded mb-2"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button
          onClick={handleVerify}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Verify Token
        </button>
      </div>
    </DashboardPage>
  );
};

export default TwoFactorSetupPage;

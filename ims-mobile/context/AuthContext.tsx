import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      console.log("🔄 Loading token...");
      const savedToken = await AsyncStorage.getItem("token");
      console.log("📦 Saved token:", savedToken);

      if (savedToken) {
        setToken(savedToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;

        try {
          const res = await axios.get("/auth/me");
          console.log("✅ Fetched user:", res.data);
          setUser(res.data);
        } catch (err) {
          console.error("❌ Failed to fetch user:", err);
        }
      }

      setLoading(false);
      console.log("✅ Loading complete");
    };

    loadToken();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      const receivedToken = res.data.token;
      await AsyncStorage.setItem("token", receivedToken);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${receivedToken}`;
      setToken(receivedToken);

      const me = await axios.get("/auth/me");
      setUser(me.data);
    } catch (err) {
      console.error("❌ Login failed:", err);
      throw err; // You can re-throw so your UI can catch and display message
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

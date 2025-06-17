import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
        const res = await axios.get("/auth/me");
        setUser(res.data);
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("/auth/login", { email, password });
    const receivedToken = res.data.token;
    await AsyncStorage.setItem("token", receivedToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${receivedToken}`;
    setToken(receivedToken);
    const me = await axios.get("/auth/me");
    setUser(me.data);
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

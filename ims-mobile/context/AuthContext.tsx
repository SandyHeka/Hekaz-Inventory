import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Set your API URL:
axios.defaults.baseURL = "https://your-api-url.com/api"; // change this

const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  token: null,
  login: async (email: string, password: string) => {},
  logout: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        if (savedToken) {
          setToken(savedToken);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${savedToken}`;

          // Try to fetch user
          const res = await axios.get("/auth/me");
          setUser(res.data);
        }
      } catch (err) {
        console.log("Token invalid or expired");
        await AsyncStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
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

  const isLoggedIn = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

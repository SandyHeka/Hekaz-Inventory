import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

type AuthContextType = {
  token: string | null;
  user: any;
  login: (token: string) => void;
  logout: () => void;
};
const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      setToken(stored);
      fetchUser(stored);
    }
  }, []);

  const fetchUser = async (jwtToken: string) => {
    try {
      const res = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      setUser(res.data);
    } catch (err) {
      logout();
    }
  };
  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    fetchUser(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

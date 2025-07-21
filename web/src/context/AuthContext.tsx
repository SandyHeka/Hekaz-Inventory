import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  exp: number;
  [key: string]: any;
};
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
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored && !isTokenExpired(stored)) {
      setToken(stored);
      fetchUser(stored);
    } else {
      logout();
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
    if (isTokenExpired(newToken)) {
      logout();
      return;
    }
    setToken(newToken);
    localStorage.setItem("token", newToken);
    fetchUser(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

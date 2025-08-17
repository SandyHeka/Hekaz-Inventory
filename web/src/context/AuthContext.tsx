import { createContext, useContext, useEffect, useRef, useState } from "react";
import API from "../api/axios";
import { jwtDecode } from "jwt-decode";
type Role = "admin" | "manager" | "staff" | "viewer";
type User = {
  _id: string;
  email: string;
  name?: string;
  role: Role;
};

type DecodedToken = {
  exp: number;
  [key: string]: any;
};
type AuthContextType = {
  token: string | null;
  user: User | null;
  loading: boolean; // while determining auth state
  ready: boolean;
  login: (token: string) => void;
  logout: () => void;
};
const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  loading: false,
  ready: false,
  login: () => {},
  logout: () => {},
});
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const logoutTimer = useRef<number | null>(null);
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  };
  const scheduleAutoLogout = (tok: string) => {
    try {
      const { exp }: DecodedToken = jwtDecode(tok);
      const msUntilExpiry = Math.max(0, exp * 1000 - Date.now());
      if (logoutTimer.current) window.clearTimeout(logoutTimer.current);
      // logout ~5s after expiry to avoid race
      logoutTimer.current = window.setTimeout(
        () => logout(),
        msUntilExpiry + 5000
      );
    } catch {
      // if decode fails, don’t schedule
    }
  };
  const applyAuthHeader = (tok: string | null) => {
    if (tok) {
      API.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
  };
  // Global 401 handler (optional)
  useEffect(() => {
    const id = API.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => API.interceptors.response.eject(id);
  }, []);

  const fetchUser = async (jwtToken: string) => {
    setLoading(true);
    try {
      applyAuthHeader(jwtToken);
      const res = await API.get<User>("/auth/me");
      setUser(res.data);
    } catch {
      // invalid token or server error → clean state
      logout();
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored && !isTokenExpired(stored)) {
      setToken(stored);
      scheduleAutoLogout(stored);
      fetchUser(stored).finally(() => setReady(true));
    } else {
      logout();
      setReady(true);
    }
    return () => {
      if (logoutTimer.current) window.clearTimeout(logoutTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const login = (newToken: string) => {
    if (isTokenExpired(newToken)) {
      logout();
      return;
    }
    localStorage.setItem("token", newToken);
    setToken(newToken);
    scheduleAutoLogout(newToken);
    fetchUser(newToken);
  };

  const logout = () => {
    if (logoutTimer.current) window.clearTimeout(logoutTimer.current);
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    applyAuthHeader(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, loading, ready, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

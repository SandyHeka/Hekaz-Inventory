import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  return token ? <Navigate to="/" replace /> : <>{children}</>;
};

export default PublicRoute;

import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }
  return children;
};

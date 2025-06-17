import LoginScreen from "@/screens/LoginScreen";
import { useAuth } from "../context/AuthContext";

import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Login() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.replace("/home");
    }
  }, [token]);

  return <LoginScreen />;
}

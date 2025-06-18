import { Slot, Redirect } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";

function RootLayoutNav() {
  const { isLoggedIn } = useAuth();

  // Auto-redirect based on login state
  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  } else {
    return <Redirect href="/(tabs)/home" />;
  }
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
      <RootLayoutNav />
    </AuthProvider>
  );
}

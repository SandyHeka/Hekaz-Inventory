import { Stack, Tabs } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { View, ActivityIndicator } from "react-native";

function RootLayoutInner() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#e37508" />
      </View>
    );
  }

  if (!token) {
    // No token — show auth stack
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
      </Stack>
    );
  } else {
    return (
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: "#e37508",
        }}
      >
        <Tabs.Screen name="home" options={{ title: "Dashboard" }} />
        <Tabs.Screen name="products" options={{ title: "Products" }} />
        <Tabs.Screen name="orders" options={{ title: "Orders" }} />
        <Tabs.Screen name="more" options={{ title: "More" }} />
      </Tabs>
    );
  }

  // Has token — show Tabs
  return <Tabs screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}

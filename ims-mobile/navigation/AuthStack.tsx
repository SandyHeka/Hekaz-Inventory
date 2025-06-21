// navigation/AuthStack.tsx
import { useAuth } from "../context/AuthContext";
import { Stack } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function AuthStack() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#e37508" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="(tabs)/index" />
        </>
      ) : (
        <>
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/register" />
        </>
      )}
    </Stack>
  );
}

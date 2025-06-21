import { Button, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";

import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function TabOneScreen() {
  const { token, loading, logout } = useAuth();
  if (loading) return null;

  if (!token) {
    // No token → redirect to login
    return <Redirect href="/(auth)/login" />;
  }
  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

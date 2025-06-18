import { useRouter } from "expo-router";
import { View, Text, Button, StyleSheet } from "react-native";

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Register Screen</Text>
      <Button title="Back to Login" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email && password) {
      login(email, password);
      router.replace("/(tabs)/home");
    } else {
      setError("Please enter email and password");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Image
          source={require("../../assets/images/hekaz.png")}
          style={styles.logo}
        />
        <Text style={styles.subtitle}>
          A simple approach to managing inventory
        </Text>
        <Text style={styles.subtileSign}>Sign-In</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          mode="contained"
          onPress={handleLogin}
          contentStyle={{
            paddingVertical: 5,
            backgroundColor: "#f57c00",
            borderRadius: 4,
          }}
          labelStyle={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Login
        </Button>

        <Text
          onPress={() => router.push("/(auth)/register")}
          style={styles.link}
        >
          No account? Register
        </Text>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    marginTop: -20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: -55,
  },
  input: {
    borderWidth: 1,
    borderColor: "#171515",
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    width: "100%",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },

  link: {
    color: "blue",
    marginTop: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#858383",
    textAlign: "center",
    marginBottom: 80,
  },
  subtileSign: {
    fontSize: 22,
    color: "#0a0909",
    textAlign: "center",
    fontWeight: "800",
    marginBottom: 20,
  },
});

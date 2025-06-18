import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        source={require("../assets/images/hekaz.png")}
        style={styles.logo}
      />

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

      <Button title="Login" onPress={handleLogin} />

      <Text onPress={() => navigation.navigate("Register")} style={styles.link}>
        No account? Register
      </Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 30, // add space after logo
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    width: "100%", // THIS IS IMPORTANT!
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
});

export default LoginScreen;

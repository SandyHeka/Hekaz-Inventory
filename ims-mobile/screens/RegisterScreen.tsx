import { View } from "@/components/Themed";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const RegisterScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const handleRegister = async () => {
    try {
      await axios.post("/auth/register", { email, password, name });
    } catch (err) {
      setError("failed to register");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../assets/images/white.png")}
        style={styles.logo}
      />
      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={[styles.input, { color: "black" }]}
          placeholder="Name"
          placeholderTextColor="black"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Phone"
          value={phone}
          placeholderTextColor="black"
          onChangeText={setPhone}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          placeholderTextColor="black"
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={hidePassword}
          />
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            <Entypo
              name={hidePassword ? "eye-with-line" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.signupText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e37508",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "90%",
    alignItems: "center",
    elevation: 4,
  },
  logo: {
    width: 120,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    color: "#070707",
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },
  rememberForgot: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  rememberMe: {
    fontSize: 12,
    color: "#555",
  },
  forgotPassword: {
    fontSize: 12,
    color: "#007BFF",
  },
  loginButton: {
    backgroundColor: "#e37508",
    width: "100%",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  signupText: {
    color: "#007BFF",
  },
});

export default RegisterScreen;

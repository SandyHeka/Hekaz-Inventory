import { View } from "@/components/Themed";
import { useAuth } from "@/context/AuthContext";
import { Entypo } from "@expo/vector-icons";
import axios from "../services/api";
import { useNavigation, useRouter } from "expo-router";
import { useState } from "react";
import {
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const RegisterScreen = () => {
  const router = useRouter();

  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const handleRegister = async () => {
    // Validate fields
    if (!formData.name) {
      setError("Name is required");
      return;
    }

    if (!formData.phone || formData.phone.length < 10) {
      setError("Phone number must be at least 10 digits");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      const res = await axios.post("/auth/register", formData);
      await axios.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      login(formData.email, formData.password); // Your normal login function
      router.replace("/home");
    } catch (err) {
      setError("Failed to register");
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        source={require("../assets/images/white.png")}
        style={styles.logo}
      />
      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          placeholder="Email"
          value={formData.email}
          placeholderTextColor="black"
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={formData.password}
            placeholderTextColor="black"
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
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

        <TextInput
          style={[styles.input, { color: "black" }]}
          placeholder="Name"
          placeholderTextColor="black"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Phone"
          value={formData.phone}
          placeholderTextColor="black"
          keyboardType="numeric"
          onChangeText={(text) => {
            // Remove all non-numeric chars
            const onlyNumbers = text.replace(/[^0-9]/g, "");
            setFormData({ ...formData, phone: onlyNumbers });
          }}
          style={styles.input}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
          <Text style={styles.loginButtonText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.signupText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
  error: {
    fontSize: 12,
    color: "red",
    marginBottom: 10,
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

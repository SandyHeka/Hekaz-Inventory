import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function HomeScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  const products = [
    {
      id: "1",
      name: "Product A",
      stock: 12,
      price: "$25.00",
      img: "https://via.placeholder.com/80",
    },
    {
      id: "2",
      name: "Product B",
      stock: 5,
      price: "$10.00",
      img: "https://via.placeholder.com/80",
    },
    {
      id: "3",
      name: "Product C",
      stock: 0,
      price: "$30.00",
      img: "https://via.placeholder.com/80",
    },
  ];
  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <>
      <View className="flex-1 bg-white px-4 pt-4">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-4"></View>
        <TextInput
          placeholder="Search products"
          className="flex-1 text-base text-black"
        />
        <TouchableOpacity>
          <Text className="text-orange-500 font-bold">Filter</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between mb-4">
        <View className="bg-orange-100 p-3 rounded-lg w-[48%]">
          <Text className="text-orange-500 font-semibold">Total Products</Text>
          <Text className="text-xl font-bold mt-2">120</Text>
        </View>
        <View className="bg-orange-100 p-3 rounded-lg w-[48%]">
          <Text className="text-orange-500 font-semibold">Low Stock</Text>
          <Text className="text-xl font-bold mt-2">8</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

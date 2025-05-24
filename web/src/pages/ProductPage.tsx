import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "./DasboardPage";
import AddProductForm from "../components/AddProductForm";

type Product = {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  barcode: string;
};

const ProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err: any) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold text-white mb-4">Product Management</h2>
      <AddProductForm />
    </DashboardLayout>
  );
};

export default ProductListPage;

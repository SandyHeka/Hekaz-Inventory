import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "./DasboardPage";
import AddProductForm from "../components/AddProductForm";
import ProductList from "../components/ProductList";

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
      <h2 className="text-2xl font-bold text-gray-400 mb-6">Product Management</h2>
    
     <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <AddProductForm />
      </div>
      <div className="md:w-1/2 bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4">Product List</h3>
                 
            <ProductList />
        
      </div>
    </div>
    </DashboardLayout>
  );
};

export default ProductListPage;

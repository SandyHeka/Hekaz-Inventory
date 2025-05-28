import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "./DasboardPage";
import AddProductForm from "../components/AddProductForm";
import ProductList from "../components/ProductList";
import type { Product } from "../types";


const ProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("")

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
  const handleDelete = async(productId: string) =>{
      if(!window.confirm("Are you sure you want to delete the product?")) return;
      try{
        await API.delete(`/products/${productId}`);
        setProducts((prev) => prev.filter((product) => product._id !== productId));
        setMessage("Product has been deleted");
      }
      catch(err){
        alert("Failed to delete product");
        console.error(err);
      }
  }
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-50">Product Management</h2>
    
     <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <AddProductForm />
      </div>
      {
        products && products.length > 0 ? (
           <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-50">Product List</h3>
                  
              <ProductList products={products} onDelete={handleDelete} />
          
          </div>
        ) : (
         <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
              <p className="text-gray-500 dark:text-gray-300 text-lg font-medium">
                No products available. Add one to get started!
              </p>
          </div>
        )
       
      }
     
    </div>
    </DashboardLayout>
  );
};

export default ProductListPage;

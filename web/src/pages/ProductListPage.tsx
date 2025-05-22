import { useEffect, useState } from "react";
import API from "../api/axios";

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
    try{
      const res = await API.get("/products");
      setProducts(res.data);
    }
    catch(err:any)
    {
      setError("Failed to fetch products")
    }finally{
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchProducts();
  }, []);

     return (
   <div className="min-h-screen bg-gray-50 dark:bg0-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Product List</h1>
      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading......</p>
      ) :(
        error ? (
          <p className="text-red-500">{error}</p>
        ):(
          <div className="overflow-x-auto">
            <table className="min-2-full bg-whit dark:bg-gray-800 border dark:border-gray-700 rounded shadow">
              <thead>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Barcode</th>
              </thead>
              <tbody>
                {products.map((product) =>(
                  <tr key={product._id} className="border-t dark:border-gray-700">
                      <td className="p-3 dark:text-white">{product.name}</td>
                      <td className="p-3 text-sm text-gray-500 dark:text-gray-400">{product.category}</td>
                      <td className="p-3 text-sm text-gray-500 dark:text-gray-400">${product.price.toFixed(2)}</td>
                      <td className="p-3 text-sm text-gray-500 dark:text-gray-400">{product.quantity}</td>
                      <td className="p-3 text-sm text-gray-500 dark:text-gray-400">{product.barcode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
   </div>
    )

} 

export default ProductListPage;

import { useEffect, useState } from "react";
import API from "../api/axios";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  barcode: string;
};

const ProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

     return (
    <div className="p-6">
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Category</th>
              <th className="p-2">Barcode</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p =>(
            <tr key={p._id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">${p.price.toFixed(2)}</td>
              <td className="p-2">{p.quantity}</td>
              <td className="p-2">{p.category}</td>
              <td className="p-2">{p.barcode}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    )

} 

export default ProductListPage;

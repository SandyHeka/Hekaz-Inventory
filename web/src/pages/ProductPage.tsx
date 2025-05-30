import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "./DasboardPage";
import AddProductForm from "../components/AddProductForm";
import ProductList from "../components/ProductList";
import type { Product } from "../types/ProductTypes";
import ConfirmDialog from "../components/ConfirmDialog";

const ProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

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

  const openConfirmDialog = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };
  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      console.log("delete");
      await API.delete(`/products/${pendingDeleteId}`);
      setProducts((prev) => prev.filter((p) => p._id !== pendingDeleteId));
      setMessage("Product has been deleted");
    } catch {
      alert("Failed to delete product");
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-50">
        Product Management
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <AddProductForm
            existingProduct={editingProduct}
            onSuccess={() => {
              fetchProducts();
              setEditingProduct(null);
            }}
          />
        </div>
        {products && products.length > 0 ? (
          <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-50">
              Product List
            </h3>

            <ProductList
              products={products}
              onDelete={openConfirmDialog}
              onEdit={setEditingProduct}
            />
          </div>
        ) : (
          <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
            <p className="text-gray-500 dark:text-gray-300 text-lg font-medium">
              No products available. Add one to get started!
            </p>
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this product?"
      />
    </DashboardLayout>
  );
};

export default ProductListPage;

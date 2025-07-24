import { useEffect, useState } from "react";
import DashboardLayout from "./DasboardPage";
import AddProductForm from "../components/Product/AddProductForm";

import type { Product } from "../types/ProductTypes";
import ConfirmDialog from "../components/ConfirmDialog";
import Pagination from "../components/Pagination";
import ToastMessage from "../components/ToastMessage";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../api/productService";
import ProductList from "../components/Product/ProductList";

const ProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [message]);
  const fetchProducts = async (page: number = 1) => {
    try {
      const {
        products,
        totalPages,
        page: currentPage,
      } = await getAllProducts(page);
      setProducts(products);
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
    } catch (err: any) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };
  const handleProductSubmit = async (formData: FormData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
        setMessage("Product updated successfully");
      } else {
        await createProduct(formData);
        setMessage("Product added successfully");
      }
      await fetchProducts();
      setEditingProduct(null);
    } catch (err) {
      setError("Failed to save product");
    }
  };

  const openConfirmDialog = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };
  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteProduct(pendingDeleteId);
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
      {message && <ToastMessage message={message} type="success" />}
      {error && <ToastMessage message={error} type="error" />}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <AddProductForm
            existingProduct={editingProduct}
            onSubmit={handleProductSubmit}
            onSuccess={() => {
              fetchProducts();
              setEditingProduct(null);
            }}
          />
        </div>
        {loading ? (
          <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto text-center">
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
              Loading products...
            </p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-50">
              Product List
            </h3>

            <ProductList
              products={products}
              onDelete={openConfirmDialog}
              onEdit={setEditingProduct}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
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

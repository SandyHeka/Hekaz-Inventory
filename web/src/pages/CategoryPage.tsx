import { useState, useEffect } from "react";
import AddCategoryForm from "../components/Category/AddCategory";
import CategoryList from "../components/Category/CategoryList";
import type { Category, CategoryFormData } from "../types/CategoryTypes";
import DashboardPage from "./DasboardPage";

import ConfirmDialog from "../components/ConfirmDialog";
import Pagination from "../components/Pagination";
import ToastMessage from "../components/ToastMessage";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../api/categoryServices";

const CategoryPage = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const [existingCategory, setExistingCategory] = useState<Category | null>(
    null
  );
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const fetchCategory = async (page: number = 1) => {
    try {
      const res = await getAllCategory();
      setCategory(res.category);
      setTotalPages(res.totalPage);
      setCurrentPage(res.page);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch categories");
    }
  };

  const handleCategorySubmit = async (form: CategoryFormData) => {
    try {
      if (existingCategory) {
        await updateCategory(existingCategory._id, form);
        setMessage("Category updated successfully");
      } else {
        await createCategory(form);
        setMessage("Category added successfully");
      }
      await fetchCategory();
      setExistingCategory(null);
    } catch {
      setError("Failed to submit category");
    }
  };
  const openConfirmDialog = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };
  const confirmDelete = async () => {
    if (!pendingDeleteId) return;

    try {
      console.log(pendingDeleteId);
      await deleteCategory(pendingDeleteId);
      setMessage("Category has been deleted");
      setCategory((prev) => prev.filter((cat) => cat._id !== pendingDeleteId));
    } catch {
      alert("Failed to delete category");
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };
  useEffect(() => {
    fetchCategory(currentPage);
  }, [currentPage]);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // cleanup if component unmounts
    }
  }, [message]);
  return (
    <DashboardPage>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-50">
        Category Management
      </h2>
      {message && <ToastMessage message={message} type="success" />}
      {error && <ToastMessage message={error} type="error" />}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Add / Update Category Form */}
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <AddCategoryForm
            existingCategory={existingCategory}
            onSubmit={handleCategorySubmit}
            onSuccess={() => {
              fetchCategory();
              setExistingCategory(null);
            }}
          />
        </div>

        {/* Category List */}
        <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-50">
            Categories
          </h3>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <CategoryList
            categories={category}
            onDelete={openConfirmDialog}
            onEdit={setExistingCategory}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      <ConfirmDialog
        isOpen={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure want to delete this category?"
      />
    </DashboardPage>
  );
};

export default CategoryPage;

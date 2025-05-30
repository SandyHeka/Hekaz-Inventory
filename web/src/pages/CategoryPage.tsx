import { useState, useEffect } from "react";
import AddCategoryForm from "../components/AddCategory";
import CategoryList from "../components/CategoryList";
import type { Category } from "../types/CategoryTypes";
import DashboardPage from "./DasboardPage";
import API from "../api/axios";

const CategoryPage = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const [existingCategory, setExistingCategory] = useState<Category | null>(null);
  const [error, setError] = useState("");

  const fetchCategory = async () => {
    try {
      const res = await API.get("/category");
      setCategory(res.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <DashboardPage>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-50">
        Category Management
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Add / Update Category Form */}
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <AddCategoryForm
            existingCategory={existingCategory}
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
            
          />
        </div>
      </div>
    </DashboardPage>
  );
};

export default CategoryPage;

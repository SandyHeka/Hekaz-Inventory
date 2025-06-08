import React, { useState } from "react";
import DashboardLayout from "./DasboardPage";
import AddBrandForm from "../components/Brand/AddBrandForm";
import BrandList from "../components/Brand/BrandList";
import type { Brand } from "../../types/BrandTypes";
import API from "../api/axios";
const BrandPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchBrand = async (page: number = 1) => {
    try {
      const res = await API.get(`/brands?page=${page}&limit=10`);
      setBrands(res.data.brands);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.page);
    } catch (err: any) {
      setError("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-50">
        Brand Management
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <AddBrandForm
            editingBrand={editingBrand}
            onSuccess={() => {
              fetchBrand();
              setEditingBrand(null);
            }}
          />
        </div>
        <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-50">
            <BrandList />
          </h3>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BrandPage;

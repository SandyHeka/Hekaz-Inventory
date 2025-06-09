import React, { useEffect, useState } from "react";
import DashboardLayout from "./DasboardPage";
import AddBrandForm from "../components/Brand/AddBrandForm";
import BrandList from "../components/Brand/BrandList";
import type { Brand } from "../../types/BrandTypes";
import API from "../api/axios";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import ToastMessage from "../components/ToastMessage";
const BrandPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

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
  const openConfirmDialog = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };
  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await API.delete(`/brands/${pendingDeleteId}`);
      setBrands((prev) => prev.filter((p) => p._id !== pendingDeleteId));
      setMessage("Brand has been deleted");
    } catch (err: any) {
      alert("failed to delete product");
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };
  useEffect(() => {
    fetchBrand(currentPage);
  }, [currentPage]);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // cleanup if component unmounts
    }
  }, [message]);
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-50">
        Brand Management
      </h2>
      {message && <ToastMessage message={message} type="success" />}
      {error && <ToastMessage message={error} type="error" />}
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
        {brands && brands.length > 0 ? (
          <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-50">
              Brand List
            </h3>
            <BrandList
              brands={brands}
              onDelete={openConfirmDialog}
              onEdit={setEditingBrand}
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
              No brand available. Add one to get started!
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

export default BrandPage;

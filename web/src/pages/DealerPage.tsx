import React, { useEffect, useState } from "react";
import DashboardPage from "./DasboardPage";
import ToastMessage from "../components/ToastMessage";
import AddDealerForm from "../components/Dealer/AddDealerForm";
import DealerList from "../components/Dealer/DealerList";
import type { Dealer } from "../types/DealerTypes";
import API from "../api/axios";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
const DealerPage = () => {
  const [dealer, setDealer] = useState<Dealer[]>([]);
  const [existingDealer, setExistingDealer] = useState<Dealer | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [confrimOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const fetchDealer = async (page: number = 1) => {
    try {
      const res = await API.get(`/dealers?page=${page}&limit=10`);
      setDealer(res.data.dealer);
      setTotalPages(res.data.totalPage);
      setCurrentPage(res.data.page);
    } catch (err: any) {
      setError("Failed to fetch catgories");
    }
  };
  const openCofirmDialog = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };
  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await API.delete(`/dealers/${pendingDeleteId}`);
      setMessage("Delaer has been deleted");
      setDealer((prev) => prev.filter((deal) => deal._id !== pendingDeleteId));
    } catch {
      alert("Failed to delete dealer");
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };
  useEffect(() => {
    fetchDealer(currentPage);
  }, [currentPage]);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <DashboardPage>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-50">
        Dealer Management
      </h2>
      {message && <ToastMessage message={message} type="success" />}
      {error && <ToastMessage message={error} type="error" />}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <AddDealerForm
            existingDealer={existingDealer}
            onSuccess={() => {
              fetchDealer();
              setExistingDealer(null);
            }}
          />
        </div>
        <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-50">
            Dealers
          </h3>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <DealerList
            dealers={dealer}
            onDelete={openCofirmDialog}
            onEdit={setExistingDealer}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      <ConfirmDialog
        isOpen={confrimOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure want to delete this dealer"
      />
    </DashboardPage>
  );
};

export default DealerPage;

// pages/DealerListPage.tsx
import { useEffect, useState } from "react";

import AddDealerForm from "../components/Dealer/AddDealerForm";
import ConfirmDialog from "../components/ConfirmDialog";
import ToastMessage from "../components/ToastMessage";

import type { Dealer, DealerFormData } from "../types/DealerTypes";
import DashboardPage from "./DasboardPage";
import {
  createDealer,
  deleteDealer,
  getAllDealers,
  updateDealer,
} from "../api/dealersService";
import DealerList from "../components/Dealer/DealerList";
import Pagination from "../components/Pagination";

const DealerPage = () => {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [editingDealer, setEditingDealer] = useState<Dealer | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!message && !error) return;

    const timer = setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, error]);

  const fetchDealers = async () => {
    setLoading(true);
    try {
      const res = await getAllDealers();
      setDealers(res.dealer || []);

      setTotalPages(res.totalPage);
      setCurrentPage(res.page);
    } catch {
      setError("Failed to fetch dealers");
    } finally {
      setLoading(false);
    }
  };

  const handleDealerSubmit = async (form: DealerFormData) => {
    try {
      if (editingDealer) {
        await updateDealer(editingDealer._id, form);
        setMessage("Dealer updated successfully");
      } else {
        await createDealer(form);
        setMessage("Dealer added successfully");
      }
      await fetchDealers();
      setEditingDealer(null);
    } catch {
      setError("Failed to submit dealer");
    }
  };

  const openConfirmDialog = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    console.log("⚠️ Attempting to delete dealer ID:", pendingDeleteId);
    if (!pendingDeleteId) return;
    try {
      await deleteDealer(pendingDeleteId);
      setDealers((prev) => prev.filter((d) => d._id !== pendingDeleteId));
      setMessage("Dealer deleted successfully");
    } catch (e: any) {
      const msg =
        e?.response?.data?.error || e?.message || "Failed to delete supplier";
      setError(msg);
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  return (
    <DashboardPage>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-50">
        Supplier Management
      </h2>
      {message && <ToastMessage message={message} type="success" />}
      {error && <ToastMessage message={error} type="error" />}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <AddDealerForm
            existingDealer={editingDealer}
            onSubmit={handleDealerSubmit}
            onSuccess={() => {
              fetchDealers();
              setEditingDealer(null);
            }}
          />
        </div>

        <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-50">
            Supplier List
          </h3>
          {loading ? (
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Loading Suppliers...
            </p>
          ) : dealers.length > 0 ? (
            <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
              <DealerList
                dealers={dealers}
                onDelete={openConfirmDialog}
                onEdit={setEditingDealer}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-300 text-lg font-medium">
              No Suppliers found.
            </p>
          )}
        </div>
      </div>

      <ConfirmDialog
        name="delete"
        isOpen={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this dealer?"
      />
    </DashboardPage>
  );
};

export default DealerPage;

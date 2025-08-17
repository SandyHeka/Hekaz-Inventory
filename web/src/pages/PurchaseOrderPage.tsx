import { useEffect, useState } from "react";

import {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrderStatus,
} from "../api/purchaseOrderServices";
import DashboardPage from "./DasboardPage";
import ToastMessage from "../components/ToastMessage";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import PurchaseOrderList from "../components/PurchaseOrder/PurchaseOrderList";
import AddPurchaseOrderForm from "../components/PurchaseOrder/AddPurchaseOrderForm";
import type {
  PurchaseOrder,
  PurchaseOrderForm,
} from "../types/PurchaseOrderTypes";
import ViewOrderModal from "../components/PurchaseOrder/ViewOrderModal";

const PurchaseOrderPage = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<{
    order: PurchaseOrder;
    items: any[];
  } | null>(null);
  const [pendingUpdate, setPendingUpdate] = useState<{
    id: string;
    newStatus: string;
  } | null>(null);

  const fetchOrders = async (page: number = 1) => {
    try {
      const {
        purchaseOrders,
        totalPages,
        page: currentPage,
      } = await getAllPurchaseOrders(page);
      const orders = (purchaseOrders || []).map((o: any) => {
        const s = o?.supplierId; // could be string or {_id,name}
        return {
          ...o,
          supplierName: typeof s === "string" ? "" : s?.name ?? "",
          supplierId: typeof s === "string" ? s : s?._id ?? "",
        };
      });

      setOrders(orders);
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch purchase orders.");
    }
  };

  const handleCreatePO = async (form: PurchaseOrderForm) => {
    try {
      await createPurchaseOrder(form);
      await fetchOrders();
      setMessage("Purchase order created succesffulyy");
    } catch (err) {
      setError("Failed to craete order");
    }
  };

  const handleStatusClick = (id: string, newStatus: string) => {
    setPendingUpdate({ id, newStatus });
    setConfirmOpen(true);
  };
  const confirmStatusChange = async () => {
    if (!pendingUpdate) return;

    try {
      await updatePurchaseOrderStatus(
        pendingUpdate.id,
        pendingUpdate.newStatus
      );
      await fetchOrders(currentPage);
      setMessage(
        pendingUpdate.newStatus === "Completed"
          ? "Order completed and stock updated."
          : "Order status updated."
      );
    } catch {
      setError("Failed to update status.");
    } finally {
      setConfirmOpen(false);
      setPendingUpdate(null);
    }
  };
  const handleViewOrder = async (order: PurchaseOrder) => {
    setSelectedOrderId(order._id);

    try {
      const data = await getPurchaseOrderById(order._id);
      // merge items into order for the modal’s convenience
      setOrderDetails({
        order: { ...data.order, items: data.items },
        items: data.items,
      });
    } catch {
      setOrderDetails(null);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!message && !error) return;

    const timer = setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, error]);

  return (
    <DashboardPage>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Purchase Order Management
      </h2>
      {message && <ToastMessage message={message} type="success" />}
      {error && <ToastMessage message={error} type="error" />}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <AddPurchaseOrderForm
            onSubmit={handleCreatePO}
            onSuccess={() => fetchOrders(currentPage)}
          />
        </div>

        <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            {" "}
            Purchase Orders
          </h3>
          <PurchaseOrderList
            orders={orders}
            onStatusChange={handleStatusClick}
            onView={handleViewOrder}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      <ConfirmDialog
        name="Ok"
        isOpen={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmStatusChange}
        message={`Change status to "${pendingUpdate?.newStatus}"?`}
      />
      <ViewOrderModal
        order={orderDetails?.order ?? null}
        onCancel={() => setOrderDetails(null)}
      />
    </DashboardPage>
  );
};

export default PurchaseOrderPage;

import { useEffect, useState } from "react";
import DashboardPage from "./DasboardPage";
import ToastMessage from "../components/ToastMessage";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";

import AddSalesOrderForm from "../components/SalesOrder/AddSalesOrderForm";
import SalesOrderList from "../components/SalesOrder/SalesOrderList";

import {
  createSalesOrder,
  getAllSalesOrders,
  getSalesOrderById,
  updateSalesOrderStatus,
} from "../api/salesOrderServices";

import type {
  SalesOrder,
  SalesOrderForm,
  SOStatus,
} from "../types/SalesOrderTypes";

const SalesOrderPage = () => {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState<{
    id: string;
    status: SOStatus;
  } | null>(null);

  const fetchOrders = async (page = 1) => {
    try {
      const {
        salesOrders,
        totalPages,
        page: current,
      } = await getAllSalesOrders(page);
      setOrders(salesOrders);
      setTotalPages(totalPages);
      setCurrentPage(current);
    } catch {
      setError("Failed to fetch sales orders.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (message || error) {
      const t = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [message, error]);

  const handleCreate = async (form: SalesOrderForm) => {
    try {
      await createSalesOrder(form);
      await fetchOrders(currentPage);
      setMessage("Sales order created.");
    } catch {
      setError("Failed to create sales order.");
    }
  };

  const handleStatusClick = (id: string, status: SOStatus) => {
    setPending({ id, status });
    setConfirmOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!pending) return;
    try {
      await updateSalesOrderStatus(pending.id, pending.status);
      await fetchOrders(currentPage);
      setMessage(
        pending.status === "Completed"
          ? "Order completed. Stock updated."
          : "Order status updated."
      );
    } catch (e) {
      setError("Failed to update order status.");
    } finally {
      setConfirmOpen(false);
      setPending(null);
    }
  };

  const handleView = async (o: SalesOrder) => {
    // optional: you can show a modal like PO; reusing your ViewOrderModal with minor renaming works.
    const { order, items } = await getSalesOrderById(o._id);
    console.log("Sales Order details:", order, items);
    alert(`Sales Order #${o.orderNumber}\nItems: ${items.length}`);
  };

  return (
    <DashboardPage>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Sales Order Management
      </h2>
      {message && <ToastMessage message={message} type="success" />}
      {error && <ToastMessage message={error} type="error" />}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <AddSalesOrderForm
            onSubmit={handleCreate}
            onSuccess={() => fetchOrders(currentPage)}
          />
        </div>

        <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Sales Orders
          </h3>
          <SalesOrderList
            orders={orders}
            onStatusChange={handleStatusClick}
            onView={handleView}
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
        message={`Change status to "${pending?.status}"?`}
      />
    </DashboardPage>
  );
};

export default SalesOrderPage;

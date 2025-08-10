import { useEffect, useState } from "react";
import type { Customer, CustomerFormData } from "../types/CustomerTypes";

import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  updateCustomer,
} from "../api/customerServices";
import DashboardPage from "./DasboardPage";
import ToastMessage from "../components/ToastMessage";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";

import AddCustomerForm from "../components/Customer/AddCustomer";
import CustomerList from "../components/Customer/CustomerList";

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [existingCustomer, setExistingCustomer] = useState<Customer | null>(
    null
  );
  const [totalPages, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const fetchCustomer = async (page: numer = 1) => {
    try {
      const res = await getAllCustomers();
      if (!res.customers) return setError("No Customer Found");
      setCustomers(res.customers);
      setTotalPage(res.totalPages);
      setCurrentPage(res.page);
    } catch (err: any) {
      setError("Failed to fetch customers");
    }
  };

  const handleCustomerSubmit = async (form: CustomerFormData) => {
    try {
      if (existingCustomer) {
        await updateCustomer(existingCustomer._id, form);
        setMessage("Customer updated successfully");
      } else {
        await createCustomer(form);
        setMessage("Customer added successfully");
      }
      await fetchCustomer();
      setExistingCustomer(null);
    } catch {
      setError("Failed to submit customer");
    }
  };

  const openConfirmDialog = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;

    try {
      await deleteCustomer(pendingDeleteId);
      setMessage("Customer has been deleted");
      setCustomers((prev) =>
        prev.filter((cust) => cust._id !== pendingDeleteId)
      );
    } catch {
      setError("Failed to delete customer");
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };
  useEffect(() => {
    fetchCustomer(currentPage);
  }, [currentPage]);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);
  return (
    <DashboardPage>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-50">
        Customer Management
      </h2>
      {message && <ToastMessage message={message} type="success" />}
      {error && <ToastMessage message={error} type="error" />}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <AddCustomerForm
            existingCustomer={existingCustomer}
            onSubmit={handleCustomerSubmit}
            onSuccess={() => {
              fetchCustomer();
              setExistingCustomer(null);
            }}
          />
        </div>

        <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-50">
            Customers
          </h3>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <CustomerList
            customers={customers}
            onDelete={openConfirmDialog}
            onEdit={setExistingCustomer}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      <ConfirmDialog
        name="delete"
        isOpen={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure want to delete this customer?"
      />
    </DashboardPage>
  );
};

export default CustomerPage;

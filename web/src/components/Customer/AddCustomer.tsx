import { useEffect, useState } from "react";
import { StatusType } from "../../types/StatusTypes";
import ToastMessage from "../ToastMessage";
import type { Customer, CustomerFormData } from "../../types/CustomerTypes";

type Props = {
  existingCustomer?: Customer | null;
  onSubmit: (form: CustomerFormData) => Promise<void>;
  onSuccess: () => void;
};

const AddCustomerForm = ({
  existingCustomer = null,
  onSuccess,
  onSubmit,
}: Props) => {
  const [form, setForm] = useState({
    name: existingCustomer?.name || "",
    phone: existingCustomer?.phone || "",
    address: existingCustomer?.address || "",
    email: existingCustomer?.email || "",
    status: existingCustomer?.status || StatusType.ACTIVE,
  });

  useEffect(() => {
    setForm({
      name: existingCustomer?.name || "",
      phone: existingCustomer?.phone || "",
      address: existingCustomer?.address || "",
      email: existingCustomer?.email || "",
      status: existingCustomer?.status || StatusType.ACTIVE,
    });
  }, [existingCustomer]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // cleanup if component unmounts
    }
  }, [message]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await onSubmit(form);
      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        status: StatusType.ACTIVE,
      });
      onSuccess();
    } catch (err: any) {
      setError("Failed to add customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Customer Name"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Customer Email"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        type="number"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Customer Phone Number"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        type="text"
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Customer Address"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />

      <select
        value={form.status}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            status: e.target.value as StatusType,
          }))
        }
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      >
        {Object.values(StatusType).map((status) => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
      {message && <ToastMessage message={message} />}

      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : existingCustomer
          ? "Update Customer"
          : "Add Customer"}
      </button>
    </form>
  );
};

export default AddCustomerForm;

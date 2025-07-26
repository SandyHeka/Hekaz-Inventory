import { useEffect, useState } from "react";
import { StatusType } from "../../types/StatusTypes";
import type { Category, CategoryFormData } from "../../types/CategoryTypes";

import ToastMessage from "../ToastMessage";
import API from "../../api/axios";

type Props = {
  existingCategory?: Category | null;
  onSubmit: (form: CategoryFormData) => Promise<void>;
  onSuccess: () => void;
};

const AddCategoryForm = ({
  existingCategory = null,
  onSuccess,
  onSubmit,
}: Props) => {
  const [form, setForm] = useState({
    name: existingCategory?.name || "",
    status: existingCategory?.status || StatusType.ACTIVE,
  });

  useEffect(() => {
    setForm({
      name: existingCategory?.name || "",
      status: existingCategory?.status || StatusType.ACTIVE,
    });
  }, [existingCategory]);
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
        status: StatusType.ACTIVE,
      });
      onSuccess();
    } catch (err: any) {
      setError("Failed to add category");
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
        placeholder="Category Name"
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
          : existingCategory
          ? "Update Category"
          : "Add Category"}
      </button>
    </form>
  );
};

export default AddCategoryForm;

import React, { useEffect, useState } from "react";
import type { Brand } from "../../types/BrandTypes";
import { StatusType } from "../../types/StatusTypes";
import API from "../../api/axios";
import ToastMessage from "../ToastMessage";

type Props = {
  editingBrand?: Brand | null;
  onSuccess: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
};
const AddBrandForm = ({ editingBrand = null, onSuccess, onSubmit }: Props) => {
  const [form, setForm] = useState({
    name: editingBrand?.name || "",
    status: editingBrand?.status || StatusType.ACTIVE,
  });
  useEffect(() => {
    if (editingBrand) {
      setForm({
        name: editingBrand?.name || "",
        status: editingBrand?.status || StatusType.ACTIVE,
      });
    }
  }, [editingBrand]);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [message]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([Key, value]) => {
        formData.append(Key, value);
      });
      if (image) {
        formData.append("image", image);
      }
      await onSubmit(formData);
      setForm({
        name: "",
        status: StatusType.ACTIVE,
      });
      setImage(null);
      onSuccess();
    } catch (err: any) {
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      setError("Failed to add brand");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Brand Name"
        value={form.name}
        onChange={handleChange}
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
      {editingBrand?.imageUrl && (
        <div className="mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
            Current Image:
          </p>
          <img
            src={
              editingBrand.imageUrl
                ? `http://localhost:5000${
                    editingBrand.imageUrl
                  }?t=${new Date().getTime()}`
                : "/dummy.jpg"
            }
            alt="Current"
            className="w-20 h-20 object-cover rounded"
          />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="w-full"
      />
      {message && <ToastMessage message={message} />}

      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : editingBrand
          ? "Update Product"
          : "Add Product"}
      </button>
    </form>
  );
};

export default AddBrandForm;

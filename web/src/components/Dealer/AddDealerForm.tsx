import React, { useEffect, useState } from "react";
import type { Dealer } from "../../types/DealerTypes";
import { StatusType } from "../../types/StatusTypes";
import API from "../../api/axios";
import ToastMessage from "../ToastMessage";

type Props = {
  existingDealer?: Dealer | null;
  onSuccess: () => void;
};

const AddDealerForm = ({ existingDealer = null, onSuccess }: Props) => {
  const [form, setForm] = useState({
    name: existingDealer?.name || "",
    email: existingDealer?.email || "",
    phone: existingDealer?.phone || "",
    location: existingDealer?.location || "",
    owner: existingDealer?.owner || "",
    status: existingDealer?.status || StatusType.ACTIVE,
  });

  useEffect(() => {
    setForm({
      name: existingDealer?.name || "",
      email: existingDealer?.email || "",
      phone: existingDealer?.phone || "",
      location: existingDealer?.location || "",
      owner: existingDealer?.owner || "",
      status: existingDealer?.status || StatusType.ACTIVE,
    });
  }, [existingDealer]);
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
      if (existingDealer) {
        await API.put(`/dealers/${existingDealer._id}`, form);
        setMessage("Dealer updated successfully");
      } else {
        await API.post("/dealers", form);
        setMessage("Dealer Added Successfully");
      }
      setForm({
        name: "",
        email: "",
        phone: "",
        location: "",
        owner: "",
        status: StatusType.ACTIVE,
      });
      onSuccess();
    } catch (err: any) {
      setError("Failed to add dealer");
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
        placeholder="Dealer Name"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        type="number"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone no"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        type="text"
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Location"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        type="text"
        name="owner"
        value={form.owner}
        onChange={handleChange}
        placeholder="Owner"
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
          : existingDealer
          ? "Update Category"
          : "Add Category"}
      </button>
    </form>
  );
};

export default AddDealerForm;

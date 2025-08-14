// components/Dealer/AddDealerForm.tsx
import React, { useEffect, useState } from "react";
import type { Dealer, DealerFormData } from "../../types/DealerTypes";
import { StatusType } from "../../types/StatusTypes";

type Props = {
  existingDealer?: Dealer | null;
  onSuccess: () => void;
  onSubmit: (form: DealerFormData) => Promise<void>;
};

const AddDealerForm = ({
  existingDealer = null,
  onSuccess,
  onSubmit,
}: Props) => {
  const [form, setForm] = useState<DealerFormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    owner: "",
    status: StatusType.ACTIVE,
  });

  useEffect(() => {
    if (existingDealer) {
      setForm({
        name: existingDealer.name || "",
        email: existingDealer.email || "",
        phone: existingDealer.phone || "",
        location: existingDealer.location || "",
        owner: existingDealer.owner || "",
        status: existingDealer.status || StatusType.ACTIVE,
      });
    }
  }, [existingDealer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
    setForm({
      name: "",
      email: "",
      phone: "",
      location: "",
      owner: "",
      status: StatusType.ACTIVE,
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Supplier Name"
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
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      >
        {Object.values(StatusType).map((status) => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
      >
        {existingDealer ? "Update Dealer" : "Add Dealer"}
      </button>
    </form>
  );
};

export default AddDealerForm;

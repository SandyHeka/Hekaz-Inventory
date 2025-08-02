import React, { useEffect, useState } from "react";
import type { User } from "../../types/UserTypes";

type Props = {
  editingUser?: User | null;
  onSuccess: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
};

const AddUserForm = ({ editingUser = null, onSuccess, onSubmit }: Props) => {
  const [form, setForm] = useState({
    name: editingUser?.name || "",
    email: editingUser?.email || "",
    phone: editingUser?.phone || "",
    role: editingUser?.role || "staff",
  });

  useEffect(() => {
    if (editingUser) {
      setForm({
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
      });
    }
  }, [editingUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (key === "password" && !val && editingUser) return;
      formData.append(key, val);
    });

    await onSubmit(formData);
    setForm({ name: "", email: "", phone: "", role: "staff" });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        required
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      />
      <input
        type="number"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        required
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      >
        {["admin", "manager", "staff"].map((role) => (
          <option value={role} key={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
      >
        {editingUser ? "Update User" : "Add User"}
      </button>
    </form>
  );
};

export default AddUserForm;

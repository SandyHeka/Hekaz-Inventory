import React, { useState } from "react";
import DashboardPage from "../pages/DasboardPage";
import API from "../api/axios";

const AddProductForm = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    barcode: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      await API.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Product added successfully!");
      setForm({
        name: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        barcode: "",
      });
      setImage(null);
    } catch (err: any) {
      setError("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-6 rounded shadow w-full max-w-xl space-y-4"
    >
      {["name", "category", "price", "quantity", "barcode"].map((field) => (
        <input
          key={field}
          type={field === "price" || field === "quantity" ? "number" : "text"}
          name={field}
          value={form[field as keyof typeof form]}
          onChange={handleChange}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          required
        />
      ))}

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="w-full"
      />

      {message && <p className="text-green-500 text-sm">{message}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProductForm;

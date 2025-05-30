import React, { useEffect, useState } from "react";
import API from "../api/axios";
import type { Product } from "../types/ProductTypes";
const generateBarcode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

type Props = {
  existingProduct?: Product | null;
  onSuccess: () => void;
};
const AddProductForm = ({ existingProduct = null, onSuccess }: Props) => {
  const [form, setForm] = useState({
    name: existingProduct?.name || "",
    description: existingProduct?.description || "",
    category: existingProduct?.category || "",
    price: existingProduct?.price?.toString() || "",
    quantity: existingProduct?.quantity?.toString() || "",
    barcode: existingProduct?.barcode || generateBarcode(),
  });

  useEffect(() => {
    if (existingProduct) {
      setForm({
        name: existingProduct?.name || "",
        description: existingProduct?.description || "",
        category: existingProduct?.category || "",
        price: existingProduct?.price?.toString() || "",
        quantity: existingProduct?.quantity?.toString() || "",
        barcode: existingProduct?.barcode || generateBarcode(),
      });
    }
  }, [existingProduct]);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      if (existingProduct) {
        await API.put(`/products/${existingProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Submitting form:", form);
        setMessage("Product updated successfully!");
      } else {
        await API.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Submitting form:", form);
        setMessage("Product added successfully");
      }

      setForm({
        name: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        barcode: generateBarcode(),
      });
      setImage(null);
      onSuccess();
    } catch (err: any) {
      setError("Failed to add product");
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
        placeholder="Product Name"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />

      <input
        type="text"
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />

      <input
        type="number"
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />

      <input
        type="number"
        name="quantity"
        value={form.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />

      <input
        type="text"
        name="barcode"
        value={form.barcode || ""}
        onChange={handleChange}
        placeholder="Barcode"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        readOnly
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      />
      {existingProduct?.imageUrl && (
        <div className="mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
            Current Image:
          </p>
          <img
            src={
              existingProduct.imageUrl
                ? `http://localhost:5000${
                    existingProduct.imageUrl
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

      {message && <p className="text-green-500 text-sm">{message}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : existingProduct
          ? "Update Product"
          : "Add Product"}
      </button>
    </form>
  );
};

export default AddProductForm;

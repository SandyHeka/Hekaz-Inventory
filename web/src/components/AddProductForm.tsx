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
    dealer: existingProduct?.dealer || "",
    brand: existingProduct?.brand || "",
    price: existingProduct?.price?.toString() || "",
    quantity: existingProduct?.quantity?.toString() || "",
    barcode: existingProduct?.barcode || generateBarcode(),
  });
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([]);
  const [dealers, setDealers] = useState<{ _id: string; name: string }[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/category?limit=100");
        setCategories(res.data.category || []); // adjust based on your API shape
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    const fetchBrands = async () => {
      try {
        const res = await API.get("/brands?limit=100");
        setBrands(res.data.brands || []);
      } catch (error) {
        console.error("failed to fetch catgeories:", error);
      }
    };
    const fetchDealers = async () => {
      try {
        const res = await API.get("/dealers?limit=100");
        setDealers(res.data.dealer || []);
      } catch (error) {
        console.error("Failed to fetch dealers:", error);
      }
    };

    fetchCategories();
    fetchBrands();
    fetchDealers();
  }, []);
  useEffect(() => {
    if (
      existingProduct &&
      brands.length > 0 &&
      categories.length > 0 &&
      dealers.length > 0
    ) {
      setForm({
        name: existingProduct.name || "",
        description: existingProduct.description || "",
        category:
          typeof existingProduct.category === "object"
            ? existingProduct.category._id
            : existingProduct.category || "",
        dealer:
          typeof existingProduct.dealer === "object"
            ? existingProduct.dealer._id
            : existingProduct.dealer || "",
        brand:
          typeof existingProduct.brand === "object"
            ? existingProduct.brand._id
            : existingProduct.brand || "",
        price: existingProduct?.price?.toString() || "",
        quantity: existingProduct?.quantity?.toString() || "",
        barcode: existingProduct?.barcode || generateBarcode(),
      });
    }
  }, [existingProduct, brands, categories, dealers]);
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
        dealer: "",
        brand: "",
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
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      >
        <option value="">-- Select Category --</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
      <select
        name="brand"
        value={form.brand}
        onChange={handleChange}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      >
        <option value="">-- Select Brand --</option>
        {brands.map((brand) => (
          <option key={brand._id} value={brand._id}>
            {brand.name}
          </option>
        ))}
      </select>
      <select
        name="dealer"
        value={form.dealer}
        onChange={handleChange}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      >
        <option value="">-- Select Dealer --</option>
        {dealers.map((dealer) => (
          <option key={dealer._id} value={dealer._id}>
            {dealer.name}
          </option>
        ))}
      </select>
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

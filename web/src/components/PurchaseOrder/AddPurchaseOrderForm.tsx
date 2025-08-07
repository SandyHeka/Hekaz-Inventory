import { useEffect, useState } from "react";
import type {
  PurchaseOrderForm,
  PurchaseOrderItemForm,
} from "../../types/PurchaseOrderTypes";
import ToastMessage from "../ToastMessage";
import { getAllDealers } from "../../api/dealersService";
import { getProductsByDealer } from "../../api/productService";

type Props = {
  onSubmit: (form: PurchaseOrderForm) => Promise<void>;
  onSuccess: () => void;
};

const AddPurchaseOrderForm = ({ onSubmit, onSuccess }: Props) => {
  const [form, setForm] = useState<PurchaseOrderForm>({
    supplierId: "",
    items: [{ productId: "", quantity: 1, unitPrice: 0 }],
  });

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const totalAmount = form.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const dealerRes = await getAllDealers();
        setSuppliers(dealerRes.dealers); // ✅ FIX: extract the actual array
      } catch {
        setSuppliers([]);
        console.error("Failed to fetch suppliers");
      }
    };

    fetchDealers();
  }, []);
  useEffect(() => {
    const fetchProductsForSupplier = async () => {
      if (!form.supplierId) return;

      try {
        const productRes = await getProductsByDealer(form.supplierId);
        setProducts(productRes.products); // adapt based on response shape
      } catch {
        setProducts([]);
        console.error("Failed to load products for selected supplier");
      }
    };

    fetchProductsForSupplier();
  }, [form.supplierId]);
  const handleChangeItem = (
    index: number,
    field: keyof PurchaseOrderItemForm,
    value: any
  ) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] =
      field === "quantity" || field === "unitPrice" ? Number(value) : value;
    setForm((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleAddItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1, unitPrice: 0 }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    if (form.items.length === 1) return;
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await onSubmit(form);
      setMessage("Purchase Order created successfully.");
      setForm({
        supplierId: "",
        items: [{ productId: "", quantity: 1, unitPrice: 0 }],
      });
      onSuccess();
    } catch {
      setError("Failed to create purchase order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        Add Purchase Order
      </h3>

      <select
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        value={form.supplierId}
        onChange={(e) => {
          const newSupplierId = e.target.value;
          setForm({
            supplierId: newSupplierId,
            items: [{ productId: "", quantity: 1, unitPrice: 0 }],
          });
        }}
        required
      >
        <option value="">Select Supplier</option>
        {suppliers.map((supplier) => (
          <option key={supplier._id} value={supplier._id}>
            {supplier.name}
          </option>
        ))}
      </select>

      <div className="space-y-4">
        {form.items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-4 items-center gap-2 border p-2 rounded"
          >
            <select
              className="p-2 border rounded col-span-2 dark:bg-gray-700 dark:text-white"
              value={item.productId}
              onChange={(e) =>
                handleChangeItem(index, "productId", e.target.value)
              }
              required
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Qty"
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              value={item.quantity}
              min={1}
              onChange={(e) =>
                handleChangeItem(index, "quantity", e.target.value)
              }
              required
            />
            <input
              type="number"
              placeholder="Unit Price"
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              value={item.unitPrice}
              min={0}
              onChange={(e) =>
                handleChangeItem(index, "unitPrice", e.target.value)
              }
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="text-red-500 hover:underline col-span-4 text-left"
            >
              Remove Item
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddItem}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        + Add Item
      </button>

      <div className="text-right text-lg font-semibold dark:text-white">
        Total: ${totalAmount.toFixed(2)}
      </div>

      {message && <ToastMessage message={message} type="success" />}
      {error && <ToastMessage message={error} type="error" />}

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
      >
        {loading ? "Saving..." : "Create Order"}
      </button>
    </form>
  );
};

export default AddPurchaseOrderForm;

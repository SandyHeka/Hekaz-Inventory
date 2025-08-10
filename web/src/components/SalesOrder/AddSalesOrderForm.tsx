import { useEffect, useState } from "react";
import ToastMessage from "../ToastMessage";
import { getAllProducts } from "../../api/productService";
// you need this service like dealersService
import type {
  SalesOrderForm,
  SalesOrderItemForm,
} from "../../types/SalesOrderTypes";
import { getAllCustomers } from "../../api/customerServices";

type Props = {
  onSubmit: (form: SalesOrderForm) => Promise<void>;
  onSuccess: () => void;
};

export default function AddSalesOrderForm({ onSubmit, onSuccess }: Props) {
  const [form, setForm] = useState<SalesOrderForm>({
    customerId: "",
    items: [{ productId: "", quantity: 1, unitPrice: 0 }],
  });

  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const totalAmount = form.items.reduce(
    (s, it) => s + it.quantity * it.unitPrice,
    0
  );

  useEffect(() => {
    const load = async () => {
      try {
        const [{ customers }, { products }] = await Promise.all([
          getAllCustomers(), // should return { customers: [...] }
          getAllProducts(1), // your service returns { products, totalPages, page }
        ]);

        setCustomers(customers || []);
        setProducts(products || []);
      } catch {
        setCustomers([]);
        setProducts([]);
      }
    };
    load();
  }, []);

  const handleChangeItem = (
    idx: number,
    field: keyof SalesOrderItemForm,
    value: any
  ) => {
    const items = [...form.items];
    items[idx][field] =
      field === "quantity" || field === "unitPrice" ? Number(value) : value;
    setForm((p) => ({ ...p, items }));
  };

  const addItem = () =>
    setForm((p) => ({
      ...p,
      items: [...p.items, { productId: "", quantity: 1, unitPrice: 0 }],
    }));

  const removeItem = (idx: number) => {
    if (form.items.length === 1) return;
    setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // basic validation
    if (
      !form.customerId ||
      form.items.some((i) => !i.productId || i.quantity <= 0 || i.unitPrice < 0)
    ) {
      setLoading(false);
      setError("Please fill all required fields correctly.");
      return;
    }

    try {
      await onSubmit(form);
      setMessage("Sales Order created.");
      setForm({
        customerId: "",
        items: [{ productId: "", quantity: 1, unitPrice: 0 }],
      });
      onSuccess();
    } catch {
      setError("Failed to create sales order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold dark:text-white">Add Sales Order</h3>

      <select
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        value={form.customerId}
        onChange={(e) => setForm({ ...form, customerId: e.target.value })}
        required
      >
        <option value="">Select Customer</option>
        {customers.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <div className="space-y-3">
        {form.items.map((it, idx) => (
          <div
            key={idx}
            className="grid grid-cols-4 items-center gap-2 border p-2 rounded"
          >
            <select
              className="p-2 border rounded col-span-2 dark:bg-gray-700 dark:text-white"
              value={it.productId}
              onChange={(e) =>
                handleChangeItem(idx, "productId", e.target.value)
              }
              required
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="Qty"
              value={it.quantity}
              min={1}
              onChange={(e) =>
                handleChangeItem(idx, "quantity", e.target.value)
              }
              required
            />
            <input
              type="number"
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="Unit Price"
              value={it.unitPrice}
              min={0}
              onChange={(e) =>
                handleChangeItem(idx, "unitPrice", e.target.value)
              }
              required
            />

            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="text-red-500 hover:underline col-span-4 text-left"
            >
              Remove Item
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
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
}

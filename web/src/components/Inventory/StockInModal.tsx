import { useState } from "react";
import type { Product } from "../../types/ProductTypes";
import { stockIn } from "../../api/inventoryService";
import ToastMessage from "../ToastMessage";

interface StockInModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const StockInModal = ({
  product,
  isOpen,
  onClose,
  onSuccess,
}: StockInModalProps) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    if (quantity <= 0) {
      setError("Please enter a valid quantity");
      return;
    }
    setLoading(true);
    try {
      await stockIn({
        productId: product._id,
        quantity,
        note,
      });
      setMessage("Stock Updated successfully");
      onSuccess();
      onClose();
    } catch {
      setError("Failed to update stock");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 py-3 rounded shadow w-full max-w-lg">
        <div className="bg-primary dark:bg-gray-700 text-white px-6 py-3 mb-4 rounded-t">
          <h2 className="text-lg font-semibold text-gray-50  mb-4">
            Stock In - {product.name}
          </h2>
        </div>
        {message && <ToastMessage message={message} type="success" />}
        {error && <ToastMessage message={error} type="error" />}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder="Enter quantity"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder="Add a note"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="bg-green-700 dark:bg-gray-600 text-white  px-4 py-2 rounded"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-primary hover:bg-orange-700 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockInModal;

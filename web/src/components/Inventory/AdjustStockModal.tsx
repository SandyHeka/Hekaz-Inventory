import { useState } from "react";
import type { Product } from "../../types/ProductTypes";
import { adjustStock } from "../../api/inventoryService";
import ToastMessage from "../ToastMessage";

interface AdjustStockModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AdjustStockModal = ({
  product,
  isOpen,
  onClose,
  onSuccess,
}: AdjustStockModalProps) => {
  const [quantity, setQuantity] = useState<number>(
    Number(product.currentStock) || 0
  );
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    if (quantity < 0) {
      setError("Please enter a valid quantity");
      return;
    }
    setLoading(true);
    try {
      await adjustStock({
        productId: product._id,
        newQuantity: quantity,
        note,
      });
      setMessage("Stock Adjustment Succesful");
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-96">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-50 mb-4">
          Adjust Stock - {product.name}
        </h2>
        {message && <ToastMessage message={message} type="success" />}
        {error && <ToastMessage message={error} type="error" />}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            placeholder="Enter new stock quantity"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Note (Optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            placeholder="Add a note"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
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

export default AdjustStockModal;

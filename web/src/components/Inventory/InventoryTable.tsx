import { FaMinus, FaPlus, FaSync } from "react-icons/fa";
import type { Product } from "../../types/ProductTypes";

type Props = {
  products: Product[];
  onStockIn: (product: Product) => void;
  onStockOut: (product: Product) => void;
  onAdjust: (product: Product) => void;
  onViewLogs: (product: Product) => void;
};

const InventoryTable = ({
  products,
  onStockIn,
  onStockOut,
  onAdjust,
  onViewLogs,
}: Props) => {
  return (
    <table className="min-w-full text-sm text-left bg-white dark:bg-gray-800 rounded-lg shadow">
      <thead className="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th className="px-4 py-2 text-gray-800 dark:text-gray-50">Product</th>
          <th className="px-4 py-2 text-gray-800 dark:text-gray-50">Barcode</th>
          <th className="px-4 py-2 text-gray-800 dark:text-gray-50">Stock</th>
          <th className="px-4 py-2 text-gray-800 dark:text-gray-50">
            Threshold
          </th>
          <th className="px-4 py-2 text-gray-800 dark:text-gray-50">Status</th>
          <th className="px-4 py-2 text-gray-800 dark:text-gray-50">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => {
          const isLow = product.currentStock < product.lowStockThreshold;
          return (
            <tr
              key={product._id}
              className="border-t border-gray-200 dark:border-gray-700"
            >
              <td className="px-4 py-2 text-gray-800 dark:text-gray-50">
                {product.name}
              </td>
              <td className="px-4 py-2 text-gray-800 dark:text-gray-50">
                {product.barcode}
              </td>
              <td className="px-4 py-2 text-gray-800 dark:text-gray-50">
                {product.currentStock}
              </td>
              <td className="px-4 py-2 text-gray-800 dark:text-gray-50">
                {product.lowStockThreshold}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    isLow
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}
                >
                  {isLow ? "Low Stock" : "In Stock"}
                </span>
              </td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => onStockIn(product)}
                  className="flex items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded transition"
                >
                  <FaPlus /> In
                </button>
                <button
                  onClick={() => onStockOut(product)}
                  className="flex items-center gap-1 bg-primary hover:bg-orange-700 text-white text-xs px-3 py-2 rounded transition"
                >
                  <FaMinus />
                  Out
                </button>
                <button
                  onClick={() => onAdjust(product)}
                  className="flex items-center gap-1 bg-gray-600 hover:bg-gray-800 text-white text-xs px-3 py-2 rounded transition"
                >
                  <FaSync />
                  Adjust
                </button>
                <button
                  onClick={() => onViewLogs(product)}
                  className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-800 text-white text-xs px-3 py-2 rounded transition"
                >
                  View Logs
                </button>
              </td>
            </tr>
          );
        })}
        {products.length === 0 && (
          <tr>
            <td
              colSpan={6}
              className="p-4 text-center text-gray-500 dark:text-gray-300"
            >
              No products found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default InventoryTable;

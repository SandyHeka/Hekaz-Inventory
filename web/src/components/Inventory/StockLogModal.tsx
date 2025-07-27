import { useEffect, useState } from "react";
import { getStockLogs } from "../../api/inventoryService";
import type { StockLog } from "../../types/InventoryTypes";

type StockLogModalProps = {
  productId: string;
  onClose: () => void;
};
const StockLogModal = ({ productId, onClose }: StockLogModalProps) => {
  const [logs, setLogs] = useState<StockLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getStockLogs(productId);
        console.log(data);
        setLogs(data || []);
      } catch {
        console.error("Failed to fetch logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [productId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
      <div className="bg-white dark:bg-gray-800 p-6 py-3 rounded shadow w-full max-w-3xl">
        <div className="bg-primary dark:bg-gray-700 text-white px-6 py-3 rounded-t">
          <h2 className="text-lg font-semibold text-gray-50  mb-4">
            Stock Movement Logs
          </h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p>Loading...</p>
          ) : logs.length === 0 ? (
            <p>No logs available</p>
          ) : (
            <table className="w-full text-sm text-left border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">User</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Quantity</th>
                  <th className="px-4 py-2 border">Note</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log._id}
                    className="border-t border-gray-300 text-gray-800 dark:text-gray-200"
                  >
                    <td className="px-4 py-2">{log.type}</td>
                    <td className="px-4 py-2">
                      {log.userId?.name || "Unknown"}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{log.quantity}</td>
                    <td className="px-4 py-2 text-xs text-gray-800 dark:text-gray-200">
                      {log.note || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button
            onClick={onClose}
            className="flex items-center gap-1 bg-primary hover:bg-orange-700  text-white text-xs mt-4 px-3 py-2 rounded transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockLogModal;

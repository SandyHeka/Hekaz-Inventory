import { FaEye } from "react-icons/fa";
import type { PurchaseOrder } from "../../types/PurchaseOrderTypes";

type Props = {
  orders: PurchaseOrder[];
  onStatusChange: (id: string, newStatus: string) => void;
  onView: (order: PurchaseOrder) => void;
};

const statusOptions = ["Draft", "Ordered", "Received", "Completed"];

const PurchaseOrderList = ({ orders, onStatusChange, onView }: Props) => {
  return (
    <table className="min-w-full text-sm text-left bg-white dark:bg-gray-800 rounded-lg shadow">
      <thead className="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-white">
            Order #
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-white">
            Supplier
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-white">
            Total ($)
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-white">
            Date
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-white">
            Status
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-white">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr className="border-t" key={order._id}>
            <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">
              {order.orderNumber}
            </td>
            <td className="px-4 py-2 text-gray-700 dark:text-white">
              {order.supplierName || order.supplierId}
            </td>
            <td className="px-4 py-2 text-gray-700 dark:text-white">
              {order.totalAmount.toFixed(2)}
            </td>
            <td className="px-4 py-2 text-gray-700 dark:text-white">
              {new Date(order.date).toLocaleDateString()}
            </td>
            <td className="px-4 py-2">
              <select
                value={order.status}
                onChange={(e) => onStatusChange(order._id, e.target.value)}
                className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white border rounded px-2 py-1"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </td>
            <td className="px-4 py-2 flex gap-2">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => onView(order)}
              >
                <FaEye />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default PurchaseOrderList;

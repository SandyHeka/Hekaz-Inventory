import { FaEye } from "react-icons/fa";
import type { POStatus, PurchaseOrder } from "../../types/PurchaseOrderTypes";

const nextStatuses: Record<POStatus, POStatus[]> = {
  Draft: ["Ordered", "Cancelled"],
  Ordered: ["Completed", "Cancelled"],
  Completed: [],
  Cancelled: [],
};
type Props = {
  orders: PurchaseOrder[];
  onStatusChange: (id: string, status: POStatus) => void;
  onView: (order: PurchaseOrder) => void;
};

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
        {(orders ?? []).map((o) => {
          const supplier =
            o.supplierName ||
            (typeof o.supplierId === "string"
              ? o.supplierId
              : o.supplierId?.name ?? "");
          const canChange = nextStatuses[o.status];

          return (
            <tr key={o._id} className="border-t">
              <td className="px-4 py-2">{o.orderNumber}</td>
              <td className="px-4 py-2">{supplier}</td>
              <td className="px-4 py-2">
                <select
                  value={o.status}
                  onChange={(e) =>
                    onStatusChange(o._id, e.target.value as POStatus)
                  }
                  disabled={canChange.length === 0}
                  className="p-1 border rounded dark:bg-gray-700 dark:text-white"
                >
                  <option value={o.status}>{o.status}</option>
                  {canChange.map((ns) => (
                    <option key={ns} value={ns}>
                      {ns}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2">${Number(o.totalAmount).toFixed(2)}</td>
              <td className="px-4 py-2">
                {new Date(o.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onView(o)}
                  className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  View
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default PurchaseOrderList;

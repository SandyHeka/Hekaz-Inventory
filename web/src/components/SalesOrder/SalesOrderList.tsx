import type { SalesOrder, SOStatus } from "../../types/SalesOrderTypes";

const nextStatuses: Record<SOStatus, SOStatus[]> = {
  Draft: ["Confirmed", "Cancelled"],
  Confirmed: ["Completed", "Cancelled"],
  Completed: [],
  Cancelled: [],
};

type Props = {
  orders: SalesOrder[];
  onStatusChange: (id: string, status: SOStatus) => void;
  onView: (order: SalesOrder) => void;
};

export default function SalesOrderList({
  orders,
  onStatusChange,
  onView,
}: Props) {
  return (
    <table className="min-w-full text-sm text-left bg-white dark:bg-gray-800 rounded-lg shadow">
      <thead className="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th className="px-4 py-2">Order #</th>
          <th className="px-4 py-2">Customer</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Total</th>
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {(orders ?? []).map((o) => {
          const customer =
            o.customerName ||
            (typeof o.customerId === "string"
              ? o.customerId
              : o.customerId?.name ?? "");
          const allowed = nextStatuses[o.status];

          return (
            <tr key={o._id} className="border-t">
              <td className="px-4 py-2">{o.orderNumber}</td>
              <td className="px-4 py-2">{customer}</td>
              <td className="px-4 py-2">
                <select
                  value={o.status}
                  onChange={(e) =>
                    onStatusChange(o._id, e.target.value as SOStatus)
                  }
                  disabled={allowed.length === 0}
                  className="p-1 border rounded dark:bg-gray-700 dark:text-white"
                >
                  <option value={o.status}>{o.status}</option>
                  {allowed.map((ns) => (
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
}

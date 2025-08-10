import type { PurchaseOrder } from "../../types/PurchaseOrderTypes";
import { exportPurchaseOrderPdf } from "../../utils/pdf";

type Props = {
  order: PurchaseOrder | null;
  onCancel: () => void;
};
export default function ViewOrderModal({ order, onCancel }: Props) {
  if (!order) return null;
  const productLabel = (pid: any) =>
    typeof pid === "string" ? pid : pid?.name ?? "";
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
      <div className="bg-white dark:bg-gray-800 p-6 py-3 rounded shadow w-full max-w-lg">
        <div className="bg-primary dark:bg-gray-700 text-white px-6 py-3 mb-4 rounded-t">
          <h2 className="text-lg font-semibold text-gray-50  mb-4">
            Order {order.orderNumber}
          </h2>
          <div className="flex gap-40">
            <div className="flex-row">
              <p>
                <strong>Supplier: </strong> {order.supplierName}
              </p>
              <p>
                <strong>Status: </strong>
                {order.status}
              </p>
            </div>
            <div className="flex-row ">
              <p>
                <strong>Total: </strong>${order.totalAmount}
              </p>
              <p>
                <strong>Date</strong>
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <h3 className="mt-4 font-semibold">Items</h3>
        <ul className="list-disc ml-5">
          {order.items && order.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b dark:border-gray-700">
                    <th className="py-2 pr-4">Product</th>
                    <th className="py-2 pr-4">Qty</th>
                    <th className="py-2 pr-4">Unit Price</th>
                    <th className="py-2 pr-4">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => {
                    const lineTotal =
                      Number(item.quantity) * Number(item.unitPrice);
                    return (
                      <tr
                        key={i}
                        className="border-b last:border-0 dark:border-gray-700"
                      >
                        <td className="py-2 pr-4">
                          {productLabel(item.productId)}
                        </td>
                        <td className="py-2 pr-4">{item.quantity}</td>
                        <td className="py-2 pr-4">
                          ${Number(item.unitPrice).toFixed(2)}
                        </td>
                        <td className="py-2 pr-4">${lineTotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              No items found for this order.
            </p>
          )}
        </ul>
        <div className="mt-6 text-right">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
          <button
            onClick={() =>
              exportPurchaseOrderPdf(order, {
                currency: "AUD",
                // logoDataUrl: myLogo // optional
              })
            }
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Print PDF
          </button>
        </div>
      </div>
    </div>
  );
}

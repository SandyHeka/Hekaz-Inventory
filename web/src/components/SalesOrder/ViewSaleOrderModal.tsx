import type { SalesOrder } from "../../types/SalesOrderTypes";
import { exportPurchaseOrderPdf } from "../../utils/pdf";

type Props = {
  order: SalesOrder | null;
  onCancel: () => void;
};
export default function ViewSaleOrderModal({ order, onCancel }: Props) {
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
                <strong>Customer: </strong> {order.customerName}
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
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="bg-green-700 dark:bg-gray-600 text-white  px-4 py-2 rounded"
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
            className="bg-primary hover:bg-orange-700 text-white px-4 py-2 rounded"
          >
            Print PDF
          </button>
        </div>
      </div>
    </div>
  );
}

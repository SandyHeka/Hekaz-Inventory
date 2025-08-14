import { useEffect, useState } from "react";
import DashboardPage from "./DasboardPage";
import ToastMessage from "../components/ToastMessage";
import {
  getOverview,
  getSalesByDay,
  getTopProducts,
  getLowStock,
  getSupplierSpend,
  getCustomerRevenue,
} from "../api/analyticsService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

type Overview = {
  purchasesCompletedAmount: number;
  purchasesCompletedCount: number;
  salesCompletedAmount: number;
  salesCompletedCount: number;
  lowStockCount: number;
  stockValuation: number;
};

export default function AnalyticsPage() {
  const [ov, setOv] = useState<Overview | null>(null);
  const [salesSeries, setSalesSeries] = useState<
    { date: string; total: number }[]
  >([]);
  const [topProducts, setTopProducts] = useState<
    { name: string; totalQty: number; revenue: number }[]
  >([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [supplierSpend, setSupplierSpend] = useState<any[]>([]);
  const [customerRevenue, setCustomerRevenue] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [o, s, tp, ls, sup, cust] = await Promise.all([
          getOverview(),
          getSalesByDay(30),
          getTopProducts(8),
          getLowStock(8),
          getSupplierSpend(),
          getCustomerRevenue(),
        ]);
        setOv(o);
        setSalesSeries(s.series || []);
        setTopProducts(tp.items || []);
        setLowStock(ls.items || []);
        setSupplierSpend(sup.items || []);
        setCustomerRevenue(cust.items || []);
      } catch {
        setError("Failed to load analytics");
      }
    };
    load();
  }, []);

  return (
    <DashboardPage>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Reporting & Analytics
      </h2>
      {error && <ToastMessage message={error} type="error" />}

      {/* KPI cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <KpiCard
          title="Sales (Completed)"
          value={fmtMoney(ov?.salesCompletedAmount)}
          sub={`${ov?.salesCompletedCount ?? 0} orders`}
        />
        <KpiCard
          title="Purchases (Completed)"
          value={fmtMoney(ov?.purchasesCompletedAmount)}
          sub={`${ov?.purchasesCompletedCount ?? 0} POs`}
        />
        <KpiCard
          title="Stock Valuation"
          value={fmtMoney(ov?.stockValuation)}
          sub={`${ov?.lowStockCount ?? 0} low-stock`}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Sales last 30d */}
        <div className="bg-white dark:bg-gray-800 rounded shadow p-4 lg:col-span-2">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
            Sales (Last 30 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => new Date(v).toLocaleDateString()}
                  tick={{ fill: "gray", className: "dark:fill-white" }}
                />
                <YAxis tick={{ fill: "gray", className: "dark:fill-white" }} />
                <Tooltip
                  formatter={(v: any) => fmtMoney(v as number)}
                  labelFormatter={(l) => new Date(l).toLocaleString()}
                />
                <Line dataKey="total" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
            Top Products (Qty)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalQty" fill="rgb(255, 153, 9)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 text-sm">
            {topProducts.map((p) => (
              <li key={p.name} className="flex justify-between">
                <span className="truncate text-gray-700 dark:text-white">
                  {p.name || p["productId"]}
                </span>
                <span className="font-medium text-gray-700 dark:text-white">
                  {p.totalQty}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Supplier spend */}
        <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
            Top Suppliers (Spend)
          </h3>
          <ul className="text-sm space-y-1">
            {supplierSpend.map((s: any) => (
              <li key={s.supplierId} className="flex justify-between">
                <span className="truncate">{s.name || s.supplierId}</span>
                <span className="font-medium">{fmtMoney(s.spend)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer revenue */}
        <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
            Top Customers (Revenue)
          </h3>
          <ul className="text-sm space-y-1">
            {customerRevenue.map((c: any) => (
              <li key={c.customerId} className="flex justify-between">
                <span className="truncate">{c.name || c.customerId}</span>
                <span className="font-medium">{fmtMoney(c.revenue)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Low stock */}
        <div className="bg-white dark:bg-gray-800 rounded shadow p-4 lg:col-span-2">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
            Low Stock
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">Stock</th>
                  <th className="py-2 pr-4">Threshold</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p: any) => (
                  <tr
                    key={p._id}
                    className="border-b last:border-0 dark:border-gray-700"
                  >
                    <td className="py-2 pr-4">{p.name}</td>
                    <td className="py-2 pr-4">{p.currentStock}</td>
                    <td className="py-2 pr-4">{p.lowStockThreshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardPage>
  );
}

function KpiCard({
  title,
  value,
  sub,
}: {
  title: string;
  value?: string;
  sub?: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
      <div className="text-sm text-gray-500 dark:text-gray-300">{title}</div>
      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
        {value ?? "-"}
      </div>
      {sub && (
        <div className="text-xs text-gray-700 dark:text-white mt-1">{sub}</div>
      )}
    </div>
  );
}

function fmtMoney(n?: number) {
  if (n == null) return "-";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "AUD",
  }).format(Number(n));
}

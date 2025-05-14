import ProductCard from "../components/ProductCard";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Sidebar/>
      {/* Main content */}
      <main className="flex-1 p-6">
        <Topbar/>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-6">
          <h3 className="font-semibold mb-2">Product Statistic</h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>Active Product<br /><strong>352 Product</strong></div>
            <div>Winning Product<br /><strong>3 Seater Sofa</strong></div>
            <div>Average Performance<br /><strong className="text-green-500">Good!</strong></div>
            <div>Product Sold<br /><strong>12,340 Items</strong></div>
          </div>
        </div>

        {/* Static product list */}
        <ProductCard/>
      </main>
    </div>
  );
};

export default DashboardPage;

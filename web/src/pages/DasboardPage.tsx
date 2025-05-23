// DashboardPage.tsx
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background dark:bg-gray-900 text-text">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setCollapsed={setCollapsed}
        setMobileOpen={setMobileOpen}
      />

      <div className={`flex-1 transition-all duration-300 ${collapsed ? "md:ml-8" : "md:ml-4"}`}>
        <Topbar onMobileToggle={() => setMobileOpen(!mobileOpen)} />

        <main className="p-6">
              
          {/* <h2 className="text-3xl font-bold mb-6 dark:text-white">Dashboard</h2> */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <p className="text-gray-500 dark:text-gray-300">Active Products</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">352</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <p className="text-gray-500 dark:text-gray-300">Winning Product</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">3 Seater Sofa</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <p className="text-gray-500 dark:text-gray-300">Performance</p>
              <p className="text-green-500 font-bold">Good!</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <p className="text-gray-500 dark:text-gray-300">Items Sold</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">12,340</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

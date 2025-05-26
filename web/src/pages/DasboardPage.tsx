// DashboardPage.tsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const DashboardPage = ({ children }: { children: React.ReactNode }) => {
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

      <div
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "md:ml-8" : "md:ml-4"
        }`}
      >
        <Topbar onMobileToggle={() => setMobileOpen(!mobileOpen)} />

        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardPage;

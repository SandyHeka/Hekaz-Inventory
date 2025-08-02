// Sidebar.tsx
import { LibraryBig, User2 } from "lucide-react";
import {
  Menu,
  X,
  LayoutDashboard,
  ShoppingBasket,
  BringToFrontIcon,
  UsersRound,
  Factory,
} from "lucide-react";
import { GiBrandyBottle } from "react-icons/gi";

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({
  collapsed,
  mobileOpen,
  setCollapsed,
  setMobileOpen,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  setCollapsed: (val: boolean) => void;
  setMobileOpen: (val: boolean) => void;
}) => {
  const { user } = useAuth();
  return (
    <aside
      className={`
        z-40 top-0 left-0 min-h-screen transition-all duration-300
        ${mobileOpen ? "translate-x-0 fixed" : "-translate-x-full fixed"}
        md:translate-x-0 md:relative
        ${collapsed ? "w-16" : "w-64"} 
        bg-primary dark:bg-gray-800 text-white p-4
      `}
    >
      <div className="flex justify-between items-center mb-10">
        {!collapsed && <h1 className="text-3xl font-bold">HekaZ Inv</h1>}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:block"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>

        <button onClick={() => setMobileOpen(false)} className="md:hidden">
          <X size={20} />
        </button>
      </div>

      <nav className="space-y-4 text-sm">
        <Link to="/" className="flex items-center gap-3">
          <LayoutDashboard size={20} />
          {!collapsed && <span className="text-lg">Dashboard</span>}
        </Link>

        <Link to="/products" className="flex items-center gap-3">
          <ShoppingBasket size={20} />
          {!collapsed && <span className="text-lg">Products</span>}
        </Link>
        <Link to="/orders" className="flex items-center gap-3">
          <BringToFrontIcon size={20} />
          {!collapsed && <span className="text-lg">Orders</span>}
        </Link>
        <Link to="/customers" className="flex items-center gap-3">
          <UsersRound size={20} />
          {!collapsed && <span className="text-lg">Customer</span>}
        </Link>
        <Link to="/dealer" className="flex items-center gap-3">
          <Factory size={20} />
          {!collapsed && <span className="text-lg">Dealers</span>}
        </Link>
        <Link to="/category" className="flex items-center gap-3">
          <LibraryBig size={20} />
          {!collapsed && <span className="text-lg">Category</span>}
        </Link>
        <Link to="/brand" className="flex items-center gap-3">
          <GiBrandyBottle size={20} />
          {!collapsed && <span className="text-lg">Brand</span>}
        </Link>
        <Link to="/inventory" className="flex items-center gap-3">
          <GiBrandyBottle size={20} />
          {!collapsed && <span className="text-lg">Inventory</span>}
        </Link>
        {user?.role === "admin" && (
          <Link to="/users" className="flex items-center gap-3">
            <User2 size={20} />
            {!collapsed && <span className="text-lg">Users</span>}
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;

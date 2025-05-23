// Sidebar.tsx
import { Menu, X, LayoutDashboard, BarChart4, ShoppingCart, ShoppingBasket, BringToFront, BringToFrontIcon, UsersRound, Factory } from 'lucide-react';

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

        <button onClick={() => setCollapsed(!collapsed)} className="hidden md:block">
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>

        <button onClick={() => setMobileOpen(false)} className="md:hidden">
          <X size={20} />
        </button>
        
      </div>
 
      <nav className="space-y-4 text-sm">
        <a href="/" className="flex items-center gap-3">
          <LayoutDashboard size={20} />
          {!collapsed && <span className='text-lg'>Dashboard</span>}
        </a>
        <a href="/products" className="flex items-center gap-3">
          <ShoppingBasket size={20} />
          {!collapsed && <span className='text-lg'>Products</span>}
        </a>
        <a href="/orders" className="flex items-center gap-3">
          <BringToFrontIcon size={20} />
          {!collapsed && <span className='text-lg'>Orders</span>}
        </a>
        <a href="/orders" className="flex items-center gap-3">
          <UsersRound size={20} />
          {!collapsed && <span className='text-lg'>Customer</span>}
        </a>
            <a href="/orders" className="flex items-center gap-3">
          <Factory size={20} />
          {!collapsed && <span className='text-lg'>Dealers</span>}
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;





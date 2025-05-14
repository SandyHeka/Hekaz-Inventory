const Sidebar = () => {
  return (
   
      <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-6">
        <h1 className="text-2xl font-bold mb-10">HekaZ Inventory</h1>
        <div className="space-y-4">
          <div className="text-gray-500 uppercase text-xs">Performance</div>
          <nav className="space-y-2">
            <a href="#" className="block">Analytics</a>
            <a href="#" className="block">Notification <span className="bg-red-500 text-white rounded px-2 ml-1 text-xs">99+</span></a>
            <a href="#" className="block font-semibold">Performance</a>
            <a href="#" className="block">Orders <span className="text-xs text-gray-500">120</span></a>
          </nav>
          <div className="text-gray-500 uppercase text-xs mt-6">Product</div>
          <nav className="space-y-2">
            <a href="#" className="block font-semibold">All Product</a>
            <a href="#" className="block">Shipping</a>
            <a href="#" className="block">Campaign</a>
            <a href="#" className="block">Catalog</a>
          </nav>
          <div className="text-gray-500 uppercase text-xs mt-6">My Store</div>
          <nav className="space-y-2">
            <a href="#" className="block">Product Category</a>
            <a href="#" className="block">Finance</a>
            <a href="#" className="block">Customer</a>
          </nav>
        </div>
      </aside>

      
  );
};

export default Sidebar;

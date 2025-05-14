const Topbar = () => {
  return (
   
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold">All Product List</h2>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Search Product"
              className="border p-2 rounded bg-white dark:bg-gray-800"
            />
            <button className="border px-4 py-2 rounded">Sort By</button>
            <button className="border px-4 py-2 rounded">Show</button>
          </div>
        </div>

      
  );
};

export default Topbar;

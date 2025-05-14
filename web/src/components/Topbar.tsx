const Topbar = () => {
  return (
   
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">All Product List</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search Product"
              className="border p-2 rounded bg-white dark:bg-gray-800"
            />
            <button className="border px-4 rounded">Sort By</button>
            <button className="border px-4 rounded">Show</button>
          </div>
        </div>

      
  );
};

export default Topbar;

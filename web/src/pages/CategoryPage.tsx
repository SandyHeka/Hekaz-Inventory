import ConfirmDialog from "../components/ConfirmDialog";
import DashboardPage from "./DasboardPage";

const CategoryPage = () => {
  return (
    <DashboardPage>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-50">
        Category Management
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 bg-white dark:gray-800 p-4 rounded shadow">
          <p>Add Category</p>
        </div>
        <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-50">
            Category List
          </h3>
        </div>
      </div>
      {/* <ConfirmDialog
        isOpen={confirmOpen}
        onCancel={() => setConfirm(false)}
        onConfirm={confirmDelete}
        message="Are you sure want to delete this category"
      /> */}
    </DashboardPage>
  );
};

export default CategoryPage;

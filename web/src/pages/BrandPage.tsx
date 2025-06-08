import React from "react";
import DashboardLayout from "./DasboardPage";
import AddBrandForm from "../components/Brand/AddBrandForm";
const BrandPage = () => {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-50">
        Brand Management
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <AddBrandForm />
        </div>
        <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-50">
            Brand List
          </h3>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BrandPage;

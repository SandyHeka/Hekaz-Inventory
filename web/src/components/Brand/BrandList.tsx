import React from "react";

const BrandList = () => {
  return (
    <table className="min-w-full text-sm text-left bg-white darK:bg-gray-800 rounded-lg shadow">
      <thead className="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Brand Name
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Image
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Status
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  );
};

export default BrandList;

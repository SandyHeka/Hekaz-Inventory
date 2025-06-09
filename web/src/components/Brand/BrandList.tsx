import React from "react";
import type { Brand } from "../../types/BrandTypes";
import { FaEdit, FaTrash } from "react-icons/fa";
type Props = {
  brands: Brand[];
  onDelete: (id: string) => void;
  onEdit: (brand: Brand) => void;
};
const BrandList = ({ brands, onDelete, onEdit }: Props) => {
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
        {brands.map((brand) => (
          <tr className="border-t" key={brand._id}>
            <td className="px-4 py-2 text-gray-800 dark:text-gray-50">
              {brand.name}
            </td>
            <td>
              <img
                src={
                  brand.imageUrl
                    ? `http://localhost:5000${
                        brand.imageUrl
                      }?t=${new Date().getTime()}`
                    : "/dummy.jpg"
                }
                alt={brand.name}
                className="w-10 h-10 object-cover rounded"
              />
            </td>
            <td className="px-4 py-2 text-gray-800 dark:text-gray-50">
              {brand.status}
            </td>
            <td className="px-4 py-2 flex gap-2">
              <button
                onClick={() => onEdit(brand)}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white text-xs px-3 py-3 rounded transition"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(brand._id)}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-700 text-white text-xs px-3 py-3 rounded transition"
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BrandList;

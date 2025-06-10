import React from "react";
import type { Dealer } from "../../types/DealerTypes";
import { FaEdit, FaTrash } from "react-icons/fa";

type Props = {
  dealers: Dealer[];
  onDelete: (id: string) => void;
  onEdit: (dealer: Dealer) => void;
};
const DealerList = ({ dealers, onDelete, onEdit }: Props) => {
  return (
    <table className="min-w-full text-sm text-left bg-white dark:bg-gray-800 rounded-lg shadow">
      <thead className="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Dealer Name
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Email
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Phone No
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Location
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Owner Name
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
        {dealers.map((dealer) => (
          <tr className="border-t" key={dealer._id}>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {dealer.name}
            </td>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {dealer.email}
            </td>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {dealer.phone}
            </td>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {dealer.location}
            </td>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {dealer.owner}
            </td>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {dealer.status}
            </td>
            <td className="px-4 py-2 flex gap-2">
              <button
                onClick={() => onEdit(dealer)}
                className="flex items-center gap-1 bg-blue-500  hover:bg-blue-700 text-white text-xs px-3 py-3 rounded transition"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(dealer._id)}
                className="flex items-center gap-1 bg-red-500  hover:bg-red-700 text-white text-xs px-3 py-3 rounded transition"
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

export default DealerList;

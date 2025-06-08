import { FaEdit, FaTrash } from "react-icons/fa";
import type { Category } from "../types/CategoryTypes";

type Props = {
  categories: Category[];
  onDelete: (id: string) => void;
  onEdit: (category: Category) => void;
};
const CategoryList = ({ categories, onDelete, onEdit }: Props) => {
  return (
    <table className="min-w-full text-sm text-left bg-white darK:bg-gray-800 rounded-lg shadow">
      <thead className="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Category Name
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
        {categories.map((category) => (
          <tr className="border-t" key={category._id}>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {category.name}
            </td>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {category.status}
            </td>
            <td className="px-4 py-2 flex gap-2">
              <button
                onClick={() => onEdit(category)}
                className="flex items-center gap-1 bg-blue-500  hover:bg-blue-700 text-white text-xs px-3 py-3 rounded transition"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(category._id)}
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

export default CategoryList;

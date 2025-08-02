import { FaEdit, FaTrash } from "react-icons/fa";
import type { Customer } from "../../types/CustomerTypes";

type Props = {
  customers: Customer[];
  onDelete: (id: string) => void;
  onEdit: (customer: Customer) => void;
};
const CustomerList = ({ customers, onDelete, onEdit }: Props) => {
  return (
    <table className="min-w-full text-sm text-left bg-white dark:bg-gray-800 rounded-lg shadow">
      <thead className="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Customer Name
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Email
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Address
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Phone
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
        {customers.map((customer) => (
          <tr className="border-t" key={customer._id}>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {customer.name}
            </td>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {customer.email}
            </td>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {customer.address}
            </td>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {customer.phone}
            </td>
            <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
              {customer.status}
            </td>
            <td className="px-4 py-2 flex gap-2">
              <button
                onClick={() => onEdit(customer)}
                className="flex items-center gap-1 bg-blue-500  hover:bg-blue-700 text-white text-xs px-3 py-3 rounded transition"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(customer._id)}
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

export default CustomerList;

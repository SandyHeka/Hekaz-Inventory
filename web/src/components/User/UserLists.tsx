import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { User } from "../../types/UserTypes";

type Props = {
  users: User[];
  onDelete: (id: string) => void;
  onEdit: (user: User) => void;
};

const UserList = ({ users, onDelete, onEdit }: Props) => {
  if (!users || users.length === 0) {
    return <p className="text-gray-500">No users found.</p>;
  }

  return (
    <table className="min-w-full text-sm text-left bg-white dark:bg-gray-800 rounded-lg shadow">
      <thead className="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Name
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Email
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Phone
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Role
          </th>
          <th className="px-4 py-2 font-medium text-gray-800 dark:text-gray-50">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id} className="border-t">
            <td className="px-4 py-2 text-gray-800 dark:text-gray-50">
              {user.name}
            </td>
            <td className="px-4 py-2 text-gray-800 dark:text-gray-50">
              {user.email}
            </td>
            <td className="px-4 py-2 text-gray-800 dark:text-gray-50">
              {user.phone}
            </td>
            <td className="px-4 py-2 text-gray-800 dark:text-gray-50 capitalize">
              {user.role}
            </td>
            <td className="px-4 py-2 flex gap-2">
              <button
                onClick={() => onEdit(user)}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(user._id)}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-700 text-white text-xs px-3 py-2 rounded"
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

export default UserList;

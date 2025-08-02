import { useEffect, useState } from "react";
import type { User } from "../types/UserTypes";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../api/userServices";
import DashboardPage from "./DasboardPage";
import ToastMessage from "../components/ToastMessage";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import UserList from "../components/User/UserLists";
import AddUserForm from "../components/User/AddUserForm";

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmOpen, setconfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const fetchUsers = async (page: number = 1) => {
    try {
      const res = await getAllUsers(page);

      setUsers(res.users);
      setTotalPages(res.totalPages);
      setCurrentPages(res.page);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };
  const handleUserSubmit = async (data: FormData) => {
    try {
      if (editingUser) {
        await updateUser(editingUser._id, data);
        setMessage("User update successfully");
      } else {
        await createUser(data);
        setMessage("User added successfully");
      }
      fetchUsers();
      setEditingUser(null);
    } catch {
      setError("Failed to submit user");
    }
  };

  const openConfirmDialog = (id: string) => {
    setPendingDeleteId(id);
    setconfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteUser(pendingDeleteId);
      setUsers((prev) => prev.filter((u) => u._id !== pendingDeleteId));
      setMessage("User deleted succesfully");
    } catch {
      setError("Failed to delete user");
    } finally {
      setconfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [message]);
  return (
    <DashboardPage>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-50">
        User Management
      </h2>
      {message && <ToastMessage message={message} type="success" />}
      {error && <ToastMessage message={error} type="error" />}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <AddUserForm
            editingUser={editingUser}
            onSubmit={handleUserSubmit}
            onSuccess={() => {
              fetchUsers();
              setEditingUser(null);
            }}
          />
        </div>
        {loading ? (
          <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto text-center">
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
              Loading products...
            </p>
          </div>
        ) : users && users.length > 0 ? (
          <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
            <UserList
              users={users}
              onDelete={openConfirmDialog}
              onEdit={setEditingUser}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPages}
            />
          </div>
        ) : (
          <div className="md:w-full bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
            <p className="text-gray-500 dark:text-gray-300 text-lg font-medium">
              No users available. Add one to get started!
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onCancel={() => setconfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure want to delete this user?"
      />
    </DashboardPage>
  );
};

export default UserPage;

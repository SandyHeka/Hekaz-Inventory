// Topbar.tsx
import {
  Key,
  LogOut,
  Menu as MenuIcon,
  Moon,
  Sun,
  User,
  User2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Topbar = ({ onMobileToggle }: { onMobileToggle: () => void }) => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, token, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.put(
        "/auth/change-password",
        {
          currentPassword: oldPassword,
          newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password changed successfully");

      setOldPassword("");
      setNewPassword("");
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.error || "Password Change failed");
    }
  };
  const ModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700 md:ml-0">
      <button className="md:hidden" onClick={onMobileToggle}>
        <MenuIcon size={24} className="text-gray-600 dark:text-gray-300" />
      </button>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
        Dashboard
      </h2>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-gray-600 dark:text-gray-300"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="rounded-full bg-gray-200 dark:bg-gray-700 p-2">
            <User className="text-gray-800 dark:text-white" size={20} />
          </Menu.Button>

          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
              <div className="px-1 py-1">
                <Menu.Item>
                  <p className=" flex w-full items-center rounded-md px-4 py-2 text-sm font-bold">
                    <User2 className="mr-2" size={16} />
                    {user?.name || "Guest"}
                  </p>
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-gray-100 dark:bg-gray-700" : ""
                      } group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                      onClick={() => setIsModalOpen(true)}
                    >
                      <Key className="mr-2" size={16} />
                      Change Password
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-gray-100 dark:bg-gray-700" : ""
                      } group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                      onClick={() => navigate("/2fa/setup")}
                    >
                      <Key className="mr-2" size={16} />
                      Enable Two-Factor
                    </button>
                  )}
                </Menu.Item>
                {user ? (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`${
                          active ? "bg-gray-100 dark:bg-gray-700" : ""
                        } group flex w-full items-center rounded-md px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                      >
                        <LogOut className="mr-2" size={16} />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                ) : null}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 py-3 rounded shadow w-full max-w-lg">
            <div className="bg-primary dark:bg-gray-700 text-white px-6 py-3 mb-4 rounded-t">
              <h2 className="text-lg font-semibold text-gray-50  mb-4">
                Change Password
              </h2>
            </div>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <form className="space-y-4" onSubmit={handleChangePassword}>
              <input
                type="password"
                placeholder="Old Password"
                className="w-full border border-gray-300 dark:bg-gray-900 border-b dark:border-gray-700 p-2 rounded"
                value={oldPassword}
                name="currentPassword"
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full border border-gray-300 dark:bg-gray-900 border-b dark:border-gray-700 p-2 rounded"
                value={newPassword}
                name="newPassword"
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={ModalClose}
                  className="bg-green-700 dark:bg-gray-600 text-white  px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button className="bg-primary hover:bg-orange-700 text-white px-4 py-2 rounded">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </header>
  );
};

export default Topbar;

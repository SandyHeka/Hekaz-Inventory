// Topbar.tsx
import { Key, LogOut, Menu as MenuIcon, Moon, Sun, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
const Topbar = ({ onMobileToggle }: { onMobileToggle: () => void }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700 md:ml-0">
      <button className="md:hidden" onClick={onMobileToggle}>
        <MenuIcon size={24}  className='text-gray-600 dark:text-gray-300'/>
      </button>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
      <div className='flex items-center gap-4'>
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
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                    >
                      <Key className="mr-2" size={16} />
                      Change Password
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                      }}
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } group flex w-full items-center rounded-md px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                    >
                      <LogOut className="mr-2" size={16} />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
     
    </header>
  );
};

export default Topbar;

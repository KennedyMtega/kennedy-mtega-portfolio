
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, LogOut, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardHeaderProps {
  user: any;
  onToggleSidebar: () => void;
  onSignOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onToggleSidebar, onSignOut }) => {
  const location = useLocation();
  const { toast } = useToast();

  // Get current page title based on route
  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard Overview';
    if (path === '/dashboard/projects') return 'Projects';
    if (path === '/dashboard/blog') return 'Blog Posts';
    if (path === '/dashboard/messages') return 'Messages';
    if (path === '/dashboard/analytics') return 'Analytics';
    if (path === '/dashboard/donations') return 'Donations';
    if (path === '/dashboard/settings') return 'Settings';
    return 'Dashboard';
  };

  const showNotifications = () => {
    toast({
      title: "No new notifications",
      description: "You're all caught up!",
    });
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-1 mr-3 text-gray-600 rounded-md lg:hidden dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {getCurrentPageTitle()}
        </h1>
      </div>
      <div className="flex items-center">
        <button
          onClick={showNotifications}
          className="p-1 mr-3 text-gray-600 rounded-md dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>
        <div className="text-sm text-gray-600 dark:text-gray-300 mr-4">
          {user?.email || 'mtegakennedy@gmail.com'}
        </div>
        <button 
          className="p-1 text-gray-600 rounded-md dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onSignOut}
          aria-label="Sign out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;

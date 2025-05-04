// Layout component for the dashboard with sidebar and main content area
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  BarChart3, 
  Settings, 
  DollarSign, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  X,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isLoading } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Projects', icon: <FolderKanban size={20} />, path: '/dashboard/projects' },
    { name: 'Blog', icon: <FileText size={20} />, path: '/dashboard/blog' },
    { name: 'Messages', icon: <MessageSquare size={20} />, path: '/dashboard/messages' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/dashboard/analytics' },
    { name: 'Donations', icon: <DollarSign size={20} />, path: '/dashboard/donations' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#191970] text-white transition-all duration-300 ease-in-out lg:relative lg:z-0 
                   ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
                   ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <Link
            to="/"
            className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'}`}
          >
            {collapsed ? (
              <span className="text-2xl font-bold">KM</span>
            ) : (
              <span className="text-xl font-bold">Kennedy Mtega</span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block text-white/80 hover:text-white"
          >
            {collapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-white/80 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 py-6 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${
                  collapsed ? 'justify-center' : 'justify-start'
                } px-3 py-3 ${
                  location.pathname === item.path 
                    ? 'text-white bg-white/20' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                } rounded-md`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <Link
            to="/"
            className={`flex items-center ${
              collapsed ? 'justify-center' : 'justify-start'
            } px-3 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-md`}
          >
            <Home size={20} />
            {!collapsed && <span className="ml-3">Back to Site</span>}
          </Link>
          <button
            onClick={signOut}
            className={`flex items-center ${
              collapsed ? 'justify-center' : 'justify-start'
            } w-full px-3 py-3 mt-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md`}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader 
          user={user}
          onToggleSidebar={() => setMobileOpen(true)}
          onSignOut={signOut}
        />

        <main className="flex-1 overflow-y-auto px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

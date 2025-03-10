
import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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
  Menu, 
  X,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!data.session) {
          navigate('/auth');
          return;
        }
        
        setUser(data.session.user);
      } catch (error: any) {
        toast({
          title: "Authentication error",
          description: error.message,
          variant: "destructive",
        });
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
        } else if (session) {
          setUser(session.user);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Projects', icon: <FolderKanban size={20} />, path: '/dashboard/projects' },
    { name: 'Blog', icon: <FileText size={20} />, path: '/dashboard/blog' },
    { name: 'Messages', icon: <MessageSquare size={20} />, path: '/dashboard/messages' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/dashboard/analytics' },
    { name: 'Donations', icon: <DollarSign size={20} />, path: '/dashboard/donations' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
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
                } px-3 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-md`}
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
            onClick={handleSignOut}
            className={`flex items-center ${
              collapsed ? 'justify-center' : 'justify-start'
            } w-full px-3 py-3 mt-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md`}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between h-16 px-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1 text-gray-600 rounded-md lg:hidden dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu size={24} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          </div>
          <div className="flex items-center">
            <div className="text-sm text-gray-600 dark:text-gray-300 mr-4">
              {user?.email}
            </div>
            <button 
              className="p-1 text-gray-600 rounded-md dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleSignOut}
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

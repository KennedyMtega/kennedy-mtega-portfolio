
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, LogOut, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DashboardHeaderProps {
  user: any;
  onToggleSidebar: () => void;
  onSignOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onToggleSidebar, onSignOut }) => {
  const location = useLocation();
  const { toast } = useToast();
  const [notificationCount, setNotificationCount] = useState(0);

  // Fetch notification count on load
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Get unread messages count
        const { data: unreadMessages, error: messagesError } = await supabase
          .from('contact_messages')
          .select('id')
          .eq('is_read', false);
          
        // Get pending donations count
        const { data: pendingDonations, error: donationsError } = await supabase
          .from('donations')
          .select('id')
          .eq('status', 'pending');
          
        if (messagesError) throw messagesError;
        if (donationsError) throw donationsError;
        
        // Calculate total notifications
        const totalNotifications = 
          (unreadMessages?.length || 0) + 
          (pendingDonations?.length || 0);
          
        setNotificationCount(totalNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchNotifications();
    
    // Set up real-time listeners for notification updates
    const messagesSubscription = supabase
      .channel('public:messages_notifications')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contact_messages' }, 
        fetchNotifications
      )
      .subscribe();
      
    const donationsSubscription = supabase
      .channel('public:donations_notifications')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'donations' }, 
        fetchNotifications
      )
      .subscribe();
    
    // Cleanup listeners on unmount
    return () => {
      supabase.removeChannel(messagesSubscription);
      supabase.removeChannel(donationsSubscription);
    };
  }, []);

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
    
    // For dynamic routes
    if (path.startsWith('/dashboard/projects/edit/')) return 'Edit Project';
    if (path === '/dashboard/projects/new') return 'New Project';
    if (path.startsWith('/dashboard/blog/edit/')) return 'Edit Blog Post';
    if (path === '/dashboard/blog/new') return 'New Blog Post';
    
    return 'Dashboard';
  };

  const showNotifications = () => {
    if (notificationCount === 0) {
      toast({
        title: "No new notifications",
        description: "You're all caught up!",
      });
    } else {
      toast({
        title: `${notificationCount} new notifications`,
        description: "You have unread messages and pending donations to review.",
      });
    }
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
          className="p-1 mr-3 text-gray-600 rounded-md dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
        <div className="text-sm text-gray-600 dark:text-gray-300 mr-4 hidden md:block">
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

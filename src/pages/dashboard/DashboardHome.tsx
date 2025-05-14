
// Dashboard home page with overview statistics and quick actions
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Settings as SettingsType, Donation } from '@/types/dashboard'; 
import { Folder, Eye, Mail, FileText, Settings, DollarSign, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    projects: 0,
    posts: 0,
    messages: 0,
    settings: null as SettingsType | null
  });
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [notifications, setNotifications] = useState<{message: string, type: string}[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
    fetchRecentDonations();
    fetchNotifications();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch projects count
      const { count: projectsCount, error: projectsError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      // Fetch blog posts count  
      const { count: postsCount, error: postsError } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });

      // Fetch unread messages count
      const { data: unreadMessages, error: unreadError } = await supabase
        .from('contact_messages')
        .select('id')
        .eq('is_read', false);

      // Fetch settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (projectsError) throw projectsError;
      if (postsError) throw postsError;
      if (unreadError) throw unreadError;
      if (settingsError) throw settingsError;

      setStats({
        projects: projectsCount || 0,
        posts: postsCount || 0,
        messages: unreadMessages?.length || 0,
        settings: settingsData as SettingsType
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error loading dashboard data",
        description: "There was an error loading the dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching recent donations:', error);
    }
  };

  const fetchNotifications = async () => {
    // This would typically fetch from a notifications table or API
    // For now, let's simulate some notifications based on app data
    try {
      const notificationsList = [];
      
      // Check for unread messages
      const { data: unreadMessages } = await supabase
        .from('contact_messages')
        .select('id, created_at')
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (unreadMessages && unreadMessages.length > 0) {
        notificationsList.push({
          message: `You have ${unreadMessages.length} unread messages`,
          type: 'message'
        });
      }
      
      // Check for recent donations
      const { data: recentDonations } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (recentDonations && recentDonations.length > 0) {
        notificationsList.push({
          message: `You have ${recentDonations.length} pending donations to process`,
          type: 'donation'
        });
      }
      
      // Add a generic notification if there are no other notifications
      if (notificationsList.length === 0) {
        notificationsList.push({
          message: 'Welcome to your dashboard! Everything is up to date.',
          type: 'info'
        });
      }
      
      setNotifications(notificationsList);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    } else if (currency === 'TZS') {
      return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS' }).format(amount);
    }
    return `${amount} ${currency}`;
  };

  const convertToTZS = (amount: number) => {
    // Using a fixed rate for illustration; in a real app, you'd use an API
    const exchangeRate = 2500; // 1 USD = 2500 TZS (example rate)
    return amount * exchangeRate;
  };

  return (
    <DashboardLayout>
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Projects Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <span className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-3">
                  <Folder className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </span>
                <h2 className="text-lg font-semibold">Projects</h2>
              </div>
              <p className="text-3xl font-bold mb-2">{stats.projects}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total projects
                </span>
                <Link
                  to="/dashboard/projects"
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  <span>Manage</span>
                  <Eye className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Blog Posts Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <span className="p-2 bg-green-100 dark:bg-green-900 rounded-full mr-3">
                  <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                </span>
                <h2 className="text-lg font-semibold">Blog Posts</h2>
              </div>
              <p className="text-3xl font-bold mb-2">{stats.posts}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Published articles
                </span>
                <Link
                  to="/dashboard/blog"
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  <span>Manage</span>
                  <Eye className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Messages Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <span className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full mr-3">
                  <Mail className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </span>
                <h2 className="text-lg font-semibold">Unread Messages</h2>
              </div>
              <p className="text-3xl font-bold mb-2">{stats.messages}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Awaiting response
                </span>
                <Link
                  to="/dashboard/messages"
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  <span>View</span>
                  <Eye className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Donations Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <span className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full mr-3">
                  <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </span>
                <h2 className="text-lg font-semibold">Donations</h2>
              </div>
              <p className="text-3xl font-bold mb-2">{donations.length}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Recent donations
                </span>
                <Link
                  to="/dashboard/donations"
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  <span>View</span>
                  <Eye className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No new notifications</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <div key={index} className="flex items-start p-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div className={`p-2 rounded-full mr-3 ${
                        notification.type === 'message' 
                          ? 'bg-blue-100 dark:bg-blue-900' 
                          : notification.type === 'donation' 
                          ? 'bg-green-100 dark:bg-green-900'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        {notification.type === 'message' ? (
                          <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        ) : notification.type === 'donation' ? (
                          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Donations */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Recent Donations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {donations.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No recent donations</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b dark:border-gray-700">
                        <th className="pb-2 font-medium">Name</th>
                        <th className="pb-2 font-medium">Amount (USD)</th>
                        <th className="pb-2 font-medium">Amount (TZS)</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((donation) => (
                        <tr key={donation.id} className="border-b dark:border-gray-700 last:border-0">
                          <td className="py-3">{donation.name || 'Anonymous'}</td>
                          <td className="py-3">{formatCurrency(donation.amount, 'USD')}</td>
                          <td className="py-3">{formatCurrency(convertToTZS(donation.amount), 'TZS')}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              donation.status === 'completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : donation.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3">
                            {new Date(donation.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="mt-4 text-right">
                <Link 
                  to="/dashboard/donations" 
                  className="text-sm text-primary hover:underline inline-flex items-center"
                >
                  View all donations
                  <Eye className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/dashboard/projects"
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center"
              >
                <Folder className="h-5 w-5 mr-2 text-primary" />
                <span>Add New Project</span>
              </Link>
              <Link
                to="/dashboard/blog"
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center"
              >
                <FileText className="h-5 w-5 mr-2 text-primary" />
                <span>Write New Post</span>
              </Link>
              <Link
                to="/dashboard/messages"
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center"
              >
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <span>Check Messages</span>
              </Link>
              <Link
                to="/dashboard/settings"
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center"
              >
                <Settings className="h-5 w-5 mr-2 text-primary" />
                <span>Site Settings</span>
              </Link>
            </div>
          </div>

          {/* Site Status */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">Site Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">Last Updated</span>
                <span className="font-medium">
                  {stats.settings?.updated_at
                    ? new Date(stats.settings.updated_at).toLocaleDateString()
                    : 'Never'}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">Site Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                  Online
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default DashboardHome;

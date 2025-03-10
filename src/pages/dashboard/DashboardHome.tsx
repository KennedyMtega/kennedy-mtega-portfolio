import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Settings as SettingsType } from '@/types/dashboard'; 
import { Folder, Eye, Mail, FileText } from 'lucide-react';
import { Settings } from 'lucide-react';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    projects: 0,
    posts: 0,
    messages: 0,
    settings: null as SettingsType | null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        const { count: messagesCount, error: messagesError } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true })
          .eq('read', false);

        // Fetch settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('settings')
          .select('*')
          .single();

        if (projectsError) throw projectsError;
        if (postsError) throw postsError;
        if (messagesError) throw messagesError;
        if (settingsError) throw settingsError;

        setStats({
          projects: projectsCount || 0,
          posts: postsCount || 0,
          messages: messagesCount || 0,
          settings: settingsData as SettingsType
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const dashboardContent = (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/dashboard/projects/new"
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center"
              >
                <Folder className="h-5 w-5 mr-2 text-primary" />
                <span>Add New Project</span>
              </Link>
              <Link
                to="/dashboard/blog/new"
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
    </div>
  );

  return (
    <DashboardLayout>
      {dashboardContent}
    </DashboardLayout>
  );
};

export default DashboardHome;

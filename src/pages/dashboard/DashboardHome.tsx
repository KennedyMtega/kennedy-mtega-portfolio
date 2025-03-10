
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Eye, Calendar, FileText, FolderKanban, DollarSign, MessageSquare } from 'lucide-react';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    projects: 0,
    blogPosts: 0,
    pageViews: 0,
    donations: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch statistics from Supabase
        const [projectsRes, blogPostsRes, pageViewsRes, donationsRes, messagesRes] = await Promise.all([
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
          supabase.from('page_views').select('id', { count: 'exact', head: true }),
          supabase.from('donations').select('id', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          projects: projectsRes.count || 0,
          blogPosts: blogPostsRes.count || 0,
          pageViews: pageViewsRes.count || 0,
          donations: donationsRes.count || 0,
          messages: messagesRes.count || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.projects,
      icon: <FolderKanban size={24} className="text-blue-500" />,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    {
      title: 'Blog Posts',
      value: stats.blogPosts,
      icon: <FileText size={24} className="text-emerald-500" />,
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-700 dark:text-emerald-300',
    },
    {
      title: 'Page Views',
      value: stats.pageViews,
      icon: <Eye size={24} className="text-indigo-500" />,
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      textColor: 'text-indigo-700 dark:text-indigo-300',
    },
    {
      title: 'Donations',
      value: stats.donations,
      icon: <DollarSign size={24} className="text-amber-500" />,
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-700 dark:text-amber-300',
    },
    {
      title: 'Unread Messages',
      value: stats.messages,
      icon: <MessageSquare size={24} className="text-rose-500" />,
      bgColor: 'bg-rose-50 dark:bg-rose-900/20',
      textColor: 'text-rose-700 dark:text-rose-300',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {statCards.map((card, index) => (
              <div
                key={index}
                className={`${card.bgColor} p-6 rounded-lg shadow-sm flex flex-col transition-transform duration-200 hover:transform hover:scale-105`}
              >
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-sm">
                    {card.icon}
                  </div>
                  <span className={`text-3xl font-bold ${card.textColor}`}>
                    {card.value}
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  {card.title}
                </h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Activity
                </h2>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {stats.projects + stats.blogPosts + stats.messages > 0 ? (
                  <div className="text-center py-10 px-4">
                    <p className="text-gray-500 dark:text-gray-400">
                      Your portfolio is looking great! Start adding more projects and blog posts to showcase your work.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-10 px-4">
                    <p className="text-gray-500 dark:text-gray-400">
                      Welcome to your dashboard! Start by adding your first project or blog post.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Quick Actions
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="/dashboard/projects/new"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <FolderKanban className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Add Project</span>
                </a>
                <a
                  href="/dashboard/blog/new"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <FileText className="w-8 h-8 text-emerald-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Write Blog Post</span>
                </a>
                <a
                  href="/dashboard/messages"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <MessageSquare className="w-8 h-8 text-rose-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Check Messages</span>
                </a>
                <a
                  href="/dashboard/settings"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Settings className="w-8 h-8 text-gray-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Settings</span>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;

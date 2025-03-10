
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { Files, Eye, FolderKanban, MessageCircle, BarChart2, Settings as SettingsIcon } from 'lucide-react';
import { Settings } from '@/types/dashboard';

const DashboardHome = () => {
  const [counts, setCounts] = useState({
    projects: 0,
    blogPosts: 0,
    messages: 0,
    pageViews: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCounts();
  }, []);
  
  const fetchCounts = async () => {
    try {
      setLoading(true);
      const [projectsResponse, postsResponse, messagesResponse, viewsResponse] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('page_views').select('id', { count: 'exact', head: true })
      ]);
      
      setCounts({
        projects: projectsResponse.count || 0,
        blogPosts: postsResponse.count || 0,
        messages: messagesResponse.count || 0,
        pageViews: viewsResponse.count || 0
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard 
            title="Projects" 
            count={counts.projects} 
            loading={loading}
            icon={<FolderKanban size={24} />}
            linkTo="/dashboard/projects"
            color="bg-blue-500"
          />
          
          <DashboardCard 
            title="Blog Posts" 
            count={counts.blogPosts} 
            loading={loading}
            icon={<Files size={24} />}
            linkTo="/dashboard/blog"
            color="bg-green-500"
          />
          
          <DashboardCard 
            title="Messages" 
            count={counts.messages} 
            loading={loading}
            icon={<MessageCircle size={24} />}
            linkTo="/dashboard/messages"
            color="bg-yellow-500"
          />
          
          <DashboardCard 
            title="Page Views" 
            count={counts.pageViews} 
            loading={loading}
            icon={<BarChart2 size={24} />}
            linkTo="/dashboard/analytics"
            color="bg-purple-500"
          />
        </div>
        
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No recent activity to display
                </p>
              </div>
            </div>
            
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <QuickActionCard
                  title="New Project"
                  description="Add a new project to your portfolio"
                  icon={<FolderKanban size={20} />}
                  linkTo="/dashboard/projects?new=true"
                  color="bg-blue-500"
                />
                
                <QuickActionCard
                  title="New Blog Post"
                  description="Create a new blog article"
                  icon={<Files size={20} />}
                  linkTo="/dashboard/blog?new=true"
                  color="bg-green-500"
                />
                
                <QuickActionCard
                  title="Settings"
                  description="Update your site settings"
                  icon={<SettingsIcon size={20} />}
                  linkTo="/dashboard/settings"
                  color="bg-gray-500"
                />
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Site Overview</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated
                  </p>
                  <p className="font-medium">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Featured projects
                  </p>
                  <p className="font-medium">
                    Loading...
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Published blog posts
                  </p>
                  <p className="font-medium">
                    Loading...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

interface DashboardCardProps {
  title: string;
  count: number;
  loading: boolean;
  icon: React.ReactNode;
  linkTo: string;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  count, 
  loading, 
  icon, 
  linkTo, 
  color 
}) => {
  return (
    <Link to={linkTo} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-border hover:border-primary transition-colors">
        <div className="flex items-center">
          <div className={`${color} text-white p-3 rounded-full mr-4`}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-2xl font-bold mt-1">
              {loading ? 
                <span className="inline-block w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span> 
                : count
              }
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  color: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ 
  title, 
  description, 
  icon, 
  linkTo, 
  color 
}) => {
  return (
    <Link to={linkTo} className="block">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-border hover:border-primary transition-colors">
        <div className="flex items-center mb-2">
          <div className={`${color} text-white p-2 rounded-full mr-3`}>
            {icon}
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default DashboardHome;

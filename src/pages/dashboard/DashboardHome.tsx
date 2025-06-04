

// Dashboard home page with overview statistics and quick actions
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Settings as SettingsType } from '@/types/dashboard'; 
import { Folder, Eye, Mail, FileText, Settings, DollarSign, Briefcase, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    projects: 0,
    posts: 0,
    messages: 0,
    services: 0,
    servicePurchases: 0,
    donations: {
      totalUSD: 0,
      totalTZS: 0,
      count: 0
    },
    settings: null as SettingsType | null
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Use useCallback to prevent unnecessary re-renders
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel for better performance
      const [
        projectsResponse, 
        postsResponse, 
        messagesResponse, 
        settingsResponse, 
        donationsResponse,
        servicesResponse,
        servicePurchasesResponse
      ] = await Promise.all([
        // Fetch projects count
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        
        // Fetch blog posts count  
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        
        // Fetch unread messages count
        supabase.from('contact_messages').select('id').eq('is_read', false),
        
        // Fetch settings
        supabase.from('settings').select('*').maybeSingle(),
        
        // Fetch donations
        supabase.from('donations').select('amount, currency'),

        // Fetch active services count
        supabase.from('services').select('*', { count: 'exact', head: true }).eq('is_active', true),

        // Fetch service purchases count
        supabase.from('service_purchases').select('*', { count: 'exact', head: true })
      ]);

      // Handle any errors
      if (projectsResponse.error) throw projectsResponse.error;
      if (postsResponse.error) throw postsResponse.error;
      if (messagesResponse.error) throw messagesResponse.error;
      if (settingsResponse.error) throw settingsResponse.error;
      if (donationsResponse.error) throw donationsResponse.error;
      if (servicesResponse.error) throw servicesResponse.error;
      if (servicePurchasesResponse.error) throw servicePurchasesResponse.error;
      
      // Process donation data
      let totalUSD = 0;
      let totalTZS = 0;
      
      donationsResponse.data.forEach(donation => {
        if (donation.currency === 'USD') {
          totalUSD += parseFloat(donation.amount.toString());
        } else if (donation.currency === 'TZS') {
          totalTZS += parseFloat(donation.amount.toString());
        }
      });

      setStats({
        projects: projectsResponse.count || 0,
        posts: postsResponse.count || 0,
        messages: messagesResponse.data.length || 0,
        services: servicesResponse.count || 0,
        servicePurchases: servicePurchasesResponse.count || 0,
        donations: {
          totalUSD,
          totalTZS,
          count: donationsResponse.data.length
        },
        settings: settingsResponse.data as SettingsType
      });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Data fetch error",
        description: "Could not retrieve dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time listeners for updates
    const projectsSubscription = supabase
      .channel('public:projects')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' }, 
        fetchDashboardData
      )
      .subscribe();
      
    const postsSubscription = supabase
      .channel('public:blog_posts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'blog_posts' }, 
        fetchDashboardData
      )
      .subscribe();
      
    const messagesSubscription = supabase
      .channel('public:contact_messages')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contact_messages' }, 
        fetchDashboardData
      )
      .subscribe();
      
    const donationsSubscription = supabase
      .channel('public:donations')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'donations' }, 
        fetchDashboardData
      )
      .subscribe();

    const servicesSubscription = supabase
      .channel('public:services')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'services' }, 
        fetchDashboardData
      )
      .subscribe();

    const servicePurchasesSubscription = supabase
      .channel('public:service_purchases')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'service_purchases' }, 
        fetchDashboardData
      )
      .subscribe();
    
    // Clean up subscriptions on component unmount
    return () => {
      supabase.removeChannel(projectsSubscription);
      supabase.removeChannel(postsSubscription);
      supabase.removeChannel(messagesSubscription);
      supabase.removeChannel(donationsSubscription);
      supabase.removeChannel(servicesSubscription);
      supabase.removeChannel(servicePurchasesSubscription);
    };
  }, [fetchDashboardData]);

  // Format currency helper function
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <DashboardLayout>
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

            {/* Services Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <span className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full mr-3">
                  <Briefcase className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </span>
                <h2 className="text-lg font-semibold">Services</h2>
              </div>
              <p className="text-3xl font-bold mb-2">{stats.services}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Active services
                </span>
                <Link
                  to="/dashboard/services"
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  <span>Manage</span>
                  <Eye className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Service Orders Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <span className="p-2 bg-teal-100 dark:bg-teal-900 rounded-full mr-3">
                  <ShoppingCart className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </span>
                <h2 className="text-lg font-semibold">Service Orders</h2>
              </div>
              <p className="text-3xl font-bold mb-2">{stats.servicePurchases}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total requests
                </span>
                <Link
                  to="/dashboard/service-purchases"
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  <span>View</span>
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
              <div className="space-y-1 mb-2">
                <p className="text-lg font-bold">{formatCurrency(stats.donations.totalUSD, 'USD')}</p>
                <p className="text-md font-medium">{formatCurrency(stats.donations.totalTZS, 'TZS')}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {stats.donations.count} total donations
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

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Link
                to="/dashboard/projects"
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center"
              >
                <Folder className="h-5 w-5 mr-2 text-primary" />
                <span>Add New Project</span>
              </Link>
              <Link
                to="/dashboard/services/new"
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center"
              >
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                <span>Add New Service</span>
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

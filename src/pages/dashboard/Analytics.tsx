// Analytics dashboard with charts and visitor statistics
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PageView } from '@/types/dashboard';

const DashboardAnalytics = () => {
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [pageData, setPageData] = useState<any[]>([]);

  useEffect(() => {
    fetchPageViews();
  }, []);

  const fetchPageViews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_views')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPageViews(data || []);
      
      // Process data for charts
      processDeviceData(data || []);
      processPageData(data || []);
    } catch (err: any) {
      console.error('Error fetching page views:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const processDeviceData = (data: PageView[]) => {
    const deviceCounts: Record<string, number> = {};
    
    data.forEach(view => {
      const device = view.device_type || 'unknown';
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });
    
    const chartData = Object.keys(deviceCounts).map(device => ({
      name: device.charAt(0).toUpperCase() + device.slice(1),
      value: deviceCounts[device]
    }));
    
    setDeviceData(chartData);
  };

  const processPageData = (data: PageView[]) => {
    const pageCounts: Record<string, number> = {};
    
    data.forEach(view => {
      const page = view.page_path;
      pageCounts[page] = (pageCounts[page] || 0) + 1;
    });
    
    const chartData = Object.keys(pageCounts).map(page => ({
      name: page === '/' ? 'Home' : page.replace('/', '').charAt(0).toUpperCase() + page.replace('/', '').slice(1),
      views: pageCounts[page]
    }));
    
    // Sort by views (descending)
    chartData.sort((a, b) => b.views - a.views);
    
    // Take top 10
    setPageData(chartData.slice(0, 10));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
        
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
            <p>{error}</p>
            <button 
              onClick={fetchPageViews} 
              className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900 rounded-md hover:bg-red-200 dark:hover:bg-red-800"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
              <h2 className="text-lg font-semibold mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Page Views</p>
                  <p className="text-3xl font-bold">{pageViews.length}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Unique Pages</p>
                  <p className="text-3xl font-bold">{pageData.length}</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Device Types</p>
                  <p className="text-3xl font-bold">{deviceData.length}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
                <h2 className="text-lg font-semibold mb-4">Most Visited Pages</h2>
                {pageData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={pageData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="views" fill="#8884d8" name="Page Views" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-10">No page data available</p>
                )}
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
                <h2 className="text-lg font-semibold mb-4">Device Types</h2>
                {deviceData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-10">No device data available</p>
                )}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
              <h2 className="text-lg font-semibold mb-4">Recent Page Views</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Page</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Device</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Referrer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {pageViews.slice(0, 10).map((view) => (
                      <tr key={view.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{view.page_path}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{view.device_type || 'Unknown'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{view.referrer || 'Direct'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(view.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardAnalytics;

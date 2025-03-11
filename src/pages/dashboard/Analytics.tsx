
import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';

const DashboardAnalytics = () => {
  const [visitData, setVisitData] = useState([]);
  const [pageViewData, setPageViewData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch page views from Supabase
      const { data: pageViews, error: pageViewsError } = await supabase
        .from('page_views')
        .select('*');
        
      if (pageViewsError) throw pageViewsError;
      
      // Process page views by month for the visit data
      const monthlyData = processMonthlyVisits(pageViews || []);
      setVisitData(monthlyData);
      
      // Process page views by page path
      const pathData = processPagePaths(pageViews || []);
      setPageViewData(pathData);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Process page views into monthly visit data
  const processMonthlyVisits = (pageViews) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthCounts = Array(12).fill(0);
    
    pageViews.forEach(view => {
      const date = new Date(view.created_at);
      const month = date.getMonth();
      monthCounts[month]++;
    });
    
    return months.map((name, index) => ({
      name,
      visits: monthCounts[index]
    }));
  };
  
  // Process page views by page path
  const processPagePaths = (pageViews) => {
    const pathCounts = {};
    
    pageViews.forEach(view => {
      const path = view.page_path;
      // Extract the main page (e.g., '/blog/post-1' becomes 'blog')
      const mainPath = path.split('/')[1] || 'home';
      
      if (!pathCounts[mainPath]) {
        pathCounts[mainPath] = 0;
      }
      pathCounts[mainPath]++;
    });
    
    // Convert to array format for charts
    return Object.keys(pathCounts).map(name => ({
      name: name === '' ? 'Home' : name.charAt(0).toUpperCase() + name.slice(1),
      views: pathCounts[name]
    }));
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
                <h2 className="text-lg font-semibold mb-4">Website Visits</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={visitData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="visits" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
                <h2 className="text-lg font-semibold mb-4">Page Views</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={pageViewData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
              <h2 className="text-lg font-semibold mb-4">Traffic Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Visits</p>
                  <p className="text-2xl font-bold">
                    {visitData.reduce((sum, month) => sum + month.visits, 0)}
                  </p>
                  <p className="text-xs text-green-500">↑ 12% from last month</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Time on Site</p>
                  <p className="text-2xl font-bold">3:24</p>
                  <p className="text-xs text-green-500">↑ 8% from last month</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Bounce Rate</p>
                  <p className="text-2xl font-bold">42%</p>
                  <p className="text-xs text-red-500">↑ 3% from last month</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">New Visitors</p>
                  <p className="text-2xl font-bold">65%</p>
                  <p className="text-xs text-green-500">↑ 5% from last month</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardAnalytics;

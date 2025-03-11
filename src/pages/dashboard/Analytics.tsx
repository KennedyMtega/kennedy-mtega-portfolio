
import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardAnalytics = () => {
  // Mock data for analytics
  const visitData = [
    { name: 'Jan', visits: 65 },
    { name: 'Feb', visits: 59 },
    { name: 'Mar', visits: 80 },
    { name: 'Apr', visits: 81 },
    { name: 'May', visits: 56 },
    { name: 'Jun', visits: 55 },
    { name: 'Jul', visits: 40 }
  ];

  const pageViewData = [
    { name: 'Home', views: 4000 },
    { name: 'Projects', views: 3000 },
    { name: 'Blog', views: 2000 },
    { name: 'Contact', views: 1000 }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

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
            <p className="text-2xl font-bold">8,942</p>
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
    </div>
  );
};

export default DashboardAnalytics;

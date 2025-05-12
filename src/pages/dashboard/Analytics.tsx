
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Calendar,
  RefreshCw,
  TrendingUp,
  Globe,
  Smartphone,
  Laptop,
  ExternalLink,
  MousePointer,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface DeviceStatsItem {
  device_type: string;
  count: number;
}

interface PopularPageItem {
  page_path: string;
  view_count: number;
}

interface ReferrerStatsItem {
  referrer: string;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B'];

const DeviceIcon = ({ device }: { device: string }) => {
  const deviceLower = device?.toLowerCase() || '';
  
  if (deviceLower.includes('mobile') || deviceLower.includes('phone')) {
    return <Smartphone className="mr-2 h-4 w-4" />;
  } else if (deviceLower.includes('tablet')) {
    return <Tablet className="mr-2 h-4 w-4" />;
  } else if (deviceLower.includes('desktop') || deviceLower.includes('laptop')) {
    return <Laptop className="mr-2 h-4 w-4" />;
  } else {
    return <Globe className="mr-2 h-4 w-4" />;
  }
};

const DashboardAnalytics = () => {
  const [deviceStats, setDeviceStats] = useState<DeviceStatsItem[]>([]);
  const [popularPages, setPopularPages] = useState<PopularPageItem[]>([]);
  const [referrerStats, setReferrerStats] = useState<ReferrerStatsItem[]>([]);
  const [loading, setLoading] = useState({
    devices: true,
    pages: true,
    referrers: true,
  });
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAllStats();
  }, [dateRange]);

  const fetchAllStats = async () => {
    fetchDeviceStats();
    fetchPopularPages();
    fetchReferrerStats();
  };

  const fetchDeviceStats = async () => {
    try {
      setLoading(prev => ({ ...prev, devices: true }));
      
      const { data, error } = await supabase.rpc('get_device_stats');
      
      if (error) throw error;
      
      console.log("Analytics: Device stats fetched:", data);
      
      // Handle null or missing device types
      const processedData = (data || []).map((item: any) => ({
        device_type: item.device_type || 'Unknown',
        count: item.count,
      }));
      
      setDeviceStats(processedData);
    } catch (err: any) {
      console.error('Error fetching device stats:', err);
      toast({
        title: "Error",
        description: `Failed to load device statistics: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, devices: false }));
    }
  };

  const fetchPopularPages = async () => {
    try {
      setLoading(prev => ({ ...prev, pages: true }));
      
      const { data, error } = await supabase.rpc('get_popular_pages', { limit_count: 10 });
      
      if (error) throw error;
      
      console.log("Analytics: Popular pages fetched:", data);
      
      setPopularPages(data || []);
    } catch (err: any) {
      console.error('Error fetching popular pages:', err);
      toast({
        title: "Error",
        description: `Failed to load page statistics: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, pages: false }));
    }
  };

  const fetchReferrerStats = async () => {
    try {
      setLoading(prev => ({ ...prev, referrers: true }));
      
      const { data, error } = await supabase.rpc('get_referrer_stats', { limit_count: 10 });
      
      if (error) throw error;
      
      console.log("Analytics: Referrer stats fetched:", data);
      
      // Process data to handle null referrers and clean URLs
      const processedData = (data || []).map((item: any) => ({
        referrer: item.referrer ? cleanReferrerUrl(item.referrer) : 'Direct / None',
        count: item.count,
      }));
      
      setReferrerStats(processedData);
    } catch (err: any) {
      console.error('Error fetching referrer stats:', err);
      toast({
        title: "Error",
        description: `Failed to load referrer statistics: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, referrers: false }));
    }
  };

  // Helper to clean referrer URLs for display
  const cleanReferrerUrl = (url: string) => {
    try {
      if (!url) return 'Direct / None';
      
      // If it's not a URL, return as is
      if (!url.startsWith('http')) return url;
      
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return url; // If URL parsing fails, return original
    }
  };

  const formatPath = (path: string) => {
    if (path === '/') return 'Home';
    return path.replace(/^\/|\/$/g, '').replace(/-/g, ' ');
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Track website traffic and performance
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fetchAllStats}
              className="px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 flex items-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-3">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Time Period
                </p>
                <p className="font-semibold">
                  Last 30 Days
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mr-3">
                <MousePointer className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Views
                </p>
                <p className="font-semibold">
                  {popularPages.reduce((sum, page) => sum + page.view_count, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full mr-3">
                <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Top Referrer
                </p>
                <p className="font-semibold">
                  {referrerStats.length > 0 ? referrerStats[0]?.referrer : 'Loading...'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full mr-3">
                <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Time Range
                </p>
                <p className="font-semibold">
                  {format(dateRange.start, 'MMM d')} - {format(dateRange.end, 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-border">
            <h2 className="text-lg font-semibold mb-4">Popular Pages</h2>
            {loading.pages ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={popularPages}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="page_path" 
                      type="category" 
                      width={100}
                      tick={({ x, y, payload }) => (
                        <text x={x} y={y} dy={3} textAnchor="end" fill="#666" fontSize={12}>
                          {formatPath(payload.value)}
                        </text>
                      )}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} views`, 'Views']}
                      labelFormatter={(value) => `Page: ${formatPath(value)}`}
                    />
                    <Legend />
                    <Bar dataKey="view_count" name="Page Views" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-border">
            <h2 className="text-lg font-semibold mb-4">Device Breakdown</h2>
            {loading.devices ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      dataKey="count"
                      nameKey="device_type"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {deviceStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [`${value} views`, props.payload.device_type]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-border">
          <h2 className="text-lg font-semibold mb-4">Top Referrers</h2>
          {loading.referrers ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : referrerStats.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No referrer data available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Referrer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Visitors
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {referrerStats.map((referrer, index) => {
                    const total = referrerStats.reduce((sum, ref) => sum + ref.count, 0);
                    const percentage = (referrer.count / total * 100).toFixed(1);
                    
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <ExternalLink className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{referrer.referrer}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{referrer.count}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full mr-3 h-2.5">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span>{percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

// Missing Tablet component definition
const Tablet = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className || "h-6 w-6"}
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
  );
};

export default DashboardAnalytics;

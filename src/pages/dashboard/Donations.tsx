
// Donation management and tracking interface
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Donation } from '@/types/dashboard';
import { 
  Wallet, 
  RefreshCw, 
  DollarSign, 
  PieChart, 
  Calendar, 
  ArrowUpDown,
  Search,
  Check,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const DashboardDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalAmountUSD: 0,
    totalAmountTZS: 0,
    completedCount: 0,
    pendingCount: 0,
    averageDonationUSD: 0,
    averageDonationTZS: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Donation | '';
    direction: 'ascending' | 'descending';
  }>({ key: '', direction: 'ascending' });
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  
  const { toast } = useToast();

  // Use useCallback to prevent unnecessary re-renders
  const fetchDonations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Donations: Fetching all donations");
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log(`Donations: Fetched ${data?.length} donations`);
      
      if (data) {
        setDonations(data);
        setFilteredDonations(data);
        
        // Calculate stats
        calculateStats(data);
        
        // Generate monthly data for chart
        generateMonthlyData(data);
      }
      
    } catch (err: any) {
      console.error('Error fetching donations:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: `Failed to load donations: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const calculateStats = useCallback((donationData: Donation[]) => {
    const completed = donationData.filter(d => d.status === 'completed');
    const pending = donationData.filter(d => d.status === 'pending');
    
    // Calculate totals by currency
    let totalUSD = 0;
    let totalTZS = 0;
    let countUSD = 0;
    let countTZS = 0;
    
    donationData.forEach(donation => {
      const amount = parseFloat(donation.amount as any);
      
      if (donation.currency === 'USD') {
        totalUSD += amount;
        countUSD++;
      } else if (donation.currency === 'TZS') {
        totalTZS += amount;
        countTZS++;
      }
    });
    
    setStats({
      totalAmountUSD: totalUSD,
      totalAmountTZS: totalTZS,
      completedCount: completed.length,
      pendingCount: pending.length,
      averageDonationUSD: countUSD > 0 ? totalUSD / countUSD : 0,
      averageDonationTZS: countTZS > 0 ? totalTZS / countTZS : 0
    });
  }, []);

  const generateMonthlyData = useCallback((donationData: Donation[]) => {
    // Group donations by month
    const monthlyGroups: Record<string, { month: string, amountUSD: number, amountTZS: number, count: number }> = {};
    
    donationData.forEach(donation => {
      const date = new Date(donation.created_at);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      
      if (!monthlyGroups[monthYear]) {
        monthlyGroups[monthYear] = { month: monthName, amountUSD: 0, amountTZS: 0, count: 0 };
      }
      
      const amount = parseFloat(donation.amount as any);
      
      if (donation.currency === 'USD') {
        monthlyGroups[monthYear].amountUSD += amount;
      } else if (donation.currency === 'TZS') {
        monthlyGroups[monthYear].amountTZS += amount;
      }
      
      monthlyGroups[monthYear].count += 1;
    });
    
    // Convert to array and sort by date
    const monthlyArray = Object.values(monthlyGroups);
    monthlyArray.sort((a, b) => {
      // Extract year and month for sorting
      const [aMonth, aYear] = a.month.split(' ');
      const [bMonth, bYear] = b.month.split(' ');
      
      const aDate = new Date(`${aMonth} 20${aYear}`);
      const bDate = new Date(`${bMonth} 20${bYear}`);
      
      return aDate.getTime() - bDate.getTime();
    });
    
    // Get last 6 months only
    const last6Months = monthlyArray.slice(-6);
    setMonthlyData(last6Months);
  }, []);

  useEffect(() => {
    fetchDonations();
    
    // Set up real-time listener for donation changes
    const donationsSubscription = supabase
      .channel('public:donations:changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'donations' }, 
        fetchDonations
      )
      .subscribe();
      
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(donationsSubscription);
    };
  }, [fetchDonations]);

  useEffect(() => {
    // Apply filters and search to donations
    let result = [...donations];
    
    // Apply status filter
    if (filterStatus) {
      result = result.filter(donation => donation.status === filterStatus);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        donation => 
          donation.name?.toLowerCase().includes(query) ||
          donation.email?.toLowerCase().includes(query) ||
          donation.amount.toString().includes(query) ||
          donation.currency.toLowerCase().includes(query) ||
          donation.status.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Donation];
        const bValue = b[sortConfig.key as keyof Donation];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredDonations(result);
  }, [donations, searchQuery, sortConfig, filterStatus]);

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Handle column sorting
  const requestSort = (key: keyof Donation) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const updateDonationStatus = async (id: string, status: 'completed' | 'pending' | 'failed') => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      // No need to update local state as the real-time subscription will trigger a refresh
      
      toast({
        title: "Status Updated",
        description: `Donation status changed to ${status}`,
      });
    } catch (err: any) {
      console.error('Error updating donation status:', err);
      toast({
        title: "Error",
        description: `Failed to update status: ${err.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Donations</h1>
            <p className="text-muted-foreground">
              Manage and track donation activity
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fetchDonations}
              className="px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 flex items-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mr-3">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Donations (USD)</p>
                <p className="font-semibold">{formatCurrency(stats.totalAmountUSD, 'USD')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mr-3">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Donations (TZS)</p>
                <p className="font-semibold">{formatCurrency(stats.totalAmountTZS, 'TZS')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-3">
                <Check className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="font-semibold">{stats.completedCount} donations</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full mr-3">
                <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="font-semibold">{stats.pendingCount} donations</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Monthly Donations Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-border mb-6">
          <h2 className="text-lg font-semibold mb-4">Donation Trend</h2>
          <div className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : monthlyData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No donation data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="amountUSD" name="USD Amount" fill="#8884d8" />
                  <Bar yAxisId="left" dataKey="amountTZS" name="TZS Amount" fill="#4a82bd" />
                  <Bar yAxisId="right" dataKey="count" name="# of Donations" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Donations List */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-border">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
            <h2 className="text-lg font-semibold">All Donations</h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search donations..."
                  className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 rounded-md border border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setFilterStatus(null)}
                  className={`px-3 py-1 text-xs rounded-md ${
                    filterStatus === null 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`px-3 py-1 text-xs rounded-md ${
                    filterStatus === 'completed' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-3 py-1 text-xs rounded-md ${
                    filterStatus === 'pending' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilterStatus('failed')}
                  className={`px-3 py-1 text-xs rounded-md ${
                    filterStatus === 'failed' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  Failed
                </button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
              <p>{error}</p>
              <button 
                onClick={fetchDonations} 
                className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900 rounded-md hover:bg-red-200 dark:hover:bg-red-800"
              >
                Try Again
              </button>
            </div>
          ) : filteredDonations.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || filterStatus 
                  ? "No donations match your search criteria" 
                  : "No donations received yet"}
              </p>
              {(searchQuery || filterStatus) && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus(null);
                  }}
                  className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('name')}
                    >
                      <div className="flex items-center">
                        <span>Name</span>
                        {sortConfig.key === 'name' && (
                          <ArrowUpDown size={14} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('email')}
                    >
                      <div className="flex items-center">
                        <span>Email</span>
                        {sortConfig.key === 'email' && (
                          <ArrowUpDown size={14} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('amount')}
                    >
                      <div className="flex items-center">
                        <span>Amount</span>
                        {sortConfig.key === 'amount' && (
                          <ArrowUpDown size={14} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('status')}
                    >
                      <div className="flex items-center">
                        <span>Status</span>
                        {sortConfig.key === 'status' && (
                          <ArrowUpDown size={14} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('created_at')}
                    >
                      <div className="flex items-center">
                        <span>Date</span>
                        {sortConfig.key === 'created_at' && (
                          <ArrowUpDown size={14} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDonations.map((donation) => (
                    <tr key={donation.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {donation.name || 'Anonymous'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {donation.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(parseFloat(donation.amount as any), donation.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${donation.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                            donation.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          {donation.status !== 'completed' && (
                            <button 
                              onClick={() => updateDonationStatus(donation.id, 'completed')}
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                              title="Mark as completed"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          {donation.status !== 'pending' && (
                            <button 
                              onClick={() => updateDonationStatus(donation.id, 'pending')}
                              className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                              title="Mark as pending"
                            >
                              <Calendar size={16} />
                            </button>
                          )}
                          {donation.status !== 'failed' && (
                            <button 
                              onClick={() => updateDonationStatus(donation.id, 'failed')}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              title="Mark as failed"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardDonations;

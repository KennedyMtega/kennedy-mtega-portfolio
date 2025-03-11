
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Download } from 'lucide-react';
import Button from '@/components/ui/Button';

const DashboardDonations = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    count: 0
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const donationsData = data || [];
      setDonations(donationsData);
      
      // Calculate statistics
      if (donationsData.length > 0) {
        const total = donationsData.reduce((sum: number, donation: any) => sum + donation.amount, 0);
        const average = total / donationsData.length;
        
        setStats({
          total,
          average,
          count: donationsData.length
        });
      }
    } catch (err: any) {
      console.error('Error fetching donations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Donations</h1>
        <Button 
          variant="outline"
          icon={<Download size={16} />}
        >
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mr-3">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-lg font-semibold">Total Donations</h2>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(stats.total)}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-3">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold">Average Donation</h2>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(stats.average)}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full mr-3">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold">Total Donors</h2>
          </div>
          <p className="text-3xl font-bold">{stats.count}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
          <p>{error}</p>
          <Button 
            onClick={fetchDonations} 
            variant="outline" 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      ) : donations.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No donations received yet</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {donations.map((donation) => (
                  <tr 
                    key={donation.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {donation.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {donation.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(donation.amount)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(donation.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDonations;

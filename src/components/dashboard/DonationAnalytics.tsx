
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DonationStats {
  totalAmountUSD: number;
  totalAmountTZS: number;
  totalDonations: number;
  averageDonation: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
}

const DonationAnalytics = () => {
  const [stats, setStats] = useState<DonationStats>({
    totalAmountUSD: 0,
    totalAmountTZS: 0,
    totalDonations: 0,
    averageDonation: 0,
    completedCount: 0,
    pendingCount: 0,
    failedCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonationStats();
  }, []);

  const fetchDonationStats = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*');

      if (error) throw error;

      if (data) {
        const usdDonations = data.filter(d => d.currency === 'USD');
        const tzsDonations = data.filter(d => d.currency === 'TZS');
        
        const totalUSD = usdDonations.reduce((sum, d) => sum + parseFloat(d.amount as any), 0);
        const totalTZS = tzsDonations.reduce((sum, d) => sum + parseFloat(d.amount as any), 0);
        
        setStats({
          totalAmountUSD: totalUSD,
          totalAmountTZS: totalTZS,
          totalDonations: data.length,
          averageDonation: data.length > 0 ? totalUSD / data.length : 0,
          completedCount: data.filter(d => d.status === 'completed').length,
          pendingCount: data.filter(d => d.status === 'pending').length,
          failedCount: data.filter(d => d.status === 'failed').length,
        });
      }
    } catch (error) {
      console.error('Error fetching donation stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const pieData = [
    { name: 'Completed', value: stats.completedCount, color: '#22c55e' },
    { name: 'Pending', value: stats.pendingCount, color: '#eab308' },
    { name: 'Failed', value: stats.failedCount, color: '#ef4444' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total USD</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalAmountUSD)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total TZS</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalAmountTZS, 'TZS')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDonations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.averageDonation)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donation Status Distribution</CardTitle>
          <CardDescription>
            Overview of donation statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationAnalytics;

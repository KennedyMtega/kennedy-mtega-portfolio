
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  MessageSquare, 
  Eye, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Users
} from 'lucide-react';
import DonationAnalytics from '../../components/dashboard/DonationAnalytics';

interface DashboardStats {
  totalMessages: number;
  unreadMessages: number;
  totalPageViews: number;
  totalDonations: number;
  pendingDonations: number;
  recentActivity: any[];
}

const DashboardHome = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    unreadMessages: 0,
    totalPageViews: 0,
    totalDonations: 0,
    pendingDonations: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch contact messages stats
      const { data: messages } = await supabase
        .from('contact_messages')
        .select('*');
      
      // Fetch page views stats
      const { data: pageViews } = await supabase
        .from('page_views')
        .select('*');
      
      // Fetch donations stats
      const { data: donations } = await supabase
        .from('donations')
        .select('*');

      setStats({
        totalMessages: messages?.length || 0,
        unreadMessages: messages?.filter(m => !m.is_read).length || 0,
        totalPageViews: pageViews?.length || 0,
        totalDonations: donations?.length || 0,
        pendingDonations: donations?.filter(d => d.status === 'pending').length || 0,
        recentActivity: []
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your site.
          </p>
        </div>
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                {stats.unreadMessages} unread
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPageViews}</div>
              <p className="text-xs text-muted-foreground">
                All time views
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDonations}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingDonations} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date().toLocaleDateString('en-US', { month: 'short' })}
              </div>
              <p className="text-xs text-muted-foreground">
                Current period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Donation Analytics Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Donation Analytics
            </CardTitle>
            <CardDescription>
              Detailed insights into your donation performance and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DonationAnalytics />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
                onClick={() => window.location.href = '/dashboard/messages'}>
            <CardHeader>
              <CardTitle className="text-lg">Manage Messages</CardTitle>
              <CardDescription>
                View and respond to contact messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stats.unreadMessages}</span>
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => window.location.href = '/dashboard/donations'}>
            <CardHeader>
              <CardTitle className="text-lg">Donation Management</CardTitle>
              <CardDescription>
                Track and manage donation activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stats.pendingDonations}</span>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => window.location.href = '/dashboard/analytics'}>
            <CardHeader>
              <CardTitle className="text-lg">View Analytics</CardTitle>
              <CardDescription>
                Detailed site performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stats.totalPageViews}</span>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;

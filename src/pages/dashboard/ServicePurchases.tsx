
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ServicePurchase } from '@/types/services';
import { getServicePurchases, updateServicePurchaseStatus } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button-shadcn';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MessageSquare, Calendar, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ServicePurchases = () => {
  const [purchases, setPurchases] = useState<ServicePurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'purchase' | 'inquiry'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const data = await getServicePurchases();
      setPurchases(data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast({
        title: "Error",
        description: "Failed to fetch service purchases.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: ServicePurchase['status']) => {
    try {
      await updateServicePurchaseStatus(id, status);
      setPurchases(purchases.map(p => 
        p.id === id ? { ...p, status } : p
      ));
      toast({
        title: "Success",
        description: "Status updated successfully.",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive"
      });
    }
  };

  const filteredPurchases = purchases.filter(purchase => 
    filter === 'all' || purchase.purchase_type === filter
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'confirmed': return 'secondary';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Service Purchases & Inquiries</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage client purchases and service inquiries
            </p>
          </div>
          
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="purchase">Purchases</SelectItem>
              <SelectItem value="inquiry">Inquiries</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredPurchases.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">
                No {filter === 'all' ? 'requests' : filter === 'purchase' ? 'purchases' : 'inquiries'} found.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPurchases.map((purchase) => (
              <Card key={purchase.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {purchase.service?.title || 'Service Request'}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant={purchase.purchase_type === 'purchase' ? 'default' : 'secondary'}>
                        {purchase.purchase_type === 'purchase' ? 'Purchase' : 'Inquiry'}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(purchase.status)}>
                        {purchase.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Client:</span>
                      <span>{purchase.client_name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <a 
                        href={`mailto:${purchase.client_email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {purchase.client_email}
                      </a>
                    </div>
                    
                    {purchase.client_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <a 
                          href={`tel:${purchase.client_phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {purchase.client_phone}
                        </a>
                      </div>
                    )}

                    {purchase.amount && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold text-primary">
                          {formatPrice(purchase.amount, purchase.currency)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm text-gray-600">
                        {new Date(purchase.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {purchase.message && (
                    <div className="border-t pt-3">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 mt-1" />
                        <div>
                          <span className="font-medium block mb-1">Message:</span>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {purchase.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Status:</span>
                      <Select
                        value={purchase.status}
                        onValueChange={(value: ServicePurchase['status']) => 
                          handleStatusUpdate(purchase.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ServicePurchases;

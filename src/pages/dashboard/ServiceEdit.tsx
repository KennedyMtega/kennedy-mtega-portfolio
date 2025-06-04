
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ServiceForm from '@/components/dashboard/ServiceForm';
import { Service } from '@/types/services';
import { getService, createService, updateService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ServiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      fetchService(id);
    }
  }, [id, isEditing]);

  const fetchService = async (serviceId: string) => {
    setLoading(true);
    try {
      const data = await getService(serviceId);
      setService(data);
    } catch (error) {
      console.error('Error fetching service:', error);
      toast({
        title: "Error",
        description: "Failed to fetch service details.",
        variant: "destructive"
      });
      navigate('/dashboard/services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    setSubmitting(true);
    try {
      if (isEditing && id) {
        await updateService(id, data);
        toast({
          title: "Success",
          description: "Service updated successfully.",
        });
      } else {
        await createService(data);
        toast({
          title: "Success",
          description: "Service created successfully.",
        });
      }
      navigate('/dashboard/services');
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} service.`,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/services');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Edit Service' : 'Create New Service'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isEditing 
              ? 'Update your service details and pricing' 
              : 'Add a new service to your portfolio'
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceForm
              service={service || undefined}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={submitting}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ServiceEdit;

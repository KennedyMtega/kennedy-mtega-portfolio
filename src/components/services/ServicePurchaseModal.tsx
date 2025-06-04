
import React, { useState } from 'react';
import { Service } from '@/types/services';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button-shadcn';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createServicePurchase } from '@/lib/services';
import { useToast } from '@/hooks/use-toast';

interface ServicePurchaseModalProps {
  service: Service | null;
  type: 'purchase' | 'inquiry';
  isOpen: boolean;
  onClose: () => void;
}

const ServicePurchaseModal: React.FC<ServicePurchaseModalProps> = ({
  service,
  type,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    // Validate phone for inquiry type
    if (type === 'inquiry' && !formData.client_phone.trim()) {
      toast({
        title: "Phone number required",
        description: "Phone number is required for service inquiries.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await createServicePurchase({
        service_id: service.id,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone || undefined,
        message: formData.message || undefined,
        purchase_type: type,
        amount: type === 'purchase' ? service.price : undefined,
        currency: service.currency,
      });

      toast({
        title: "Success!",
        description: type === 'purchase' 
          ? "Your purchase request has been submitted. We'll contact you soon!"
          : "Your inquiry has been submitted. We'll get back to you shortly!",
      });

      onClose();
      setFormData({
        client_name: '',
        client_email: '',
        client_phone: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!service) return null;

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === 'purchase' ? 'Purchase Service' : 'Service Inquiry'}
          </DialogTitle>
          <DialogDescription>
            Service: {service.title}
            {type === 'purchase' && service.price && (
              <span className="block text-lg font-semibold text-primary mt-1">
                {formatPrice(service.price, service.currency)}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="client_name">Full Name *</Label>
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="client_email">Email *</Label>
            <Input
              id="client_email"
              type="email"
              value={formData.client_email}
              onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="client_phone">
              Phone Number {type === 'inquiry' && '*'}
            </Label>
            <Input
              id="client_phone"
              type="tel"
              value={formData.client_phone}
              onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
              required={type === 'inquiry'}
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder={type === 'purchase' 
                ? "Any additional information about your purchase..." 
                : "Please describe your requirements and any questions you have..."
              }
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : (type === 'purchase' ? 'Submit Purchase' : 'Send Inquiry')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServicePurchaseModal;

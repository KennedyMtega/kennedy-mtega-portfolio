
import React from 'react';
import { Service } from '@/types/services';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button-shadcn';
import { Badge } from '@/components/ui/badge';
import { DollarSign, MessageSquare, Star } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onPurchase: (service: Service) => void;
  onInquiry: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPurchase, onInquiry }) => {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <Card className="flex flex-col">
      {service.image_url && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={service.image_url}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          {service.featured && (
            <Badge className="absolute top-2 right-2 bg-yellow-500">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
      )}
      
      <CardHeader className="flex-shrink-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{service.title}</CardTitle>
          {service.category && (
            <Badge variant="secondary">{service.category}</Badge>
          )}
        </div>
        <CardDescription>{service.short_description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {service.description}
        </p>
        
        {service.features && service.features.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside space-y-1">
              {service.features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {service.video_url && (
          <div className="mb-4">
            <video
              src={service.video_url}
              controls
              className="w-full h-32 rounded-md"
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-shrink-0 space-y-2">
        <div className="w-full">
          {service.pricing_type === 'fixed' && service.price ? (
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(service.price, service.currency)}
              </span>
              <Button onClick={() => onPurchase(service)} className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Purchase
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-gray-600">
                Request Quote
              </span>
              <Button variant="outline" onClick={() => onInquiry(service)} className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Inquire
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;

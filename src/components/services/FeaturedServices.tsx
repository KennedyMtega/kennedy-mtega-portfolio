
import React, { useEffect, useState } from 'react';
import { Service } from '@/types/services';
import { getServices } from '@/lib/services';
import ServiceCard from './ServiceCard';
import ServicePurchaseModal from './ServicePurchaseModal';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalType, setModalType] = useState<'purchase' | 'inquiry'>('purchase');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchFeaturedServices();
  }, []);

  const fetchFeaturedServices = async () => {
    try {
      const data = await getServices(true); // Get only featured services
      setServices(data);
    } catch (error) {
      console.error('Error fetching featured services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (service: Service) => {
    setSelectedService(service);
    setModalType('purchase');
    setModalOpen(true);
  };

  const handleInquiry = (service: Service) => {
    setSelectedService(service);
    setModalType('inquiry');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedService(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (services.length === 0) {
    return null; // Don't render anything if no featured services
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Services</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our most popular services designed to help you achieve your goals
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto px-12">
           <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: false,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {services.map((service) => (
                <CarouselItem key={service.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <ServiceCard
                      service={service}
                      onPurchase={handlePurchase}
                      onInquiry={handleInquiry}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious>
              <ChevronLeft className="h-4 w-4" />
            </CarouselPrevious>
            <CarouselNext>
              <ChevronRight className="h-4 w-4" />
            </CarouselNext>
          </Carousel>
        </div>
      </div>

      <ServicePurchaseModal
        service={selectedService}
        type={modalType}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default FeaturedServices;

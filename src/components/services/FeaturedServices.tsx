import React, { useEffect, useState } from 'react';
import { Service } from '@/types/services';
import { getServices } from '@/lib/services';
import ServiceCard from './ServiceCard';
import ServicePurchaseModal from './ServicePurchaseModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalType, setModalType] = useState<'purchase' | 'inquiry'>('purchase');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3); // Default to 3

  useEffect(() => {
    fetchFeaturedServices();
  }, []);

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    if (services.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
    }, 4000); // Switch every 4 seconds

    return () => clearInterval(interval);
  }, [services.length]);

  // Handle responsive visible count
  useEffect(() => {
    const getVisibleCount = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1024) return 3; // lg screens
        if (window.innerWidth >= 768) return 2;  // md screens
        return 1; // sm screens
      }
      return 3;
    };

    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    // Set initial value
    setVisibleCount(getVisibleCount());

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
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
        
        {services.length > visibleCount ? (
          <div className="relative max-w-6xl mx-auto">
            {/* Navigation buttons */}
            <div className="absolute top-1/2 left-0 right-0 z-10 flex justify-between items-center transform -translate-y-1/2 pointer-events-none px-4">
              <button
                onClick={handlePrevious}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary transition-all duration-200 pointer-events-auto"
                aria-label="Previous service"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary transition-all duration-200 pointer-events-auto"
                aria-label="Next service"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Carousel container */}
            <div className="overflow-hidden">
              <div 
                className="flex items-start transition-transform duration-500 ease-out"
                style={{ 
                  transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`,
                  width: `${(services.length * 100) / visibleCount}%`
                }}
              >
                {services.map((service) => (
                  <div 
                    key={service.id} 
                    className="px-4 flex"
                    style={{ width: `${100 / services.length}%` }}
                  >
                    <ServiceCard
                      service={service}
                      onPurchase={handlePurchase}
                      onInquiry={handleInquiry}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(services.length - visibleCount + 1) }).map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-primary w-8' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to service group ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPurchase={handlePurchase}
                onInquiry={handleInquiry}
              />
            ))}
          </div>
        )}
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

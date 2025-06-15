import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ServiceCard from '@/components/services/ServiceCard';
import ServicePurchaseModal from '@/components/services/ServicePurchaseModal';
import { Service } from '@/types/services';
import { getServices } from '@/lib/services';
import { trackPageView } from '@/utils/analytics';

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalType, setModalType] = useState<'purchase' | 'inquiry'>('purchase');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView('/services');
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
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

  const featuredServices = services.filter(service => service.featured);
  const regularServices = services.filter(service => !service.featured);

  return (
    <>
      <Helmet>
        <title>Services | Kennedy Mtega</title>
        <meta name="description" content="Professional services offered by Kennedy Mtega - web development, consulting, and technology solutions." />
        <meta name="keywords" content="web development services, technology consulting, software development, Kennedy Mtega services" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary to-primary/80 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Professional Services
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Transform your ideas into reality with our comprehensive technology solutions
              </p>
            </div>
          </section>

          {/* Featured Services */}
          {featuredServices.length > 0 && (
            <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Featured Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  {featuredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onPurchase={handlePurchase}
                      onInquiry={handleInquiry}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All Services */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">
                {featuredServices.length > 0 ? 'All Services' : 'Our Services'}
              </h2>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : regularServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  {regularServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onPurchase={handlePurchase}
                      onInquiry={handleInquiry}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    No services available at the moment. Please check back later.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <ServicePurchaseModal
        service={selectedService}
        type={modalType}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Services;

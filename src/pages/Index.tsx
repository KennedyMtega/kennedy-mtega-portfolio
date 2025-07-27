import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import Vision from '../components/home/Vision';
import ProjectShowcase from '../components/home/ProjectShowcase';
import BlogPreview from '../components/home/BlogPreview';
import Contact from '../components/home/Contact';
import FeaturedServices from '../components/services/FeaturedServices';
import DonationButton from '../components/donate/DonationButton';
import { trackPageView } from '../utils/analytics';

// Main landing page component with hero section and featured content
const Index = () => {
  // On mount, scroll to top of page and track page view
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView('/');
  }, []);
  return <>
      <Helmet>
        <title>{"Kennedy Mtega | Developer & Entrepreneur in Tanzania"}</title>
        <meta name="description" content="Kennedy Mtega: Building innovative technology solutions that empower and connect communities across Tanzania. Developer, Entrepreneur, and Visionary." />
        <meta name="keywords" content="Kennedy Mtega, Tanzania developer, web development, technology solutions, entrepreneur, software engineer" />
        <meta property="og:title" content="Kennedy Mtega | Developer & Entrepreneur in Tanzania" />
        <meta property="og:description" content="Building innovative technology solutions that empower and connect communities across Tanzania." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kennedymtega.com" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kennedy Mtega | Developer & Entrepreneur in Tanzania" />
        <meta name="twitter:description" content="Building innovative technology solutions that empower and connect communities across Tanzania." />
        <meta name="twitter:image" content="/og-image.png" />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Hero />
          
          {/* Donation Trigger Section */}
          <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  Support Innovation in Tanzania
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                  Your support helps me continue building innovative technology solutions that empower communities across Tanzania. Every contribution makes a difference.
                </p>
                <div className="flex justify-center">
                  <DonationButton variant="primary" size="lg" className="shadow-lg hover:shadow-xl transition-shadow duration-300" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Secure payments powered by modern technology
                </p>
              </div>
            </div>
          </section>

          <Vision />
          <div className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900/50">
            <ProjectShowcase />
          </div>
          <FeaturedServices />
          <div className="py-12 bg-gray-50 dark:bg-gray-900/50 md:py-[10px]">
            <BlogPreview />
          </div>
          <Contact />
        </main>
        <Footer />
      </div>
    </>;
};
export default Index;
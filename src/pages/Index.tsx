
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import Vision from '../components/home/Vision';
import ProjectShowcase from '../components/home/ProjectShowcase';
import Testimonials from '../components/home/Testimonials';
import BlogPreview from '../components/home/BlogPreview';
import Contact from '../components/home/Contact';
import { trackPageView } from '../utils/analytics';

// Main landing page component with hero section and featured content
const Index = () => {
  // On mount, scroll to top of page and track page view
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView('/');
  }, []);

  return (
    <>
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
          <Vision />
          <div className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900/50">
            <ProjectShowcase />
          </div>
          <Testimonials />
          <div className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900/50">
            <BlogPreview />
          </div>
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;

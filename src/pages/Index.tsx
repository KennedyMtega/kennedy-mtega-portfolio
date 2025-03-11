
import React, { useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import Vision from '../components/home/Vision';
import ProjectShowcase from '../components/home/ProjectShowcase';
import Testimonials from '../components/home/Testimonials';
import BlogPreview from '../components/home/BlogPreview';
import Contact from '../components/home/Contact';

const Index = () => {
  // On mount, scroll to top of page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
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
  );
};

export default Index;

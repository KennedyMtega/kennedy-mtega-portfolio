
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
      <main className="flex-grow pt-16">
        <Hero />
        <Vision />
        <ProjectShowcase />
        <Testimonials />
        <BlogPreview />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

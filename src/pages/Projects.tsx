
import React, { useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Projects = () => {
  // On mount, scroll to top of page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 px-4 md:px-6 py-20 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
              My <span className="text-primary">Projects</span>
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Explore the various technology solutions I've developed to address challenges in Tanzania.
            </p>
          </div>
          
          <div className="text-center py-20">
            <p>Projects content will go here.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;


import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../common/AnimatedSection';
import Button from '../ui/Button';

interface HotspotProps {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
  image: string;
}

const Vision = () => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const hotspots: HotspotProps[] = [
    {
      id: 'payments',
      title: 'Mobile Payments',
      description: 'A revolutionary mobile payment system fostering financial inclusion across Tanzania, connecting rural communities to the digital economy.',
      x: 25,
      y: 45,
      image: '/placeholder.svg',
    },
    {
      id: 'education',
      title: 'E-Learning',
      description: 'An advanced e-learning platform connecting students in remote areas to quality educational resources and experienced teachers nationwide.',
      x: 60,
      y: 20,
      image: '/placeholder.svg',
    },
    {
      id: 'healthcare',
      title: 'Healthcare Delivery',
      description: 'Innovative drone delivery systems bringing essential medical supplies to remote villages, reducing delivery time from days to hours.',
      x: 75,
      y: 60,
      image: '/placeholder.svg',
    },
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <AnimatedSection animation="slide-up" className="text-center mb-16">
          <span className="inline-block py-1 px-3 mb-4 bg-primary/10 text-primary text-sm font-medium rounded-full">
            Vision 2040
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-6">
            Envisioning a <span className="text-primary">Connected Tanzania</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            I dream of a Tanzania where technology is a catalyst for progress, inclusivity, and sustainable development.
          </p>
        </AnimatedSection>

        <div className="relative mt-16 mb-8 max-w-5xl mx-auto">
          {/* Main panorama image */}
          <div className="aspect-[16/9] relative rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 shadow-xl">
            <div className="absolute inset-0 backdrop-blur-[1px]">
              {/* City silhouette overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent"></div>
              
              {/* Hotspots */}
              {hotspots.map((hotspot) => (
                <button
                  key={hotspot.id}
                  className="absolute w-10 h-10 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center z-10 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                  style={{ 
                    left: `${hotspot.x}%`, 
                    top: `${hotspot.y}%`,
                    boxShadow: activeHotspot === hotspot.id ? '0 0 0 4px rgba(69, 127, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.1)' : ''
                  }}
                  aria-label={hotspot.title}
                  onClick={() => setActiveHotspot(hotspot.id === activeHotspot ? null : hotspot.id)}
                >
                  <span className={`w-4 h-4 rounded-full ${activeHotspot === hotspot.id ? 'bg-primary' : 'bg-primary/70'}`}></span>
                  <span className="animate-ping absolute w-4 h-4 rounded-full bg-primary/40"></span>
                </button>
              ))}
              
              {/* Active hotspot detail popup */}
              {activeHotspot && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
                  <AnimatedSection animation="scale" className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-5 shadow-xl">
                    {hotspots.find(h => h.id === activeHotspot) && (
                      <>
                        <h3 className="text-xl font-semibold mb-2">
                          {hotspots.find(h => h.id === activeHotspot)?.title}
                        </h3>
                        <p className="text-foreground/80 mb-3">
                          {hotspots.find(h => h.id === activeHotspot)?.description}
                        </p>
                      </>
                    )}
                  </AnimatedSection>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-10">
            <AnimatedSection animation="slide-up" delay={300}>
              <blockquote className="italic text-xl text-foreground/80 max-w-2xl mx-auto">
                "I dream of a Tanzania where technology is a catalyst for progress, inclusivity, and sustainable development."
                <footer className="mt-3 text-foreground font-medium">- Kennedy Mtega</footer>
              </blockquote>
              
              <Button 
                to="/projects" 
                className="mt-8"
                icon={<ArrowRight size={16} />}
              >
                Explore Projects
              </Button>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;

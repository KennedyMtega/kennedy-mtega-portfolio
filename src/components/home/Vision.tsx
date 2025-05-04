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

// Vision section component displaying mission and values
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
    <section id="vision-section" className="relative py-20 md:py-32 overflow-hidden bg-gray-50 dark:bg-gray-900">
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
        {/* Bridge image */}
        <div className="flex justify-center mb-10">
          <img
            src="https://images.pexels.com/photos/18218728/pexels-photo-18218728.jpeg?auto=compress&w=900&q=80"
            alt="Dar es Salaam Bridge"
            className="rounded-xl shadow-lg max-w-3xl w-full object-cover"
            style={{ maxHeight: 340 }}
          />
        </div>
        <div className="text-center mt-10">
          <AnimatedSection animation="slide-up" delay={300}>
            <blockquote className="italic text-xl text-foreground/80 max-w-2xl mx-auto">
              "I dream of a Tanzania where technology is a catalyst for progress, inclusivity, and sustainable development."
              <footer className="mt-3 text-foreground font-medium">- Kennedy Mtega</footer>
            </blockquote>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Vision;

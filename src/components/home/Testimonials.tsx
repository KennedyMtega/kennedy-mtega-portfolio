// Testimonials section with auto-rotating cards
import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import AnimatedSection from '../common/AnimatedSection';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  location: string;
  project: string;
}

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "Giftopia Moments made finding the perfect gift for my mother so easy. The personalized touch truly made her day!",
      author: "Amina",
      location: "Dar es Salaam",
      project: "Giftopia Moments"
    },
    {
      id: 2,
      quote: "Thanks to Swahili Job Hub, I landed my dream job! The platform's user-friendly interface and localized content made all the difference.",
      author: "John",
      location: "Arusha",
      project: "Swahili Job Hub"
    },
    {
      id: 3,
      quote: "ChatMarketer has transformed how I engage with customers. My business has seen a 40% increase in qualified leads since implementation.",
      author: "Grace",
      location: "Mwanza",
      project: "ChatMarketer Tanzania"
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <AnimatedSection animation="slide-up" className="text-center mb-16">
          <span className="inline-block py-1 px-3 mb-4 bg-primary/10 text-primary text-sm font-medium rounded-full">
            Voices of Change
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-6">
            Making a <span className="text-primary">Difference</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Hear from the people whose lives and businesses have been transformed by our technology solutions.
          </p>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Testimonial carousel */}
            <div className="overflow-hidden">
              <div 
                className="transition-all duration-700 ease-out"
                style={{ height: '240px' }}
              >
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={testimonial.id}
                    className={`absolute top-0 left-0 w-full transition-all duration-700 ease-out p-6 md:p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-md ${
                      index === activeIndex 
                        ? 'opacity-100 translate-x-0' 
                        : index < activeIndex 
                          ? 'opacity-0 -translate-x-full' 
                          : 'opacity-0 translate-x-full'
                    }`}
                  >
                    <Quote className="text-primary/20 absolute top-4 left-4 w-10 h-10" />
                    <div className="pl-2">
                      <p className="text-lg md:text-xl italic text-foreground/80 mb-6">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center">
                        <div className="ml-2">
                          <div className="font-medium">
                            {testimonial.author}, <span className="text-foreground/70">{testimonial.location}</span>
                          </div>
                          <div className="text-sm text-primary">
                            {testimonial.project} User
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'bg-primary w-8' : 'bg-foreground/20'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>

          {/* Social mentions */}
          <div className="mt-16">
            <h3 className="text-center text-lg font-medium mb-6">
              What People Are Saying
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-sm">User{i}</div>
                      <div className="text-xs text-foreground/60">@user{i}</div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80">
                    {i === 1 && "Just tried @KennedyMtega's Giftopia service - super impressed with how easy it was to find the perfect gift!"}
                    {i === 2 && "Swahili Job Hub is a game changer for job hunting in Tanzania. Well done @KennedyMtega #TechInnovation"}
                    {i === 3 && "ChatMarketer has helped us reach customers we never could before. Thank you @KennedyMtega for this amazing tool!"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

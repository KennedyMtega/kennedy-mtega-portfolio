
import React, { useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ContactForm from '../components/contact/ContactForm';
import { Mail, Phone, MapPin } from 'lucide-react';
import { trackPageView } from '../utils/analytics';

const Contact = () => {
  // On mount, scroll to top of page and track page view
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView('/contact');
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 px-4 md:px-6 py-20 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Have a question or want to collaborate? I'd love to hear from you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-border flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-foreground/70 mb-4">For general inquiries and project discussions</p>
              <a 
                href="mailto:info@kennedymtega.com" 
                className="text-primary hover:underline"
              >
                info@kennedymtega.com
              </a>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-border flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-foreground/70 mb-4">Available during business hours for urgent matters</p>
              <a 
                href="tel:+255712345678" 
                className="text-primary hover:underline"
              >
                +255 71 234 5678
              </a>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-border flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <p className="text-foreground/70 mb-4">Based in the beautiful city of</p>
              <span className="text-primary">Dar es Salaam, Tanzania</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-border h-full">
                <div className="p-6 bg-[#191970] text-white">
                  <h2 className="text-xl font-display font-semibold">My Services</h2>
                  <p className="mt-1 text-white/80">
                    Here's what I can help you with
                  </p>
                </div>
                
                <div className="p-6">
                  <ul className="space-y-4">
                    <li className="flex">
                      <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0">
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                      </div>
                      <div>
                        <h3 className="font-medium">Website Development</h3>
                        <p className="text-sm text-foreground/70">
                          Custom responsive websites built with modern technologies
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0">
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                      </div>
                      <div>
                        <h3 className="font-medium">System Software Development</h3>
                        <p className="text-sm text-foreground/70">
                          Robust, scalable software solutions for businesses
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0">
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                      </div>
                      <div>
                        <h3 className="font-medium">UI/UX Design</h3>
                        <p className="text-sm text-foreground/70">
                          Intuitive, user-friendly interfaces that enhance user experience
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0">
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                      </div>
                      <div>
                        <h3 className="font-medium">Redesign & Reimagine</h3>
                        <p className="text-sm text-foreground/70">
                          Transform existing projects with modern design principles
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="p-6 bg-gray-50 dark:bg-gray-700 border-t border-border">
                  <p className="text-center text-sm text-foreground/70">
                    Looking for something specific? Let me know in your message and I'll get back to you with a custom solution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;

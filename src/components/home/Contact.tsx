
import React from 'react';
import { Mail, MessageSquare, ArrowRight } from 'lucide-react';
import AnimatedSection from '../common/AnimatedSection';
import Button from '../ui/Button';

const Contact = () => {
  return (
    <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="blur-circle w-[600px] h-[600px] bg-blue-400/10 left-[-300px] bottom-[-200px]"></div>
        <div className="blur-circle w-[500px] h-[500px] bg-purple-400/10 right-[-200px] top-[-100px]"></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <AnimatedSection animation="slide-up" className="text-center mb-16">
          <span className="inline-block py-1 px-3 mb-4 bg-primary/10 text-primary text-sm font-medium rounded-full">
            Connect & Collaborate
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-6">
            Let's Build <span className="text-primary">Together</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Let's connect and explore how we can collaborate to build a better Tanzania. Get in touch!
          </p>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-5">
            {/* Contact info */}
            <div className="md:col-span-2 bg-primary p-8 md:p-10 text-white">
              <h3 className="text-2xl font-display font-bold mb-6">
                Get in Touch
              </h3>
              <p className="mb-8 text-white/80">
                I'm always interested in hearing about new projects, opportunities, or partnerships.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 mt-1 mr-3 text-white/70" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <a href="mailto:contact@example.com" className="text-white/80 hover:text-white transition-colors">
                      contact@example.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <MessageSquare className="w-5 h-5 mt-1 mr-3 text-white/70" />
                  <div>
                    <h4 className="font-medium">Social Media</h4>
                    <div className="text-white/80">
                      Connect with me on Twitter, LinkedIn, or Instagram.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/20">
                <p className="font-medium mb-4">Based in</p>
                <p className="text-white/80">Dar es Salaam, Tanzania</p>
              </div>
            </div>

            {/* Contact form */}
            <div className="md:col-span-3 p-8 md:p-10">
              <h3 className="text-2xl font-display font-bold mb-6">
                Send a Message
              </h3>
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground/70 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground/70 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground/70 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="How can I help you?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground/70 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">
                    How can I collaborate?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="collab-investment"
                        name="collaboration"
                        className="h-4 w-4 text-primary focus:ring-primary/50 border-gray-300"
                      />
                      <label htmlFor="collab-investment" className="ml-2 text-sm text-foreground/80">
                        Investment
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="collab-partnership"
                        name="collaboration"
                        className="h-4 w-4 text-primary focus:ring-primary/50 border-gray-300"
                      />
                      <label htmlFor="collab-partnership" className="ml-2 text-sm text-foreground/80">
                        Partnership
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="collab-project"
                        name="collaboration"
                        className="h-4 w-4 text-primary focus:ring-primary/50 border-gray-300"
                      />
                      <label htmlFor="collab-project" className="ml-2 text-sm text-foreground/80">
                        Project inquiry
                      </label>
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    icon={<ArrowRight size={16} />}
                    fullWidth
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

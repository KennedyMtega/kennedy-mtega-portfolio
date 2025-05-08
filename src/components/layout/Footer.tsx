import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Instagram, Mail, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Brand + Quick description */}
          <div className="space-y-4 col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="text-xl font-display font-semibold tracking-tight">
              Kennedy Mtega
            </Link>
            <p className="text-muted-foreground mt-2 max-w-xs">
              Developer. Entrepreneur. Visionary.
              Building systems that empower and connect.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 text-foreground/70 hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 text-foreground/70 hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 text-foreground/70 hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="mailto:contact@example.com" 
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 text-foreground/70 hover:text-primary"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/70">
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-muted-foreground hover:text-primary transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Projects */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/70">
              Projects
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/projects" className="text-muted-foreground hover:text-primary transition-colors">
                  All Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Kent Studio */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/70">
              Kent Studio
            </h3>
            <p className="text-muted-foreground">
              Explore Kent Studio's technology solutions for businesses and organizations.
            </p>
            <a 
              href="https://kentstudiotz.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:underline"
            >
              Visit kentstudiotz.com
              <ArrowUpRight className="ml-1" size={14} />
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>
            &copy; {currentYear} Kennedy Mtega. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 space-x-6">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

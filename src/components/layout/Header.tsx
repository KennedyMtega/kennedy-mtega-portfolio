import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '../ui/Button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  // Handle scroll effect for the header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'py-2 sm:py-3 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md shadow-sm'
          : 'py-3 sm:py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-xl sm:text-2xl font-display font-semibold tracking-tight"
        >
          Kennedy Mtega
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-3 lg:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'relative font-medium transition duration-300 hover:text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 after:origin-right after:transition-transform hover:after:scale-x-100 hover:after:origin-left',
                location.pathname === item.path ? 'text-primary after:scale-x-100' : 'text-foreground/80'
              )}
            >
              {item.name}
            </Link>
          ))}
          <Button
            to="/contact"
            variant="primary"
            size="sm"
          >
            Let's Connect
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground/80 hover:text-primary transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-white dark:bg-gray-900 transition-all duration-300 flex flex-col pt-20 px-6',
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <nav className="flex flex-col space-y-5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'text-xl font-medium transition-all duration-200',
                location.pathname === item.path ? 'text-primary' : 'text-foreground/80'
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/contact"
            className="mt-6 py-3 w-full text-center rounded-full bg-primary text-white font-medium transition-all duration-200"
          >
            Let's Connect
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

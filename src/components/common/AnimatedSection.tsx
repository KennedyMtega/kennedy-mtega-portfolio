
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade' | 'slide-up' | 'slide-right' | 'scale';
  delay?: number;
  threshold?: number;
  once?: boolean;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  animation = 'fade',
  delay = 0,
  threshold = 0.2,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once, threshold]);

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade':
        return 'opacity-0 transition-opacity duration-700';
      case 'slide-up':
        return 'opacity-0 translate-y-8 transition-all duration-700';
      case 'slide-right':
        return 'opacity-0 -translate-x-8 transition-all duration-700';
      case 'scale':
        return 'opacity-0 scale-95 transition-all duration-700';
      default:
        return 'opacity-0 transition-opacity duration-700';
    }
  };

  const getVisibleClass = () => {
    switch (animation) {
      case 'fade':
        return 'opacity-100';
      case 'slide-up':
        return 'opacity-100 translate-y-0';
      case 'slide-right':
        return 'opacity-100 translate-x-0';
      case 'scale':
        return 'opacity-100 scale-100';
      default:
        return 'opacity-100';
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        getAnimationClass(),
        isVisible && getVisibleClass(),
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;

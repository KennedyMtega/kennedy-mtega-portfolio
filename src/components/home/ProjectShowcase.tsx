
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import AnimatedSection from '../common/AnimatedSection';
import Button from '../ui/Button';
import { Project } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';

// Showcase component for displaying featured projects with animations
const ProjectShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('featured', true)
          .order('order_index', { ascending: true });
          
        if (error) throw error;
        setProjects(data || []);
      } catch (err: any) {
        console.error('Error fetching featured projects:', err);
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    if (projects.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
    }, 4000); // Switch every 4 seconds

    return () => clearInterval(interval);
  }, [projects.length]);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  // Get dynamic gradient color based on index
  const getGradientColor = (index: number) => {
    const colors = [
      'from-pink-500/20 to-red-500/20',
      'from-blue-500/20 to-cyan-500/20',
      'from-purple-500/20 to-indigo-500/20',
      'from-green-500/20 to-emerald-500/20',
      'from-amber-500/20 to-yellow-500/20',
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="blur-circle w-[600px] h-[600px] bg-blue-400/10 left-[-300px] top-1/3"></div>
        <div className="blur-circle w-[500px] h-[500px] bg-purple-400/10 right-[-250px] bottom-1/4"></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <AnimatedSection animation="slide-up" className="text-center mb-16">
          <span className="inline-block py-1 px-3 mb-4 bg-primary/10 text-primary text-sm font-medium rounded-full">
            Projects in Motion
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-6">
            Innovative <span className="text-primary">Solutions</span> for Tanzania
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Explore my latest projects, each addressing unique challenges and opportunities in Tanzania's digital landscape.
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">{error}</p>
            <Button 
              variant="primary"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No featured projects found. Add featured projects from the dashboard.
            </p>
            <Button 
              to="/dashboard/projects"
              variant="primary"
              className="mt-4"
            >
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <div className="relative max-w-5xl mx-auto">
            {/* Carousel Navigation */}
            <div className="absolute top-1/2 left-0 right-0 z-20 flex justify-between items-center transform -translate-y-1/2 pointer-events-none px-4">
              <button
                onClick={handlePrevious}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-foreground/70 hover:text-primary transition-all duration-200 pointer-events-auto"
                aria-label="Previous project"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-foreground/70 hover:text-primary transition-all duration-200 pointer-events-auto"
                aria-label="Next project"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Carousel */}
            <div className="relative overflow-hidden rounded-xl" ref={carouselRef}>
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {projects.map((project, index) => (
                  <div key={project.id} className="w-full flex-shrink-0">
                    <div className={`aspect-[16/9] relative rounded-xl overflow-hidden bg-gradient-to-br ${getGradientColor(index)} shadow-xl`}>
                      {/* Project visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {project.project_url ? (
                          <img
                            src={`https://api.microlink.io/?url=${encodeURIComponent(project.project_url)}&screenshot=true&meta=false&embed=screenshot.url`}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            style={{ borderRadius: 12 }}
                          />
                        ) : project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            style={{ borderRadius: 12 }}
                          />
                        ) : (
                          <div className="w-24 h-24 md:w-32 md:h-32 relative">
                            <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform rotate-45"></div>
                            <div className="absolute inset-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-10 h-6 md:w-12 md:h-8 bg-white/80 dark:bg-gray-700/80 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 md:w-5 md:h-5 bg-primary rounded-full animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 px-4">
                      <h3 className="text-2xl font-display font-bold">{project.title}</h3>
                      <p className="mt-2 text-foreground/70">{project.short_description}</p>
                      <div className="mt-4">
                        <Button 
                          to={`/projects/${project.slug}`} 
                          variant="outline"
                          icon={<ExternalLink size={16} />}
                        >
                          Explore Project
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'bg-primary w-8' : 'bg-foreground/20'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to project ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectShowcase;

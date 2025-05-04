// Component for displaying featured projects in a grid layout
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/dashboard';
import ProjectCard from '@/components/ui/ProjectCard';
import AnimatedSection from '@/components/common/AnimatedSection';
import Button from '@/components/ui/Button';
import { ChevronRight } from 'lucide-react';

const FeaturedProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('order_index', { ascending: true })
        .limit(3);
        
      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      console.error('Error fetching featured projects:', err);
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900/40">
      <div className="container px-4 md:px-6">
        <AnimatedSection animation="slide-up" className="text-center mb-16">
          <span className="inline-block py-1 px-3 mb-4 bg-primary/10 text-primary text-sm font-medium rounded-full">
            Project Showcase
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-6">
            Recent <span className="text-primary">Projects</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Here are some of my recent projects highlighting my expertise and problem-solving approach.
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <Button 
              variant="primary"
              onClick={() => fetchFeaturedProjects()}
            >
              Try Again
            </Button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No featured projects found. Check back soon for updates!
            </p>
            <Button 
              to="/projects"
              variant="primary"
            >
              View All Projects
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  featured={projects.length <= 2 && project.featured}
                />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                to="/projects" 
                variant="primary"
                className="group"
              >
                View All Projects
                <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;

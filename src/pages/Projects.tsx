
import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/dashboard';
import Button from '@/components/ui/Button';
import { ExternalLink, Github, Eye } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On mount, scroll to top of page and fetch projects
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });
        
      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 px-4 md:px-6 py-20 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
              My <span className="text-primary">Projects</span>
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Explore the various technology solutions I've developed to address challenges in Tanzania.
            </p>
          </div>
          
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
                onClick={() => fetchProjects()}
              >
                Try Again
              </Button>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No projects found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-border flex flex-col h-full">
      {/* Project Image */}
      <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
        {project.preview_image_url ? (
          <img 
            src={project.preview_image_url} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            No image available
          </div>
        )}
        
        {project.featured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>
      
      {/* Project Content */}
      <div className="p-6 flex-grow">
        <h3 className="font-bold text-xl mb-2">{project.title}</h3>
        
        <p className="text-foreground/70 mb-4">
          {project.short_description}
        </p>
        
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span 
                  key={index}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Project Footer */}
      <div className="p-6 pt-0 flex gap-2 mt-auto">
        <Button 
          to={`/projects/${project.slug}`}
          variant="primary"
          size="sm"
          icon={<Eye size={14} />}
        >
          View Details
        </Button>
        
        <div className="flex-grow"></div>
        
        {project.github_url && (
          <Button
            external={project.github_url}
            variant="outline"
            size="sm"
            icon={<Github size={14} />}
            aria-label="View on GitHub"
          />
        )}
        
        {project.project_url && (
          <Button
            external={project.project_url}
            variant="outline"
            size="sm"
            icon={<ExternalLink size={14} />}
            aria-label="View live project"
          />
        )}
      </div>
    </div>
  );
};

export default Projects;

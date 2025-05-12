
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/dashboard';
import Button from '@/components/ui/Button';
import { ExternalLink, Github, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

// Projects listing page with filtering and search functionality
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
    <>
      <Helmet>
        <title>{"Projects | Kennedy Mtega"}</title>
        <meta name="description" content="Explore Kennedy Mtega's portfolio of innovative technology projects. From web applications to mobile solutions, discover how technology is being used to empower communities in Tanzania." />
        <meta name="keywords" content="Kennedy Mtega projects, Tanzania technology projects, web development portfolio, software projects, tech solutions Tanzania" />
        <meta property="og:title" content="Projects | Kennedy Mtega" />
        <meta property="og:description" content="Explore Kennedy Mtega's portfolio of innovative technology projects. From web applications to mobile solutions, discover how technology is being used to empower communities in Tanzania." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kennedymtega.com/projects" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Projects | Kennedy Mtega" />
        <meta name="twitter:description" content="Explore Kennedy Mtega's portfolio of innovative technology projects. From web applications to mobile solutions, discover how technology is being used to empower communities in Tanzania." />
        <meta name="twitter:image" content="/og-image.png" />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-16 px-4 md:px-6 py-20 md:py-32">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
                My <span className="text-primary">Projects</span>
              </h1>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                A showcase of my work in technology and development.
              </p>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Error Loading Projects
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error}
                </p>
                <Button 
                  onClick={fetchProjects}
                  variant="primary"
                >
                  Try Again
                </Button>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  No Projects Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for new projects.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-border">
                    <div className="aspect-video">
                      {project.project_url ? (
                        <img
                          src={`https://api.microlink.io/?url=${encodeURIComponent(project.project_url)}&screenshot=true&meta=false&embed=screenshot.url`}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No preview image
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-3">
                        <Link to={`/projects/${project.slug}`} className="hover:text-primary transition-colors">
                          {project.title}
                        </Link>
                      </h3>
                      <p className="text-foreground/70 mb-4">
                        {project.short_description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        {project.project_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <Github size={18} />
                          </a>
                        )}
                        <Link
                          to={`/projects/${project.slug}`}
                          className="text-primary hover:text-primary/80 ml-auto"
                        >
                          <Eye size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Projects;

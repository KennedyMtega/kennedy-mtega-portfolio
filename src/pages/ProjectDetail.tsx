import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/dashboard';
import { trackPageView } from '@/utils/analytics';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Calendar, Code, ExternalLink, Github } from 'lucide-react';
import Button from '@/components/ui/Button';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (slug) {
      fetchProject();
      trackPageView(`/projects/${slug}`);
    }
  }, [slug]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      
      if (!data) {
        throw new Error('Project not found');
      }
      
      setProject(data);
      
      // Fetch related projects with similar technologies
      if (data.technologies && data.technologies.length > 0) {
        // Get a random technology from the current project
        const randomTech = data.technologies[Math.floor(Math.random() * data.technologies.length)];
        
        const { data: relatedData, error: relatedError } = await supabase
          .from('projects')
          .select('*')
          .contains('technologies', [randomTech])
          .neq('id', data.id)
          .limit(3);
          
        if (!relatedError && relatedData) {
          setRelatedProjects(relatedData);
        }
      }
      
    } catch (err: any) {
      console.error('Error fetching project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 px-4 md:px-6 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <Link to="/projects" className="inline-flex items-center text-primary hover:underline mb-6">
            <ArrowLeft size={16} className="mr-2" /> Back to Projects
          </Link>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {error === 'Project not found' ? 'Project Not Found' : 'Error Loading Project'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error === 'Project not found' 
                  ? "The project you're looking for doesn't exist or may have been removed."
                  : "There was an error loading this project. Please try again later."}
              </p>
              <Button 
                to="/projects"
                variant="primary"
              >
                Return to Projects
              </Button>
            </div>
          ) : project ? (
            <>
              <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border overflow-hidden">
                {project.image_url && (
                  <div className="w-full aspect-video overflow-hidden">
                    <img 
                      src={project.image_url} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6 md:p-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {project.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <div className="flex items-center mr-4 mb-2">
                      <Calendar size={16} className="mr-1" />
                      <time dateTime={project.created_at}>{formatDate(project.created_at)}</time>
                    </div>
                    {project.featured && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 mb-2 ml-2">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech: string) => (
                        <span 
                          key={tech}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          <Code size={12} className="mr-1" />
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg mb-6">{project.short_description}</p>
                    <div className="whitespace-pre-line">{project.full_description}</div>
                  </div>
                  
                  {(project.project_url || project.github_url) && (
                    <div className="mt-8 flex flex-wrap gap-4">
                      {project.project_url && (
                        <Button
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="primary"
                          icon={<ExternalLink size={16} />}
                        >
                          Visit Project
                        </Button>
                      )}
                      {project.github_url && (
                        <Button
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outline"
                          icon={<Github size={16} />}
                        >
                          View Source
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </article>
              
              {relatedProjects.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedProjects.map((relatedProject) => (
                      <div 
                        key={relatedProject.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border overflow-hidden"
                      >
                        {relatedProject.preview_image_url && (
                          <div className="aspect-video overflow-hidden">
                            <img 
                              src={relatedProject.preview_image_url} 
                              alt={relatedProject.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2">
                            <Link 
                              to={`/projects/${relatedProject.slug}`}
                              className="text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary"
                            >
                              {relatedProject.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                            {relatedProject.short_description}
                          </p>
                          <Link 
                            to={`/projects/${relatedProject.slug}`}
                            className="text-primary hover:underline text-sm font-medium"
                          >
                            View Project
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;

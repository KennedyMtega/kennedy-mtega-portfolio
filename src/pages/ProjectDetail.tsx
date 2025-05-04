import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
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
      
      // Fetch related projects
      const { data: relatedData, error: relatedError } = await supabase
        .from('projects')
        .select('*')
        .neq('id', data.id)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (!relatedError && relatedData) {
        setRelatedProjects(relatedData);
      }
      
    } catch (err: any) {
      console.error('Error fetching project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{project.title} | Kennedy Mtega</title>
        <meta name="description" content={project.short_description} />
        <meta name="keywords" content={`${project.title}, ${project.technologies.join(', ')}, Tanzania technology project, web development, software project`} />
        <meta property="og:title" content={`${project.title} | Kennedy Mtega`} />
        <meta property="og:description" content={project.short_description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://kennedymtega.com/projects/${project.slug}`} />
        <meta property="og:image" content={project.image_url || '/og-image.png'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${project.title} | Kennedy Mtega`} />
        <meta name="twitter:description" content={project.short_description} />
        <meta name="twitter:image" content={project.image_url || '/og-image.png'} />
      </Helmet>
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
            ) : (
              <>
                <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border overflow-hidden">
                  {/* Live website preview or image */}
                  {project.project_url ? (
                    <div className="w-full aspect-video overflow-hidden">
                      <img
                        src={`https://api.microlink.io/?url=${encodeURIComponent(project.project_url)}&screenshot=true&meta=false&embed=screenshot.url`}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : project.image_url ? (
                    <div className="w-full aspect-video overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : null}
                  
                  <div className="p-6 md:p-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      {project.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <div className="flex items-center mr-4 mb-2">
                        <Calendar size={16} className="mr-1" />
                        <time dateTime={project.created_at}>
                          {new Date(project.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                      <div className="flex items-center mb-2">
                        <Code size={16} className="mr-1" />
                        <span>{project.technologies.length} technologies</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-lg mb-6">{project.short_description}</p>
                      <div className="whitespace-pre-line">{project.full_description}</div>
                    </div>
                    
                    <div className="flex gap-4 mt-8">
                      {project.project_url && (
                        <a 
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:text-primary/80"
                        >
                          <ExternalLink size={16} className="mr-2" />
                          View Live Project
                        </a>
                      )}
                      {project.github_url && (
                        <a 
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:text-primary/80"
                        >
                          <Github size={16} className="mr-2" />
                          View on GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </article>
                
                {relatedProjects.length > 0 && (
                  <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                      Related Projects
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {relatedProjects.map((relatedProject) => (
                        <div key={relatedProject.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-border">
                          {relatedProject.image_url && (
                            <div className="aspect-video">
                              <img 
                                src={relatedProject.image_url} 
                                alt={relatedProject.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <h3 className="font-bold text-xl mb-3">
                              <Link to={`/projects/${relatedProject.slug}`} className="hover:text-primary transition-colors">
                                {relatedProject.title}
                              </Link>
                            </h3>
                            <p className="text-foreground/70 mb-4">
                              {relatedProject.short_description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {relatedProject.technologies.slice(0, 3).map((tech, index) => (
                                <span 
                                  key={index}
                                  className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProjectDetail;

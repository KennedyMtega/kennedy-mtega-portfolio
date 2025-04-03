
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/dashboard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProjectForm from '@/components/dashboard/ProjectForm';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Button from '@/components/ui/Button';

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Set up authentication listener and check for existing session
  useEffect(() => {
    // First set up the auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        if (session) {
          setUser(session.user);
          setAuthChecked(true);
        } else {
          setUser(null);
          // Only redirect if not already on auth page
          if (window.location.pathname !== '/auth') {
            toast({
              title: "Authentication required",
              description: "Please sign in to create or edit projects",
              variant: "destructive",
            });
            navigate('/auth');
          }
        }
      }
    );

    // Then check for existing session
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth:', error);
          throw error;
        }
        
        console.log('Session data:', data);
        
        if (data.session) {
          console.log('User is authenticated:', data.session.user.id);
          setUser(data.session.user);
          setAuthChecked(true);
        } else {
          console.log('No active session, redirecting to auth');
          toast({
            title: "Authentication required",
            description: "Please sign in to create or edit projects",
            variant: "destructive",
          });
          navigate('/auth');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        toast({
          title: "Authentication error",
          description: "There was a problem checking your login status",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  useEffect(() => {
    if (isEditMode && authChecked && user) {
      fetchProject();
    }
  }, [id, isEditMode, authChecked, user]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (err: any) {
      console.error('Error fetching project:', err);
      toast({
        title: "Error fetching project",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      // Get current session to double-check authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No active session when submitting form');
        toast({
          title: "Authentication required",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }
      
      console.log('Authenticated as:', session.user.id);
      
      // Ensure technologies is an array
      const technologies = Array.isArray(values.technologies) 
        ? values.technologies 
        : values.technologies.split(',').map((tech: string) => tech.trim()).filter(Boolean);
      
      // Prepare data for insertion/update
      const projectData: Record<string, any> = {
        title: values.title,
        slug: values.slug,
        short_description: values.short_description,
        full_description: values.full_description,
        technologies: technologies,
        github_url: values.github_url || null,
        project_url: values.project_url || null,
        image_url: values.image_url || null,
        preview_image_url: values.preview_image_url || null,
        featured: values.featured || false,
        order_index: values.order_index || 0,
        updated_at: new Date().toISOString(),
      };
      
      // Add created_at for new projects
      if (!isEditMode) {
        projectData.created_at = new Date().toISOString();
      }
      
      console.log('Saving project data:', projectData);
      
      let result;
      
      if (isEditMode) {
        // Update existing project
        console.log('Updating project with ID:', id);
        result = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id);
      } else {
        // Insert new project
        console.log('Creating new project');
        result = await supabase
          .from('projects')
          .insert([projectData]);
      }
      
      console.log('Supabase operation result:', result);
      
      if (result.error) {
        console.error('Supabase error:', result.error);
        throw result.error;
      }
      
      toast({
        title: isEditMode ? "Project updated" : "Project created",
        description: isEditMode 
          ? "Your project has been updated successfully" 
          : "Your new project has been created successfully",
      });
      
      navigate('/dashboard/projects');
    } catch (err: any) {
      console.error('Error saving project:', err);
      toast({
        title: "Error saving project",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked || !user) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Checking authentication...</h2>
              <p className="text-gray-500">Please wait while we verify your credentials</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link to="/dashboard/projects" className="text-gray-500 hover:text-gray-700 mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Project' : 'Create New Project'}
          </h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border p-6">
          <ProjectForm 
            project={project} 
            onSubmit={handleSubmit} 
            loading={loading} 
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectEdit;

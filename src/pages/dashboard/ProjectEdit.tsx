
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/dashboard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProjectForm from '@/components/dashboard/ProjectForm';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthProvider';

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const { toast } = useToast();
  const { user, session, isLoading: authLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch project data if in edit mode
  useEffect(() => {
    if (isEditMode && user) {
      fetchProject();
    }
  }, [id, isEditMode, user]);

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
      
      // Ensure we have a valid session
      if (!session) {
        console.error("No active session found");
        toast({
          title: "Authentication required",
          description: "Please sign in to create or edit projects",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }
      
      console.log("Active session found:", session.user.id);
      
      // Ensure technologies is an array
      const technologies = Array.isArray(values.technologies) 
        ? values.technologies 
        : values.technologies.split(',').map((tech: string) => tech.trim()).filter(Boolean);
      
      // Prepare project data with proper typing
      interface ProjectData {
        title: string;
        slug: string;
        short_description: string;
        full_description: string;
        technologies: string[];
        github_url: string | null;
        project_url: string | null;
        image_url: string | null;
        preview_image_url: string | null;
        featured: boolean;
        order_index: number;
        updated_at: string;
        created_at?: string; // Optional property for new projects
      }
      
      const projectData: ProjectData = {
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
      
      let result;
      
      if (isEditMode) {
        // Update existing project
        result = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id);
      } else {
        // Insert new project
        result = await supabase
          .from('projects')
          .insert(projectData);
      }
      
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

  // If authentication is loading, show loading state
  if (authLoading) {
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

  // If user is not authenticated, show auth required message
  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Authentication required</h2>
              <p className="text-gray-500 mb-4">Please sign in to create or edit projects</p>
              <Button to="/auth" variant="primary">Sign In</Button>
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

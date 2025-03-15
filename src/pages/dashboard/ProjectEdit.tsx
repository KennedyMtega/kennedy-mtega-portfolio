
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

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create or edit projects",
          variant: "destructive",
        });
        navigate('/auth');
      } else {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  useEffect(() => {
    if (isEditMode && authChecked) {
      fetchProject();
    }
  }, [id, isEditMode, authChecked]);

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
      
      // Confirm user is authenticated before proceeding
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create or edit projects",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }
      
      // Ensure technologies is an array
      const technologies = Array.isArray(values.technologies) 
        ? values.technologies 
        : values.technologies.split(',').map((tech: string) => tech.trim()).filter(Boolean);
      
      // Prepare data for insertion/update
      const projectData = {
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
      };
      
      let result;
      
      console.log('Saving project data:', projectData);
      
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
          .insert([projectData]);
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

  if (!authChecked) {
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

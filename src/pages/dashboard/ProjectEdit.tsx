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
  const { user, session, isLoading: authLoading, refreshSession } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch project data if in edit mode
  useEffect(() => {
    if (isEditMode && user && id) {
      fetchProject();
    }
  }, [id, isEditMode, user]);
  
  // Ensure we have a session before proceeding
  useEffect(() => {
    if (!authLoading && !session && !user) {
      console.log("No authentication detected in ProjectEdit, redirecting to auth page");
      navigate('/auth', { state: { returnTo: `/dashboard/projects/${isEditMode ? `edit/${id}` : 'new'}` } });
    } else if (user) {
      console.log("Authenticated user in ProjectEdit:", user.id);
    }
  }, [authLoading, session, user, navigate, id, isEditMode]);

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
      toast({
        title: 'Error fetching project',
        description: err.message,
        variant: 'destructive',
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
        await refreshSession();
      }
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create or edit projects",
          variant: "destructive",
        });
        navigate('/auth', { state: { returnTo: `/dashboard/projects/${isEditMode ? `edit/${id}` : 'new'}` } });
        return;
      }
      // Prepare project data
      const technologies = Array.isArray(values.technologies)
        ? values.technologies
        : values.technologies.split(',').map((tech: string) => tech.trim()).filter(Boolean);
      const projectData = {
        title: values.title,
        slug: values.slug,
        short_description: values.short_description,
        full_description: values.full_description,
        technologies,
        github_url: values.github_url || null,
        project_url: values.project_url || null,
        image_url: values.image_url || null,
        featured: values.featured || false,
        order_index: values.order_index || 0,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      let error;
      if (isEditMode) {
        ({ error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id));
      } else {
        ({ error } = await supabase
          .from('projects')
          .insert([projectData]));
      }
      if (error) {
        toast({
          title: "Error saving project",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: isEditMode ? "Project updated" : "Project created",
        description: isEditMode
          ? "Your project has been updated successfully"
          : "Your new project has been created successfully",
      });
      navigate('/dashboard/projects');
    } catch (err: any) {
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
  if (!user || !session) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Authentication required</h2>
              <p className="text-gray-500 mb-4">Please sign in to create or edit projects</p>
              <Button 
                to="/auth" 
                variant="primary"
                href={`/auth?returnTo=${encodeURIComponent(
                  `/dashboard/projects/${isEditMode ? `edit/${id}` : 'new'}`
                )}`}
              >Sign In</Button>
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
          {(!isEditMode || (isEditMode && project)) && (
            <ProjectForm
              project={project}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}
          {isEditMode && !project && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Loading project details...
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectEdit;

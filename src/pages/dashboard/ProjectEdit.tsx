
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/dashboard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProjectForm from '@/components/dashboard/ProjectForm';
import { Upload, ArrowLeft, Github } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Button from '@/components/ui/Button';

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Determine if we're editing an existing project or creating a new one
  const isEditMode = id !== 'new';

  useEffect(() => {
    if (isEditMode) {
      fetchProject();
    }
  }, [id]);

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
        title: "Error",
        description: `Could not load project: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setIsSaving(true);
      
      // Format data for Supabase
      const projectData = {
        title: values.title,
        slug: values.slug,
        short_description: values.short_description,
        full_description: values.full_description,
        technologies: Array.isArray(values.technologies) 
          ? values.technologies 
          : values.technologies.split(',').map((tech: string) => tech.trim()).filter(Boolean),
        github_url: values.github_url,
        project_url: values.project_url,
        image_url: values.image_url,
        preview_image_url: values.preview_image_url,
        featured: values.featured || false,
        order_index: values.order_index || 0,
        updated_at: new Date().toISOString(),
      };

      let result;
      
      if (isEditMode) {
        // Update existing project
        result = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id);
      } else {
        // Create new project
        result = await supabase
          .from('projects')
          .insert([{ ...projectData, created_at: new Date().toISOString() }]);
      }

      const { error } = result;
      
      if (error) throw error;
      
      toast({
        title: isEditMode ? "Project updated" : "Project created",
        description: isEditMode 
          ? "Your project has been updated successfully." 
          : "Your new project has been created successfully.",
      });
      
      // Redirect to projects list
      navigate('/dashboard/projects');
    } catch (err: any) {
      console.error('Error saving project:', err);
      toast({
        title: "Error",
        description: `Could not save project: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/dashboard/projects')}
            icon={<ArrowLeft size={16} />}
          >
            Back to Projects
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Project' : 'Create New Project'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isEditMode 
              ? 'Update your project details below' 
              : 'Fill in the details for your new project'}
          </p>
        </div>
        
        {isEditMode && loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ProjectForm 
            project={project} 
            onSubmit={handleSubmit} 
            loading={isSaving} 
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectEdit;

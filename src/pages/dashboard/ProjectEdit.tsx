
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

  useEffect(() => {
    if (isEditMode) {
      fetchProject();
    }
  }, [id, isEditMode]);

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
      
      // Prepare data for insertion/update
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
      };
      
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
          .insert([projectData]);
      }
      
      if (result.error) throw result.error;
      
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

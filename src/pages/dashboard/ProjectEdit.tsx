
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ExternalLink, Github, Upload, X, Plus, Trash } from 'lucide-react';
import ProjectForm from '@/components/dashboard/ProjectForm';

// Add the interface here to match the expected props
interface ProjectFormProps {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  loading: boolean;
}

const ProjectEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  const fetchProject = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      setProject(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error fetching project',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .update(values)
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Project updated',
        description: 'Project updated successfully.',
      });
      navigate('/dashboard/projects');
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error updating project',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div>Error: {error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-5">Edit Project</h1>
        {project && (
          <ProjectForm
            initialValues={project}
            onSubmit={handleUpdate}
            loading={loading}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectEdit;

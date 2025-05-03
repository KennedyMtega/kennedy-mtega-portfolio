
import React, { useState, useEffect } from 'react';
import { Project } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Button from '@/components/ui/Button';
import { Edit, Eye, Star, Trash, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

interface ProjectListProps {
  onEdit: (project: Project) => void;
  onAddNew: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ onEdit, onAddNew }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { session, refreshSession } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // Ensure we have a valid session
      if (!session) {
        await refreshSession();
      }
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });
        
      if (error) throw error;
      
      setProjects(data || []);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error loading projects",
        description: error.message || "There was an error loading your projects.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Refresh the project list
      fetchProjects();
      
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully."
      });
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error deleting project",
        description: error.message || "There was an error deleting the project.",
        variant: "destructive"
      });
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          featured: !project.featured,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);
        
      if (error) throw error;
      
      // Refresh the project list
      fetchProjects();
      
      toast({
        title: project.featured ? "Project unfeatured" : "Project featured",
        description: `The project has been ${project.featured ? 'removed from' : 'added to'} featured projects.`
      });
    } catch (error: any) {
      console.error('Error updating project featured status:', error);
      toast({
        title: "Error updating project",
        description: error.message || "There was an error updating the project.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading projects...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Projects</h2>
        <Button 
          variant="primary" 
          icon={<Plus size={16} />}
          onClick={onAddNew}
        >
          Add New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">No projects found</p>
          <Button 
            variant="link" 
            icon={<Plus size={16} />}
            onClick={onAddNew}
            className="mt-2"
          >
            Add your first project
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Project
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {project.preview_image_url ? (
                        <img 
                          src={project.preview_image_url} 
                          alt={project.title} 
                          className="h-10 w-10 rounded-md object-cover mr-3"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center text-gray-500 dark:text-gray-400">
                          No img
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {project.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {project.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {project.order_index}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {project.featured ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Featured
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        Regular
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleToggleFeatured(project)}
                        className={`text-${project.featured ? 'yellow' : 'gray'}-500 hover:text-${project.featured ? 'yellow' : 'gray'}-700 dark:text-${project.featured ? 'yellow' : 'gray'}-400 dark:hover:text-${project.featured ? 'yellow' : 'gray'}-300`}
                        title={project.featured ? "Remove from featured" : "Add to featured"}
                      >
                        <Star size={18} className={project.featured ? "fill-current" : ""} />
                      </button>
                      <button 
                        onClick={() => onEdit(project)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit project"
                      >
                        <Edit size={18} />
                      </button>
                      <a 
                        href={`/projects/${project.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        title="View project"
                      >
                        <Eye size={18} />
                      </a>
                      <button 
                        onClick={() => handleDelete(project.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete project"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectList;

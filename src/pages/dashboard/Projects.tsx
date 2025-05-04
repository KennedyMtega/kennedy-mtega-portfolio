// Dashboard projects management page with CRUD operations
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/dashboard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Plus, Edit, Trash2, Star, Star as StarOutline } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';

const DashboardProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ featured: !currentValue })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the local state
      setProjects(projects.map(project => 
        project.id === id ? {...project, featured: !currentValue} : project
      ));
      
      toast({
        title: currentValue ? "Removed from featured" : "Added to featured",
        description: currentValue 
          ? "Project will no longer be featured on the homepage" 
          : "Project will now be featured on the homepage",
      });
    } catch (err: any) {
      console.error('Error toggling featured status:', err);
      toast({
        title: "Error updating project",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the local state
      setProjects(projects.filter(project => project.id !== id));
      
      toast({
        title: "Project deleted",
        description: "The project has been permanently deleted",
      });
    } catch (err: any) {
      console.error('Error deleting project:', err);
      toast({
        title: "Error deleting project",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Projects</h1>
          <Button 
            to="/dashboard/projects/new" 
            variant="primary"
            icon={<Plus size={16} />}
          >
            Add New Project
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
            <p>{error}</p>
            <Button 
              onClick={fetchProjects} 
              variant="outline" 
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No projects found</p>
            <Button 
              to="/dashboard/projects/new" 
              variant="primary"
            >
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {projects.map((project) => (
                    <tr 
                      key={project.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-750"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                            {project.preview_image_url ? (
                              <img 
                                src={project.preview_image_url} 
                                alt={project.title} 
                                className="h-10 w-10 object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-10 w-10 flex items-center justify-center text-gray-400">
                                No img
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {project.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {project.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {project.featured ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              Featured
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              Standard
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(project.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            className="text-yellow-400 hover:text-yellow-500"
                            aria-label={project.featured ? "Remove from featured" : "Add to featured"}
                            onClick={() => toggleFeatured(project.id, project.featured)}
                          >
                            {project.featured ? 
                              <Star size={18} fill="currentColor" /> : 
                              <StarOutline size={18} />
                            }
                          </button>
                          <Link 
                            to={`/dashboard/projects/edit/${project.id}`}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            <Edit size={18} />
                          </Link>
                          <button 
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            aria-label="Delete project"
                            onClick={() => deleteProject(project.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardProjects;

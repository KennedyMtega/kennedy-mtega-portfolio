
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, TrashIcon, Link, Github, Image } from 'lucide-react';
import Button from '../ui/Button';

interface ProjectFormProps {
  projectId?: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ projectId }) => {
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(projectId ? true : false);
  const [imageUploading, setImageUploading] = useState(false);
  const [previewImageUploading, setPreviewImageUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formState, setFormState] = useState({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    technologies: [] as string[],
    project_url: '',
    github_url: '',
    image_url: '',
    preview_image_url: '',
    featured: false
  });
  
  const [technology, setTechnology] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setFormLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setFormState({
            title: data.title || '',
            slug: data.slug || '',
            short_description: data.short_description || '',
            full_description: data.full_description || '',
            technologies: data.technologies || [],
            project_url: data.project_url || '',
            github_url: data.github_url || '',
            image_url: data.image_url || '',
            preview_image_url: data.preview_image_url || '',
            featured: data.featured || false
          });
        }
      } catch (error: any) {
        toast({
          title: "Error loading project",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setFormLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormState(prev => ({ ...prev, slug: value }));
  };

  const generateSlugFromTitle = () => {
    const slug = formState.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormState(prev => ({ ...prev, slug }));
  };

  const handleAddTechnology = () => {
    if (technology && !formState.technologies.includes(technology)) {
      setFormState(prev => ({
        ...prev,
        technologies: [...prev.technologies, technology]
      }));
      setTechnology('');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setFormState(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'preview') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    try {
      if (type === 'main') setImageUploading(true);
      else setPreviewImageUploading(true);
      
      const { error: uploadError, data } = await supabase.storage
        .from('portfolio')
        .upload(`projects/${filePath}`, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(`projects/${filePath}`);
      
      setFormState(prev => ({
        ...prev,
        [type === 'main' ? 'image_url' : 'preview_image_url']: publicUrl
      }));
      
      toast({
        title: "Image uploaded successfully",
        description: type === 'main' ? "Main image has been uploaded." : "Preview image has been uploaded.",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      if (type === 'main') setImageUploading(false);
      else setPreviewImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate required fields
      if (!formState.title || !formState.slug || !formState.short_description || !formState.full_description) {
        throw new Error('Please fill in all required fields.');
      }
      
      // Check if slug exists (for new projects)
      if (!projectId) {
        const { data: existingSlug } = await supabase
          .from('projects')
          .select('slug')
          .eq('slug', formState.slug)
          .single();
        
        if (existingSlug) {
          throw new Error('This slug is already in use. Please choose a different one.');
        }
      }
      
      let result;
      
      if (projectId) {
        // Update existing project
        result = await supabase
          .from('projects')
          .update({
            title: formState.title,
            slug: formState.slug,
            short_description: formState.short_description,
            full_description: formState.full_description,
            technologies: formState.technologies,
            project_url: formState.project_url,
            github_url: formState.github_url,
            image_url: formState.image_url,
            preview_image_url: formState.preview_image_url,
            featured: formState.featured,
            updated_at: new Date().toISOString()
          })
          .eq('id', projectId);
      } else {
        // Create new project
        result = await supabase
          .from('projects')
          .insert({
            title: formState.title,
            slug: formState.slug,
            short_description: formState.short_description,
            full_description: formState.full_description,
            technologies: formState.technologies,
            project_url: formState.project_url,
            github_url: formState.github_url,
            image_url: formState.image_url,
            preview_image_url: formState.preview_image_url,
            featured: formState.featured
          });
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: projectId ? "Project updated" : "Project created",
        description: projectId ? "Your project has been updated successfully." : "Your project has been created successfully.",
      });
      
      navigate('/dashboard/projects');
    } catch (error: any) {
      toast({
        title: "Error saving project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formState.title}
              onChange={handleChange}
              onBlur={() => !formState.slug && generateSlugFromTitle()}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              placeholder="Project Title"
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug * (URL-friendly identifier)
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={formState.slug}
              onChange={handleSlugChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              placeholder="project-slug"
            />
          </div>
        </div>

        <div>
          <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Short Description * (shown in preview cards)
          </label>
          <textarea
            id="short_description"
            name="short_description"
            rows={2}
            required
            value={formState.short_description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            placeholder="Brief description of your project (1-2 sentences)"
          />
        </div>

        <div>
          <label htmlFor="full_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Description * (displayed on project details page)
          </label>
          <textarea
            id="full_description"
            name="full_description"
            rows={8}
            required
            value={formState.full_description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            placeholder="Detailed description of your project, challenges, solutions, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Technologies Used
          </label>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              placeholder="Add a technology (e.g., React, Node.js)"
            />
            <button
              type="button"
              onClick={handleAddTechnology}
              className="p-2 bg-primary text-white rounded-r-md hover:bg-primary/90"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formState.technologies.map(tech => (
              <div 
                key={tech} 
                className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
              >
                <span className="text-sm">{tech}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTechnology(tech)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <TrashIcon size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="project_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link size={18} className="text-gray-400" />
              </div>
              <input
                id="project_url"
                name="project_url"
                type="url"
                value={formState.project_url}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="github_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              GitHub URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Github size={18} className="text-gray-400" />
              </div>
              <input
                id="github_url"
                name="github_url"
                type="url"
                value={formState.github_url}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="https://github.com/username/project"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Main Project Image
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Image size={24} className="text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Upload</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, 'main')}
                  disabled={imageUploading}
                />
              </label>
              {imageUploading && (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              )}
              {formState.image_url && !imageUploading && (
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                  <img 
                    src={formState.image_url} 
                    alt="Project preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preview Image (for cards)
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Image size={24} className="text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Upload</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, 'preview')}
                  disabled={previewImageUploading}
                />
              </label>
              {previewImageUploading && (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              )}
              {formState.preview_image_url && !previewImageUploading && (
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                  <img 
                    src={formState.preview_image_url} 
                    alt="Project preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={formState.featured}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary/50 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Feature this project on the homepage
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/dashboard/projects')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          icon={loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : <Save size={16} />}
        >
          {projectId ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;

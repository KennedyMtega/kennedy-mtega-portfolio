
import React, { useState, useEffect } from 'react';
import { Project } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Button from '@/components/ui/Button';
import { PlusCircle, Save, Trash, Upload } from 'lucide-react';

interface ProjectFormProps {
  project?: Project;
  onSubmitSuccess?: (project: Project) => void;
  onCancel?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  project, 
  onSubmitSuccess,
  onCancel
}) => {
  const isEditing = !!project;
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    technologies: [],
    project_url: '',
    github_url: '',
    image_url: '',
    preview_image_url: '',
    featured: false,
    order_index: 0
  });
  
  const [newTechnology, setNewTechnology] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  useEffect(() => {
    if (project) {
      setFormData({
        ...project
      });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleTechnologyAdd = () => {
    if (newTechnology.trim() && !formData.technologies?.includes(newTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const handleTechnologyRemove = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies?.filter(t => t !== tech) || []
    }));
  };

  const generateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleImageUpload = async (file: File, isPreview: boolean): Promise<string | null> => {
    try {
      if (!file) return null;
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `projects/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({ 
        title: "Upload failed", 
        description: "There was an error uploading your image.",
        variant: "destructive" 
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let imageUrl = formData.image_url;
      let previewImageUrl = formData.preview_image_url;
      
      // Upload images if selected
      if (imageFile) {
        const uploadedImageUrl = await handleImageUpload(imageFile, false);
        if (uploadedImageUrl) imageUrl = uploadedImageUrl;
      }
      
      if (previewFile) {
        const uploadedPreviewUrl = await handleImageUpload(previewFile, true);
        if (uploadedPreviewUrl) previewImageUrl = uploadedPreviewUrl;
      }
      
      const projectData = {
        ...formData,
        image_url: imageUrl,
        preview_image_url: previewImageUrl,
      };
      
      let result;
      
      if (isEditing && project?.id) {
        // Update existing project
        const { data, error } = await supabase
          .from('projects')
          .update({
            ...projectData,
            updated_at: new Date().toISOString()
          })
          .eq('id', project.id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
        
        toast({
          title: "Project updated",
          description: "Your project has been updated successfully."
        });
      } else {
        // Create new project
        const { data, error } = await supabase
          .from('projects')
          .insert({
            ...projectData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (error) throw error;
        result = data;
        
        toast({
          title: "Project created",
          description: "Your new project has been created successfully."
        });
      }
      
      if (onSubmitSuccess && result) {
        onSubmitSuccess(result as Project);
      }
      
      // Reset form if creating new project
      if (!isEditing) {
        setFormData({
          title: '',
          slug: '',
          short_description: '',
          full_description: '',
          technologies: [],
          project_url: '',
          github_url: '',
          image_url: '',
          preview_image_url: '',
          featured: false,
          order_index: 0
        });
        setImageFile(null);
        setPreviewFile(null);
      }
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast({
        title: "Error saving project",
        description: error.message || "There was an error saving your project.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Title*
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title || ''}
              onChange={handleChange}
              onBlur={generateSlug}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              URL Slug*
            </label>
            <div className="flex mt-1">
              <input
                id="slug"
                name="slug"
                type="text"
                required
                value={formData.slug || ''}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <Button 
                type="button"
                variant="secondary" 
                size="sm"
                className="ml-2"
                onClick={generateSlug}
              >
                Generate
              </Button>
            </div>
          </div>
          
          <div>
            <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Short Description*
            </label>
            <textarea
              id="short_description"
              name="short_description"
              required
              rows={3}
              value={formData.short_description || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="full_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Description*
            </label>
            <textarea
              id="full_description"
              name="full_description"
              required
              rows={6}
              value={formData.full_description || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Technologies*
            </label>
            <div className="flex mt-1">
              <input
                type="text"
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                placeholder="Add technology"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <Button 
                type="button"
                variant="secondary" 
                size="sm"
                className="ml-2"
                onClick={handleTechnologyAdd}
                icon={<PlusCircle size={16} />}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.technologies?.map((tech) => (
                <span key={tech} className="bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full text-sm flex items-center">
                  {tech}
                  <button 
                    type="button"
                    onClick={() => handleTechnologyRemove(tech)} 
                    className="ml-1.5 text-secondary-foreground hover:text-gray-500 dark:hover:text-gray-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="project_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project URL
            </label>
            <input
              id="project_url"
              name="project_url"
              type="url"
              value={formData.project_url || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="github_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              GitHub URL
            </label>
            <input
              id="github_url"
              name="github_url"
              type="url"
              value={formData.github_url || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="order_index" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Display Order
            </label>
            <input
              id="order_index"
              name="order_index"
              type="number"
              min="0"
              value={formData.order_index || 0}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={formData.featured || false}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Featured Project
            </label>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Main Image
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="project-image"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
            />
            <label
              htmlFor="project-image"
              className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <div className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                {imageFile ? 'Change Image' : 'Upload Image'}
              </div>
            </label>
            {(imageFile || formData.image_url) && (
              <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                {imageFile ? imageFile.name : 'Current image'}
              </span>
            )}
          </div>
          {formData.image_url && !imageFile && (
            <div className="mt-2">
              <img 
                src={formData.image_url} 
                alt="Project" 
                className="h-32 w-32 object-cover rounded-md border border-gray-300 dark:border-gray-600" 
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview Image (for card)
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="preview-image"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setPreviewFile(e.target.files[0]);
                }
              }}
            />
            <label
              htmlFor="preview-image"
              className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <div className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                {previewFile ? 'Change Preview' : 'Upload Preview'}
              </div>
            </label>
            {(previewFile || formData.preview_image_url) && (
              <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                {previewFile ? previewFile.name : 'Current preview'}
              </span>
            )}
          </div>
          {formData.preview_image_url && !previewFile && (
            <div className="mt-2">
              <img 
                src={formData.preview_image_url} 
                alt="Preview" 
                className="h-32 w-32 object-cover rounded-md border border-gray-300 dark:border-gray-600" 
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button 
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        
        {isEditing && (
          <Button 
            type="button"
            variant="destructive"
            icon={<Trash size={16} />}
            onClick={() => {
              if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                // Implement delete functionality
              }
            }}
          >
            Delete
          </Button>
        )}
        
        <Button 
          type="submit"
          variant="primary"
          loading={loading}
          icon={<Save size={16} />}
        >
          {isEditing ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;

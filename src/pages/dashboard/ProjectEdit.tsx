
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { Save, X, ArrowLeft, Image, Code, GitHub, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';

type ProjectFormData = {
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  technologies: string[];
  project_url?: string;
  github_url?: string;
  image_url?: string;
  preview_image_url?: string;
  featured: boolean;
  order_index: number;
};

const DashboardProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNewProject = !id;
  
  const [formData, setFormData] = useState<ProjectFormData>({
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
  
  const [loading, setLoading] = useState(!isNewProject);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [previewImageUploading, setPreviewImageUploading] = useState(false);

  useEffect(() => {
    if (!isNewProject) {
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

      if (data) {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          short_description: data.short_description || '',
          full_description: data.full_description || '',
          technologies: data.technologies || [],
          project_url: data.project_url || '',
          github_url: data.github_url || '',
          image_url: data.image_url || '',
          preview_image_url: data.preview_image_url || '',
          featured: data.featured || false,
          order_index: data.order_index || 0
        });
      }
    } catch (error: any) {
      console.error('Error fetching project:', error);
      toast({
        title: 'Error loading project',
        description: error.message,
        variant: 'destructive',
      });
      navigate('/dashboard/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'title' && !formData.slug) {
      // Auto-generate slug from title if slug is empty
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!formData.technologies.includes(techInput.trim())) {
        setFormData(prev => ({
          ...prev,
          technologies: [...prev.technologies, techInput.trim()]
        }));
      }
      setTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isPreview: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isPreview) {
      setPreviewImageUploading(true);
    } else {
      setImageUploading(true);
    }
    
    try {
      // In a real app, you would upload this to Supabase Storage
      // For now, let's simulate with a timeout and fake URL
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      
      // Upload the file to Supabase Storage bucket
      const { data, error } = await supabase
        .storage
        .from('project_images')
        .upload(fileName, file);
      
      if (error) throw error;
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase
        .storage
        .from('project_images')
        .getPublicUrl(fileName);
      
      const imageUrl = urlData.publicUrl;
      
      if (isPreview) {
        setFormData(prev => ({
          ...prev,
          preview_image_url: imageUrl
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          image_url: imageUrl
        }));
      }
      
      toast({
        title: "Image uploaded",
        description: `The ${isPreview ? 'preview' : 'main'} image has been successfully uploaded.`,
      });
    } catch (error: any) {
      console.error(`Error uploading ${isPreview ? 'preview' : 'main'} image:`, error);
      toast({
        title: `Error uploading ${isPreview ? 'preview' : 'main'} image`,
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      if (isPreview) {
        setPreviewImageUploading(false);
      } else {
        setImageUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const now = new Date().toISOString();
      const projectData = {
        ...formData,
        updated_at: now
      };
      
      if (isNewProject) {
        // Create new project
        const { data, error } = await supabase
          .from('projects')
          .insert({
            ...projectData,
            created_at: now
          })
          .select('id')
          .single();

        if (error) throw error;

        toast({
          title: 'Project created',
          description: 'Your project has been created successfully.',
        });
        
        // Navigate to the projects page
        navigate('/dashboard/projects');
      } else {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: 'Project updated',
          description: 'Your project has been updated successfully.',
        });
        
        // Stay on the same page
        fetchProject();
      }
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast({
        title: 'Error saving project',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowLeft size={16} />}
              onClick={() => navigate('/dashboard/projects')}
              className="mr-3"
            >
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-2xl font-bold">
              {isNewProject ? 'Create New Project' : 'Edit Project'}
            </h1>
          </div>
          <div>
            <Button
              variant="primary"
              size="sm"
              icon={<Save size={16} />}
              onClick={(e) => handleSubmit(e)}
              loading={saving}
            >
              Save Project
            </Button>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Project Title*
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                      placeholder="Enter project title"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      URL Slug*
                    </label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      required
                      value={formData.slug}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                      placeholder="project-url-slug"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      This will be used in the URL: yoursite.com/projects/{formData.slug}
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Short Description*
                    </label>
                    <textarea
                      id="short_description"
                      name="short_description"
                      required
                      rows={2}
                      value={formData.short_description}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                      placeholder="Brief description of the project (displayed in cards and lists)"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="full_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Description*
                    </label>
                    <textarea
                      id="full_description"
                      name="full_description"
                      required
                      rows={10}
                      value={formData.full_description}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                      placeholder="Detailed description of the project..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
                <h2 className="text-lg font-semibold mb-4">Project Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Technologies
                    </label>
                    <input
                      type="text"
                      id="technologies"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={handleAddTech}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                      placeholder="Press Enter to add technologies"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.technologies.map((tech) => (
                        <span 
                          key={tech} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => handleRemoveTech(tech)}
                            className="ml-1 text-primary hover:text-primary-600"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="project_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Project URL
                    </label>
                    <div className="flex items-center">
                      <ExternalLink size={16} className="text-gray-400 mr-2" />
                      <input
                        type="url"
                        id="project_url"
                        name="project_url"
                        value={formData.project_url || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="github_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      GitHub URL
                    </label>
                    <div className="flex items-center">
                      <GitHub size={16} className="text-gray-400 mr-2" />
                      <input
                        type="url"
                        id="github_url"
                        name="github_url"
                        value={formData.github_url || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="preview_image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Preview Image (card thumbnail)
                    </label>
                    <div className="mt-1 flex items-center">
                      <label className="block w-full">
                        <span className="sr-only">Choose preview image</span>
                        <input 
                          type="file" 
                          id="preview_image"
                          onChange={(e) => handleImageUpload(e, true)}
                          className="block w-full text-sm text-gray-500 dark:text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-medium
                            file:bg-primary/10 file:text-primary
                            hover:file:bg-primary/20
                            cursor-pointer"
                          accept="image/*"
                        />
                      </label>
                    </div>
                    {previewImageUploading && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Uploading...</span>
                        </div>
                      </div>
                    )}
                    {formData.preview_image_url && (
                      <div className="mt-2">
                        <div className="relative aspect-video w-full overflow-hidden rounded-md border border-gray-300 dark:border-gray-600">
                          <img 
                            src={formData.preview_image_url} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, preview_image_url: '' }))}
                            className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="main_image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Main Project Image (detail page)
                    </label>
                    <div className="mt-1 flex items-center">
                      <label className="block w-full">
                        <span className="sr-only">Choose main image</span>
                        <input 
                          type="file" 
                          id="main_image"
                          onChange={(e) => handleImageUpload(e)}
                          className="block w-full text-sm text-gray-500 dark:text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-medium
                            file:bg-primary/10 file:text-primary
                            hover:file:bg-primary/20
                            cursor-pointer"
                          accept="image/*"
                        />
                      </label>
                    </div>
                    {imageUploading && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Uploading...</span>
                        </div>
                      </div>
                    )}
                    {formData.image_url && (
                      <div className="mt-2">
                        <div className="relative aspect-video w-full overflow-hidden rounded-md border border-gray-300 dark:border-gray-600">
                          <img 
                            src={formData.image_url} 
                            alt="Main" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                            className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Featured Project
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="order_index" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      id="order_index"
                      name="order_index"
                      min="0"
                      value={formData.order_index}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Lower numbers display first (0 is highest priority)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-border/50">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tips:</h3>
                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Add key technologies to help visitors understand your stack</li>
                  <li>• Include both preview and main images for better presentation</li>
                  <li>• Featured projects appear on the homepage</li>
                  <li>• Lower order index numbers appear first in lists</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default DashboardProjectEdit;

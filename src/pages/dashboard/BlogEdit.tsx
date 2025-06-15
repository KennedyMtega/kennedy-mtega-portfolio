// Blog post editor with markdown support and AI content generation
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { Save, X, ArrowLeft, Image, Check } from 'lucide-react';
import Button from '@/components/ui/Button';

type BlogFormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  image_url: string;
  published: boolean;
  featured: boolean;
  published_at?: string; // Added this missing property
};

const DashboardBlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNewPost = !id;
  
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'General',
    tags: [],
    image_url: '',
    published: false,
    featured: false
  });
  
  const [loading, setLoading] = useState(!isNewPost);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (!isNewPost) {
      fetchBlogPost();
    }
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          category: data.category || 'General',
          tags: data.tags || [],
          image_url: data.image_url || '',
          published: data.published || false,
          featured: data.featured || false,
          published_at: data.published_at // Added this to capture the published_at field
        });
      }
    } catch (error: any) {
      console.error('Error fetching blog post:', error);
      toast({
        title: 'Error loading blog post',
        description: error.message,
        variant: 'destructive',
      });
      navigate('/dashboard/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const filePath = `blog/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        image_url: publicUrl,
      }));
      
      toast({
        title: 'Image uploaded',
        description: 'The image has been successfully uploaded.',
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error uploading image',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, publishState: boolean = formData.published) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const now = new Date().toISOString();
      const postData = {
        ...formData,
        published: publishState,
        published_at: publishState && !formData.published_at ? now : formData.published_at,
        updated_at: now
      };
      
      if (isNewPost) {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert({
            ...postData,
            author: 'Kennedy Mtega', // Default author or get from user context
            created_at: now
          })
          .select('id')
          .single();

        if (error) throw error;

        toast({
          title: 'Blog post created',
          description: publishState 
            ? 'Your post has been published successfully.' 
            : 'Your post has been saved as a draft.',
        });
        
        // Navigate to edit page for the new post
        if (data?.id) {
          navigate(`/dashboard/blog/edit/${data.id}`);
        } else {
          navigate('/dashboard/blog');
        }
      } else {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: 'Blog post updated',
          description: publishState 
            ? 'Your post has been published successfully.' 
            : 'Your post has been saved as a draft.',
        });
      }
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      toast({
        title: 'Error saving blog post',
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
              onClick={() => navigate('/dashboard/blog')}
              className="mr-3"
            >
              {/* Added empty string as children to satisfy the type requirement */}
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-2xl font-bold">
              {isNewPost ? 'Create New Blog Post' : 'Edit Blog Post'}
            </h1>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Save size={16} />}
              onClick={(e) => handleSubmit(e, false)}
              loading={saving}
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Check size={16} />}
              onClick={(e) => handleSubmit(e, true)}
              loading={saving}
            >
              Publish
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
                      Post Title*
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                      placeholder="Enter blog post title"
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
                      placeholder="blog-post-url-slug"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      This will be used in the URL: yoursite.com/blog/{formData.slug}
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Excerpt/Summary*
                    </label>
                    <textarea
                      id="excerpt"
                      name="excerpt"
                      required
                      rows={3}
                      value={formData.excerpt}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                      placeholder="Brief summary of the blog post"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Content*
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      required
                      rows={15}
                      value={formData.content}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                      placeholder="Write your blog post content here..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
                <h2 className="text-lg font-semibold mb-4">Post Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category*
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                    >
                      <option value="General">General</option>
                      <option value="Technology">Technology</option>
                      <option value="Programming">Programming</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags
                    </label>
                    <input
                      type="text"
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                      placeholder="Press Enter to add tags"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-primary hover:text-primary-600"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Featured Image
                    </label>
                    <div className="mt-1 flex items-center">
                      <label className="block w-full">
                        <span className="sr-only">Choose featured image</span>
                        <input 
                          type="file" 
                          id="image"
                          onChange={handleImageUpload}
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
                            alt="Featured" 
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
                      Featured Post
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      name="published"
                      checked={formData.published}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Published
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-border/50">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tips:</h3>
                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Use a compelling title that grabs attention</li>
                  <li>• Make your excerpt informative but concise</li>
                  <li>• Add relevant tags to improve discoverability</li>
                  <li>• Featured posts appear prominently on your blog</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default DashboardBlogEdit;

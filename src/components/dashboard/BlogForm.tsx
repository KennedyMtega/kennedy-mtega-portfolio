import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, TrashIcon, Image } from 'lucide-react';
import Button from '../ui/Button';
import GeminiAIWriter from '../common/GeminiAIWriter';
import { BlogPost } from '@/types/dashboard';

interface BlogFormProps {
  postId?: string;
}

const BlogForm: React.FC<BlogFormProps> = ({ postId }) => {
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(postId ? true : false);
  const [imageUploading, setImageUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formState, setFormState] = useState<BlogPost>({
    id: '',
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    tags: [],
    image_url: '',
    published: false,
    featured: false,
    created_at: '',
    updated_at: '',
    published_at: '',
    subheading: '',
  });
  
  const [tag, setTag] = useState('');
  const [aiPrompt, setAIPrompt] = useState('');
  const [aiLoading, setAILoading] = useState(false);

  const categories = [
    'Technology',
    'Web Development',
    'Design',
    'Programming',
    'Business',
    'Leadership',
    'Tanzania',
    'Africa',
    'Project Updates',
    'Tutorials',
    'Other'
  ];

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setFormLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', postId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          const safeData = data as Partial<BlogPost>;
          setFormState({
            id: safeData.id || '',
            title: safeData.title || '',
            slug: safeData.slug || '',
            excerpt: safeData.excerpt || '',
            content: safeData.content || '',
            author: safeData.author || '',
            category: safeData.category || '',
            tags: safeData.tags || [],
            image_url: safeData.image_url || '',
            published: safeData.published || false,
            featured: safeData.featured || false,
            created_at: safeData.created_at || '',
            updated_at: safeData.updated_at || '',
            published_at: safeData.published_at || '',
            subheading: safeData.subheading || '',
          });
        }
      } catch (error: any) {
        toast({
          title: "Error loading blog post",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setFormLoading(false);
      }
    };
    
    fetchPost();
  }, [postId, toast]);

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

  const handleAddTag = () => {
    if (tag && !formState.tags.includes(tag)) {
      setFormState(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTag('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setFormState(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== t)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    try {
      setImageUploading(true);
      
      const { error: uploadError, data } = await supabase.storage
        .from('portfolio')
        .upload(`blog/${filePath}`, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(`blog/${filePath}`);
      
      setFormState(prev => ({
        ...prev,
        image_url: publicUrl
      }));
      
      toast({
        title: "Image uploaded successfully",
        description: "Blog post image has been uploaded.",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleAIGenerate = (result: any) => {
    setFormState(prev => ({
      ...prev,
      title: result.title || prev.title,
      excerpt: result.excerpt || prev.excerpt,
      content: result.body || prev.content,
      subheading: result.subheading || prev.subheading,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate required fields
      if (!formState.title || !formState.slug || !formState.excerpt || !formState.content || !formState.author || !formState.category) {
        throw new Error('Please fill in all required fields.');
      }
      
      // Check if slug exists (for new posts)
      if (!postId) {
        const { data: existingSlug } = await supabase
          .from('blog_posts')
          .select('slug')
          .eq('slug', formState.slug)
          .single();
        
        if (existingSlug) {
          throw new Error('This slug is already in use. Please choose a different one.');
        }
      }
      
      let result;
      
      if (postId) {
        // Update existing post
        const updateData: any = {
          title: formState.title,
          slug: formState.slug,
          excerpt: formState.excerpt,
          content: formState.content,
          author: formState.author,
          category: formState.category,
          tags: formState.tags,
          image_url: formState.image_url,
          featured: formState.featured,
          published: formState.published,
          subheading: formState.subheading,
          updated_at: new Date().toISOString()
        };
        
        // Only set published_at if the post is being published for the first time
        if (formState.published && !result?.data?.[0]?.published_at) {
          updateData.published_at = new Date().toISOString();
        }
        
        result = await supabase
          .from('blog_posts')
          .update(updateData)
          .eq('id', postId);
      } else {
        // Create new post
        const insertData: any = {
          title: formState.title,
          slug: formState.slug,
          excerpt: formState.excerpt,
          content: formState.content,
          author: formState.author,
          category: formState.category,
          tags: formState.tags,
          image_url: formState.image_url,
          featured: formState.featured,
          published: formState.published,
          subheading: formState.subheading,
        };
        
        // Set published_at if the post is being published immediately
        if (formState.published) {
          insertData.published_at = new Date().toISOString();
        }
        
        result = await supabase
          .from('blog_posts')
          .insert(insertData);
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: postId ? "Blog post updated" : "Blog post created",
        description: postId ? "Your blog post has been updated successfully." : "Your blog post has been created successfully.",
      });
      
      navigate('/dashboard/blog');
    } catch (error: any) {
      toast({
        title: "Error saving blog post",
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
      {/* AI Writer Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Generate Full Blog Post with AI
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={e => setAIPrompt(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            placeholder="Enter a topic or prompt for the AI (e.g. Digital Economy in Tanzania)"
          />
          <GeminiAIWriter
            prompt={aiPrompt}
            onGenerate={handleAIGenerate}
            buttonText="Generate Full Blog with AI"
            className="!bg-green-600 !hover:bg-green-700"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">AI will generate a full blog post, SEO meta, and summary for you. All fields will be filled automatically.</p>
      </div>
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
              placeholder="Blog Post Title"
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
              placeholder="blog-post-slug"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subheading" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subheading
          </label>
          <input
            id="subheading"
            name="subheading"
            type="text"
            value={formState.subheading}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            placeholder="Optional subheading for your blog post"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Excerpt * (brief summary shown in previews)
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            required
            value={formState.excerpt}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            placeholder="Brief summary of your blog post (1-2 sentences)"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content * (main blog post content)
          </label>
          <textarea
            id="content"
            name="content"
            rows={12}
            required
            value={formState.content}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            placeholder="Write your blog post content here..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Author *
            </label>
            <input
              id="author"
              name="author"
              type="text"
              required
              value={formState.author}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formState.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              placeholder="Add a tag (e.g., Startup, AI, Development)"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="p-2 bg-primary text-white rounded-r-md hover:bg-primary/90"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formState.tags.map(t => (
              <div 
                key={t} 
                className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
              >
                <span className="text-sm">{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <TrashIcon size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Featured Image
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
                onChange={handleImageUpload}
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
                  alt="Blog post preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center">
            <input
              id="published"
              name="published"
              type="checkbox"
              checked={formState.published}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary/50 border-gray-300 rounded"
            />
            <label htmlFor="published" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Publish this post (will be visible to the public)
            </label>
          </div>
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
              Feature this post on the homepage
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/dashboard/blog')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          icon={loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : <Save size={16} />}
        >
          {postId ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
};

export default BlogForm;

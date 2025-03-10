
import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/dashboard';
import Button from '@/components/ui/Button';
import { Calendar, Tag, User } from 'lucide-react';
import { format } from 'date-fns';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On mount, scroll to top of page and fetch blog posts
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });
        
      if (error) throw error;
      setPosts(data || []);
    } catch (err: any) {
      console.error('Error fetching blog posts:', err);
      setError(err.message || 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 px-4 md:px-6 py-20 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
              My <span className="text-primary">Blog</span>
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Thoughts, insights, and perspectives on technology and development in Tanzania.
            </p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400">{error}</p>
              <Button 
                variant="primary"
                className="mt-4"
                onClick={() => fetchBlogPosts()}
              >
                Try Again
              </Button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No blog posts found. Check back soon for updates!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
              
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-border">
                  <h3 className="font-bold text-lg mb-4 pb-2 border-b border-border">About This Blog</h3>
                  <p className="text-foreground/70">
                    I write about technology, development, and innovation in Tanzania and beyond. Subscribe to stay updated with the latest posts and insights.
                  </p>
                  <div className="mt-4">
                    <Button variant="primary" fullWidth>
                      Subscribe
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-border">
                  <h3 className="font-bold text-lg mb-4 pb-2 border-b border-border">Categories</h3>
                  <ul className="space-y-2">
                    {Array.from(new Set(posts.map(post => post.category))).map((category, index) => (
                      <li key={index}>
                        <a href="#" className="text-primary hover:underline flex items-center">
                          <Tag size={12} className="mr-2" />
                          {category}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-border">
      {/* Post Image */}
      {post.image_url && (
        <div className="aspect-video">
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Post Content */}
      <div className="p-6">
        {/* Post Meta */}
        <div className="flex items-center text-sm text-foreground/60 mb-3">
          <span className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : 'Unpublished'}
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <User size={14} className="mr-1" />
            {post.author}
          </span>
        </div>
        
        {/* Post Title */}
        <h3 className="font-bold text-xl mb-3">
          <a href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </a>
        </h3>
        
        {/* Post Excerpt */}
        <p className="text-foreground/70 mb-4">
          {post.excerpt}
        </p>
        
        {/* Post Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Post Footer */}
        <div className="pt-2">
          <Button 
            to={`/blog/${post.slug}`}
            variant="link"
            className="p-0"
          >
            Read More →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Blog;

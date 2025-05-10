
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/dashboard';
import Button from '@/components/ui/Button';
import { Calendar, Tag, User } from 'lucide-react';
import { format } from 'date-fns';

// Blog listing page with article previews and category filtering
const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fallbackImageUrl = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b';

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

  // Format date function
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  };

  return (
    <>
      <Helmet>
        <title>Blog | Kennedy Mtega</title>
        <meta name="description" content="Read insights and perspectives from Kennedy Mtega on technology, entrepreneurship, and development in Tanzania. Stay updated with the latest trends and innovations." />
        <meta name="keywords" content="Kennedy Mtega blog, Tanzania technology blog, web development blog, tech insights Tanzania, software development blog" />
        <meta property="og:title" content="Blog | Kennedy Mtega" />
        <meta property="og:description" content="Read insights and perspectives from Kennedy Mtega on technology, entrepreneurship, and development in Tanzania. Stay updated with the latest trends and innovations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kennedymtega.com/blog" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | Kennedy Mtega" />
        <meta name="twitter:description" content="Read insights and perspectives from Kennedy Mtega on technology, entrepreneurship, and development in Tanzania. Stay updated with the latest trends and innovations." />
        <meta name="twitter:image" content="/og-image.png" />
      </Helmet>
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
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Error Loading Blog Posts
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error}
                </p>
                <Button 
                  onClick={fetchBlogPosts}
                  variant="primary"
                >
                  Try Again
                </Button>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  No Blog Posts Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for new blog posts.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-border h-full flex flex-col">
                    <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {post.image_url ? (
                        <img 
                          src={post.image_url} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = fallbackImageUrl;
                            console.log('Error loading blog list image for:', post.title, 'URL was:', post.image_url);
                          }}
                        />
                      ) : (
                        <img 
                          src={fallbackImageUrl} 
                          alt="Placeholder" 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center text-sm text-foreground/60 mb-3">
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <User size={14} className="mr-1" />
                          {post.author}
                        </span>
                      </div>
                      <h3 className="font-bold text-xl mb-3">
                        <a href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                          {post.title}
                        </a>
                      </h3>
                      <p className="text-foreground/70 mb-4 flex-grow">
                        {post.excerpt}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag, index) => (
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
                      <div className="flex items-center mt-auto">
                        <span className="flex items-center text-sm text-foreground/60">
                          <Tag size={14} className="mr-1" />
                          {post.category}
                        </span>
                        <a 
                          href={`/blog/${post.slug}`}
                          className="text-primary hover:text-primary/80 ml-auto"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blog;

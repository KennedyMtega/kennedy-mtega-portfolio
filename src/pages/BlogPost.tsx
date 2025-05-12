
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { trackPageView } from '@/utils/analytics';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import Button from '@/components/ui/Button';

// Individual blog post page with markdown content and social sharing
const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const fallbackImageUrl = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b';

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (slug) {
      fetchBlogPost();
      trackPageView(`/blog/${slug}`);
    }
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      console.log("Fetching blog post with slug:", slug);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        throw new Error('Blog post not found');
      }
      
      console.log("Blog post fetched successfully:", data.title);
      setPost(data);
      
      // Fetch related posts from the same category
      if (data.category) {
        const { data: relatedData, error: relatedError } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, image_url, created_at')
          .eq('category', data.category)
          .eq('published', true)
          .neq('id', data.id)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (!relatedError && relatedData) {
          console.log("Related posts fetched:", relatedData.length);
          setRelatedPosts(relatedData);
        }
      }
      
    } catch (err: any) {
      console.error('Error fetching blog post:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  };

  return (
    <>
      <Helmet>
        <title>{post?.title ? `${post.title} | Kennedy Mtega's Blog` : "Blog Post | Kennedy Mtega"}</title>
        <meta name="description" content={post?.excerpt} />
        <meta name="keywords" content={`${post?.title}, ${post?.tags?.join(', ')}, Tanzania tech blog, web development blog, software development insights`} />
        <meta property="og:title" content={post?.title ? `${post.title} | Kennedy Mtega's Blog` : "Blog Post | Kennedy Mtega"} />
        <meta property="og:description" content={post?.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://kennedymtega.com/blog/${post?.slug}`} />
        <meta property="og:image" content={post?.image_url || '/og-image.png'} />
        <meta property="article:published_time" content={post?.created_at} />
        <meta property="article:author" content={post?.author} />
        <meta property="article:tag" content={post?.tags?.join(', ')} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post?.title ? `${post.title} | Kennedy Mtega's Blog` : "Blog Post | Kennedy Mtega"} />
        <meta name="twitter:description" content={post?.excerpt} />
        <meta name="twitter:image" content={post?.image_url || '/og-image.png'} />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-16 px-4 md:px-6 py-16 md:py-24">
          <div className="container mx-auto max-w-4xl">
            <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-6">
              <ArrowLeft size={16} className="mr-2" /> Back to Blog
            </Link>
            
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  {error === 'Blog post not found' ? 'Blog Post Not Found' : 'Error Loading Blog Post'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error === 'Blog post not found' 
                    ? "The blog post you're looking for doesn't exist or may have been removed."
                    : "There was an error loading this blog post. Please try again later."}
                </p>
                <Button 
                  to="/blog"
                  variant="primary"
                >
                  Return to Blog
                </Button>
              </div>
            ) : post ? (
              <>
                <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border overflow-hidden">
                  {post.image_url && (
                    <div className="w-full aspect-video overflow-hidden">
                      <img 
                        src={post.image_url} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = fallbackImageUrl;
                          console.log('Error loading blog post detail image:', post.title, 'URL was:', post.image_url);
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="p-6 md:p-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      {post.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <div className="flex items-center mr-4 mb-2">
                        <User size={16} className="mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center mr-4 mb-2">
                        <Calendar size={16} className="mr-1" />
                        <time dateTime={post.created_at}>{formatDate(post.published_at || post.created_at)}</time>
                      </div>
                      <div className="flex items-center mb-2">
                        <Tag size={16} className="mr-1" />
                        <span>{post.category}</span>
                      </div>
                    </div>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map((tag: string, index: number) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-lg mb-6">{post.excerpt}</p>
                      <div className="whitespace-pre-line">{post.content}</div>
                    </div>
                  </div>
                </article>
                
                {relatedPosts.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {relatedPosts.map((relatedPost) => (
                        <div 
                          key={relatedPost.id}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border overflow-hidden"
                        >
                          {relatedPost.image_url && (
                            <div className="aspect-video overflow-hidden">
                              <img 
                                src={relatedPost.image_url} 
                                alt={relatedPost.title} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.src = fallbackImageUrl;
                                  console.log('Error loading related post image:', relatedPost.title, 'URL was:', relatedPost.image_url);
                                }}
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <h3 className="font-bold text-lg mb-2">
                              <Link 
                                to={`/blog/${relatedPost.slug}`}
                                className="text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary"
                              >
                                {relatedPost.title}
                              </Link>
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                              {relatedPost.excerpt}
                            </p>
                            <Link 
                              to={`/blog/${relatedPost.slug}`}
                              className="text-primary hover:underline text-sm font-medium"
                            >
                              Read More
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;

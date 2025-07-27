import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../common/AnimatedSection';
import Button from '../ui/Button';
import { supabase } from '@/integrations/supabase/client';
import BlogPostCard from '../ui/BlogPostCard';
import { BlogPost } from '@/types/dashboard';

// Preview component for displaying latest blog posts
const BlogPreview = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("BlogPreview: Fetching blog posts for preview section");
        const {
          data,
          error
        } = await supabase.from('blog_posts').select('*').eq('published', true).order('published_at', {
          ascending: false
        }).limit(3);
        if (error) throw error;

        // Debug post data including image URLs
        console.log(`BlogPreview: Fetched ${data?.length} posts successfully`);
        data?.forEach((post, index) => {
          console.log(`BlogPreview: Post ${index + 1} "${post.title}" (${post.id}) has image URL:`, post.image_url);
        });
        setPosts(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load blog posts');
        console.error('BlogPreview: Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  if (loading) {
    return <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>;
  }
  if (error) {
    return <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          </div>
        </div>
      </section>;
  }
  if (posts.length === 0) {
    return null;
  }
  return <section className="py-20 md:py-[18px]">
      <div className="container px-4 md:px-6">
        <AnimatedSection animation="slide-up" className="text-center mb-16">
          <span className="inline-block py-1 px-3 mb-4 bg-primary/10 text-primary text-sm font-medium rounded-full">
            From the Blog
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-6">
            Insights & <span className="text-primary">Perspectives</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Explore my thoughts on technology, entrepreneurship, and development in Tanzania.
          </p>
        </AnimatedSection>

        <div className="max-w-6xl mx-auto">
          {posts.length > 0 && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => <AnimatedSection key={post.id} animation="fade" delay={i * 200}>
                  <BlogPostCard post={post} featured={i === 0} />
                </AnimatedSection>)}
            </div>}

          <div className="text-center mt-12">
            <Button to="/blog" variant="outline" size="lg" icon={<ArrowRight size={16} />}>
              View All Articles
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default BlogPreview;
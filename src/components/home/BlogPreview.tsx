
import React from 'react';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../common/AnimatedSection';
import Button from '../ui/Button';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
}

const BlogPreview = () => {
  const featuredPost: BlogPost = {
    id: 'digital-economy',
    title: 'The Rise of the Digital Economy in Tanzania: Opportunities and Challenges',
    excerpt: 'Exploring how digital innovation is transforming Tanzania's economic landscape and what it means for businesses and entrepreneurs.',
    date: 'June 15, 2023',
    image: '/placeholder.svg',
    category: 'Technology',
  };
  
  const recentPosts: BlogPost[] = [
    {
      id: 'tech-education',
      title: 'Revolutionizing Tech Education in East Africa',
      excerpt: 'How new approaches to technology education are empowering the next generation of Tanzanian innovators.',
      date: 'May 22, 2023',
      image: '/placeholder.svg',
      category: 'Education',
    },
    {
      id: 'mobile-payments',
      title: 'Mobile Payments: The Backbone of Tanzania's Digital Transformation',
      excerpt: 'Examining the role of mobile payment systems in driving financial inclusion across Tanzania.',
      date: 'April 10, 2023',
      image: '/placeholder.svg',
      category: 'Fintech',
    },
  ];

  return (
    <section className="py-20 md:py-32">
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
          {/* Featured article */}
          <AnimatedSection animation="fade" className="mb-12">
            <div className="grid md:grid-cols-5 gap-6 md:gap-10 items-center">
              <div className="md:col-span-2">
                <div className="aspect-[4/3] relative rounded-xl overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </div>
              <div className="md:col-span-3">
                <span className="inline-block py-1 px-2 bg-primary/10 text-primary text-xs font-medium rounded mb-3">
                  {featuredPost.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-3">
                  {featuredPost.title}
                </h3>
                <p className="text-foreground/70 mb-4">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/60">
                    {featuredPost.date}
                  </span>
                  <Button 
                    to={`/blog/${featuredPost.id}`}
                    variant="link"
                    icon={<ArrowRight size={16} />}
                  >
                    Read article
                  </Button>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Recent articles */}
          <div className="grid md:grid-cols-2 gap-8">
            {recentPosts.map((post, i) => (
              <AnimatedSection key={post.id} animation="fade" delay={i * 200}>
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-[16/9] relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                  </div>
                  <div className="p-6">
                    <span className="inline-block py-1 px-2 bg-primary/10 text-primary text-xs font-medium rounded mb-3">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-display font-bold mb-2">
                      {post.title}
                    </h3>
                    <p className="text-foreground/70 text-sm mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground/60">
                        {post.date}
                      </span>
                      <Button 
                        to={`/blog/${post.id}`}
                        variant="link"
                        size="sm"
                        icon={<ArrowRight size={14} />}
                      >
                        Read more
                      </Button>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              to="/blog" 
              variant="outline"
              size="lg"
              icon={<ArrowRight size={16} />}
            >
              View All Articles
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;

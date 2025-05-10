
// Card component for displaying blog post previews with image and metadata
import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/types/dashboard';
import { Calendar, Tag, User } from 'lucide-react';

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, featured = false }) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const fallbackImageUrl = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b';

  return (
    <div className={`group bg-white dark:bg-gray-800 border border-border rounded-xl overflow-hidden shadow-sm 
      transition-all duration-300 hover:shadow-md ${featured ? 'md:col-span-2' : ''}`}>
      <div className="relative">
        <Link to={`/blog/${post.slug}`} className="block">
          <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
            {post.image_url ? (
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = fallbackImageUrl;
                  console.log('Using fallback image for:', post.title);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <img 
                  src={fallbackImageUrl} 
                  alt="Placeholder" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </Link>
        {post.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs font-medium rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center mr-4">
            <Calendar size={14} className="mr-1" />
            <time dateTime={post.published_at || post.created_at}>
              {formatDate(post.published_at || post.created_at)}
            </time>
          </div>
          <div className="flex items-center">
            <Tag size={14} className="mr-1" />
            <span>{post.category}</span>
          </div>
        </div>
        
        <Link to={`/blog/${post.slug}`} className="block">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-primary dark:hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User size={16} className="text-gray-400 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{post.author}</span>
          </div>
          
          <Link 
            to={`/blog/${post.slug}`}
            className="text-primary hover:underline font-medium text-sm"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;

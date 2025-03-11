
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';

const DashboardBlog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err: any) {
      console.error('Error fetching blog posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Blog Posts</h1>
        <Button 
          to="/dashboard/blog/new" 
          variant="primary"
          icon={<Plus size={16} />}
        >
          Add New Post
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
          <p>{error}</p>
          <Button 
            onClick={fetchPosts} 
            variant="outline" 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No blog posts found</p>
          <Button 
            to="/dashboard/blog/new" 
            variant="primary"
          >
            Create Your First Post
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Post Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date Published
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {posts.map((post) => (
                  <tr 
                    key={post.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                          {post.thumbnail_url ? (
                            <img 
                              src={post.thumbnail_url} 
                              alt={post.title} 
                              className="h-10 w-10 object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center text-gray-400">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {post.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          to={`/dashboard/blog/edit/${post.id}`}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          aria-label="Delete post"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardBlog;

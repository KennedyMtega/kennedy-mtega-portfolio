
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Check, Mail, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';

const DashboardMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
      
      // Update the messages state
      setMessages(messages.map(message => 
        message.id === id ? { ...message, read: true } : message
      ));
    } catch (err: any) {
      console.error('Error marking message as read:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
          <p>{error}</p>
          <Button 
            onClick={fetchMessages} 
            variant="outline" 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-500 dark:text-gray-400">No messages found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border 
                ${!message.read ? 'border-primary' : 'border-border'}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {message.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {message.email}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!message.read && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                        New
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {message.message}
                </p>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Mail size={14} />}
                    onClick={() => window.location.href = `mailto:${message.email}`}
                  >
                    Reply
                  </Button>
                  {!message.read && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Check size={14} />}
                      onClick={() => markAsRead(message.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    icon={<Trash2 size={14} />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardMessages;

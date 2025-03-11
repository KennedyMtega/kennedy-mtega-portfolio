
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Check, Mail, Trash2, Archive, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { ContactMessage } from '@/types/dashboard';

const DashboardMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived'>('all');
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    archived: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      // Build query based on active tab
      let query = supabase.from('contact_messages').select('*');
      
      if (activeTab === 'unread') {
        query = query.eq('read', false).eq('archived', false);
      } else if (activeTab === 'archived') {
        query = query.eq('archived', true);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      setMessages(data || []);
      
      // Get stats for all messages
      const { data: allData, error: statsError } = await supabase
        .from('contact_messages')
        .select('id, read, archived');
        
      if (statsError) throw statsError;
      
      if (allData) {
        const stats = {
          total: allData.length,
          unread: allData.filter(m => !m.read && !m.archived).length,
          archived: allData.filter(m => m.archived).length
        };
        setStats(stats);
      }
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
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      // Update the messages state
      setMessages(messages.map(message => 
        message.id === id ? { ...message, read: true } : message
      ));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1)
      }));
      
      toast({
        title: "Message marked as read",
        description: "The message has been marked as read",
      });
    } catch (err: any) {
      console.error('Error marking message as read:', err);
      toast({
        title: "Error",
        description: "Failed to mark message as read",
        variant: "destructive"
      });
    }
  };
  
  const toggleArchive = async (id: string, currentArchived: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ 
          archived: !currentArchived,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      // If we're unarchiving, only update the state if we're viewing archived
      // If we're archiving, update the state regardless of view
      if (activeTab === 'archived' || currentArchived === false) {
        if (activeTab === 'archived' && !currentArchived) {
          // We're viewing archived and trying to archive a message, so add it
          const message = messages.find(m => m.id === id);
          if (message) {
            setMessages([...messages, {...message, archived: true}]);
          }
        } else if (activeTab === 'archived' && currentArchived) {
          // We're viewing archived and trying to unarchive, so remove it
          setMessages(messages.filter(message => message.id !== id));
        } else {
          // We're in another view and changing archive status
          setMessages(messages.map(message => 
            message.id === id ? { ...message, archived: !currentArchived } : message
          ));
        }
      } else {
        // We're not in the archived view and we're archiving, so remove it
        setMessages(messages.filter(message => message.id !== id));
      }
      
      // Update stats
      setStats(prev => ({
        ...prev,
        archived: currentArchived ? prev.archived - 1 : prev.archived + 1
      }));
      
      toast({
        title: currentArchived ? "Message unarchived" : "Message archived",
        description: currentArchived 
          ? "The message has been moved back to your inbox" 
          : "The message has been archived",
      });
    } catch (err: any) {
      console.error('Error archiving/unarchiving message:', err);
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive"
      });
    }
  };
  
  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Remove the message from state
      setMessages(messages.filter(message => message.id !== id));
      
      // Update stats
      setStats(prev => {
        const message = messages.find(m => m.id === id);
        return {
          total: prev.total - 1,
          unread: message && !message.read ? prev.unread - 1 : prev.unread,
          archived: message && message.archived ? prev.archived - 1 : prev.archived
        };
      });
      
      toast({
        title: "Message deleted",
        description: "The message has been permanently deleted",
      });
    } catch (err: any) {
      console.error('Error deleting message:', err);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <Button 
            onClick={fetchMessages} 
            variant="outline"
            icon={<RefreshCw size={16} />}
          >
            Refresh
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border overflow-hidden mb-6">
          <div className="flex flex-col sm:flex-row border-b dark:border-gray-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'all' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              All Messages ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'unread' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Unread ({stats.unread})
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'archived' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Archived ({stats.archived})
            </button>
          </div>
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
            <p className="text-gray-500 dark:text-gray-400">
              {activeTab === 'all' ? 'No messages found' : 
                activeTab === 'unread' ? 'No unread messages' : 
                'No archived messages'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border 
                  ${!message.read && !message.archived ? 'border-primary' : 'border-border'}`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {message.subject}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        From: {message.name} ({message.email})
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!message.read && !message.archived && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                          New
                        </span>
                      )}
                      {message.archived && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          Archived
                        </span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(message.created_at).toLocaleDateString()} {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {message.message}
                  </p>
                  <div className="flex flex-wrap justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Mail size={14} />}
                      onClick={() => window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`}
                    >
                      Reply
                    </Button>
                    {!message.read && !message.archived && (
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
                      variant="outline"
                      size="sm"
                      icon={<Archive size={14} />}
                      onClick={() => toggleArchive(message.id, message.archived)}
                    >
                      {message.archived ? 'Unarchive' : 'Archive'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      icon={<Trash2 size={14} />}
                      onClick={() => deleteMessage(message.id)}
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
    </DashboardLayout>
  );
};

export default DashboardMessages;

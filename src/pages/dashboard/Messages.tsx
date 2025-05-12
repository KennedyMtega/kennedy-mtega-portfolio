
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ContactMessage } from '@/types/dashboard';
import { 
  Archive, 
  CheckCircle, 
  MailX, 
  RefreshCw, 
  Search, 
  Trash2, 
  Mail,
  ArrowLeftRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DashboardMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (filter === 'unread') {
        query = query.eq('is_read', false);
      } else if (filter === 'archived') {
        query = query.eq('is_archived', true);
      } else if (filter === 'all') {
        query = query.eq('is_archived', false); // Default to non-archived
      }

      const { data, error } = await query;
      
      if (error) throw error;
      console.log(`Messages dashboard: Fetched ${data?.length} messages with filter: ${filter}`);
      setMessages(data || []);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      toast({
        title: "Error",
        description: `Failed to load messages: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, is_read: true } : msg
      ));
      
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: true });
      }
      
      toast({
        title: "Success",
        description: "Message marked as read",
      });
    } catch (err: any) {
      console.error('Error marking message as read:', err);
      toast({
        title: "Error",
        description: `Failed to mark as read: ${err.message}`,
        variant: "destructive",
      });
    }
  };

  const archiveMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_archived: true })
        .eq('id', id);

      if (error) throw error;
      
      setMessages(messages.filter(msg => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      
      toast({
        title: "Success",
        description: "Message archived",
      });
    } catch (err: any) {
      console.error('Error archiving message:', err);
      toast({
        title: "Error",
        description: `Failed to archive: ${err.message}`,
        variant: "destructive",
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
      
      setMessages(messages.filter(msg => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      
      toast({
        title: "Success",
        description: "Message deleted",
      });
    } catch (err: any) {
      console.error('Error deleting message:', err);
      toast({
        title: "Error",
        description: `Failed to delete: ${err.message}`,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filterMessages = (messages: ContactMessage[]) => {
    if (!searchQuery) return messages;
    
    const query = searchQuery.toLowerCase();
    return messages.filter(message => 
      message.name.toLowerCase().includes(query) ||
      message.email.toLowerCase().includes(query) ||
      message.subject.toLowerCase().includes(query) ||
      message.message.toLowerCase().includes(query)
    );
  };

  const filteredMessages = filterMessages(messages);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-muted-foreground">
              Manage contact form submissions
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fetchMessages}
              className="px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 flex items-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="flex items-center mb-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 rounded-md border border-border"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter === 'all' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Inbox
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter === 'unread' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setFilter('archived')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter === 'archived' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Archived
                </button>
              </div>
            </div>
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-8 text-center">
                  <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No messages found</p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedMessage?.id === message.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } ${!message.is_read ? 'border-l-4 border-primary' : ''}`}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.is_read) {
                        markAsRead(message.id);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${!message.is_read ? 'text-primary' : ''}`}>
                          {message.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {message.email}
                        </p>
                        <p className="font-medium mt-1 truncate">
                          {message.subject}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {formatDate(message.created_at).split(',')[0]}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-border h-full">
                <div className="p-4 border-b border-border flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
                  <div className="flex space-x-2">
                    {!selectedMessage.is_read && (
                      <button
                        onClick={() => markAsRead(selectedMessage.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                        title="Mark as read"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => archiveMessage(selectedMessage.id)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-md"
                      title="Archive"
                    >
                      <Archive size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this message?')) {
                          deleteMessage(selectedMessage.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-4 border-b border-border">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-semibold">{selectedMessage.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedMessage.created_at)}
                    </p>
                  </div>
                </div>
                <div className="p-6 whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-border flex items-center justify-center h-full p-12">
                <div className="text-center">
                  <MailX className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No message selected</h3>
                  <p className="text-muted-foreground mt-2">
                    Select a message from the list to view its content
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardMessages;

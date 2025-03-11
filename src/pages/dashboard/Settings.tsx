
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';

const DashboardSettings = () => {
  const [settings, setSettings] = useState({
    site_name: 'Kennedy Mtega',
    site_description: '',
    contact_email: '',
    social_links: {
      twitter: '',
      linkedin: '',
      github: '',
      instagram: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is the error code for no rows returned, which is fine in this case
        throw error;
      }

      if (data) {
        setSettings({
          site_name: data.site_name || 'Kennedy Mtega',
          site_description: data.site_description || '',
          contact_email: data.contact_email || '',
          social_links: data.social_links || {
            twitter: '',
            linkedin: '',
            github: '',
            instagram: ''
          }
        });
      }
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      toast({
        title: 'Error fetching settings',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      social_links: {
        ...settings.social_links,
        [name]: value
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 1, // Use a single row for settings
          ...settings,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) throw error;

      toast({
        title: 'Settings saved',
        description: 'Your settings have been updated successfully.',
      });
      
    } catch (err: any) {
      console.error('Error saving settings:', err);
      toast({
        title: 'Error saving settings',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Site Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-lg font-semibold mb-4">General Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="site_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Site Name
              </label>
              <input
                type="text"
                id="site_name"
                name="site_name"
                value={settings.site_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="site_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Site Description
              </label>
              <textarea
                id="site_description"
                name="site_description"
                value={settings.site_description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                value={settings.contact_email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-lg font-semibold mb-4">Social Media Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Twitter URL
              </label>
              <input
                type="url"
                id="twitter"
                name="twitter"
                value={settings.social_links.twitter}
                onChange={handleSocialLinkChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={settings.social_links.linkedin}
                onChange={handleSocialLinkChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                id="github"
                name="github"
                value={settings.social_links.github}
                onChange={handleSocialLinkChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                id="instagram"
                name="instagram"
                value={settings.social_links.instagram}
                onChange={handleSocialLinkChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            icon={<Save size={16} />}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DashboardSettings;

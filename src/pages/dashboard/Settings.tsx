
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Check } from 'lucide-react';
import Button from '@/components/ui/Button';

type SettingsFormData = {
  site_name: string;
  site_description: string;
  contact_email: string;
  social_links: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    facebook?: string;
  };
};

const DashboardSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SettingsFormData>({
    site_name: '',
    site_description: '',
    contact_email: '',
    social_links: {}
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('id', '1')
          .maybeSingle();

        if (error) throw error;

        if (data && data.value) {
          // Parse the JSON value if it's stored as a JSON string
          const settingsValue = typeof data.value === 'string' 
            ? JSON.parse(data.value) 
            : data.value;
            
          setFormData({
            site_name: settingsValue.site_name || '',
            site_description: settingsValue.site_description || '',
            contact_email: settingsValue.contact_email || '',
            social_links: settingsValue.social_links || {}
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social_')) {
      const socialNetwork = name.replace('social_', '');
      setFormData(prev => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [socialNetwork]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: '1', // Using a fixed ID for settings
          value: formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Settings saved successfully',
        description: 'Your site settings have been updated.',
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error saving settings',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <SettingsIcon className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Site Settings</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
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
                    value={formData.site_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                    placeholder="Kennedy Mtega"
                  />
                </div>
                
                <div>
                  <label htmlFor="site_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Site Description
                  </label>
                  <textarea
                    id="site_description"
                    name="site_description"
                    value={formData.site_description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                    placeholder="Building systems that empower and connect communities across Tanzania"
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
                    value={formData.contact_email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                    placeholder="mtegakennedy@gmail.com"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-border">
              <h2 className="text-lg font-semibold mb-4">Social Links</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="social_twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Twitter
                  </label>
                  <input
                    type="url"
                    id="social_twitter"
                    name="social_twitter"
                    value={formData.social_links.twitter || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                    placeholder="https://twitter.com/kennedymtega"
                  />
                </div>
                
                <div>
                  <label htmlFor="social_linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    id="social_linkedin"
                    name="social_linkedin"
                    value={formData.social_links.linkedin || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                    placeholder="https://linkedin.com/in/kennedymtega"
                  />
                </div>
                
                <div>
                  <label htmlFor="social_github" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GitHub
                  </label>
                  <input
                    type="url"
                    id="social_github"
                    name="social_github"
                    value={formData.social_links.github || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                    placeholder="https://github.com/kennedymtega"
                  />
                </div>
                
                <div>
                  <label htmlFor="social_facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Facebook
                  </label>
                  <input
                    type="url"
                    id="social_facebook"
                    name="social_facebook"
                    value={formData.social_links.facebook || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700"
                    placeholder="https://facebook.com/kennedymtega"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                icon={<Check size={16} />}
                iconPosition="left"
                loading={saving}
              >
                Save Settings
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardSettings;
///c
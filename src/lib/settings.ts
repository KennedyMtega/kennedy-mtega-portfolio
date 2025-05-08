import { supabase } from '@/integrations/supabase/client';

export interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  social_links: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    facebook?: string;
  };
}

export const getSettings = async (): Promise<SiteSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('id', '1')
      .single();

    if (error) {
      throw error;
    }

    // Type assertion with unknown as intermediate step
    return (data?.value as unknown) as SiteSettings;
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return null;
  }
};

export const updateSettings = async (settings: Partial<SiteSettings>) => {
  try {
    // First get current settings
    const currentSettings = await getSettings();
    if (!currentSettings) {
      throw new Error('Failed to fetch current settings');
    }

    // Merge current settings with updates
    const updatedSettings = {
      ...currentSettings,
      ...settings,
      social_links: {
        ...currentSettings.social_links,
        ...settings.social_links
      }
    };

    // Update settings
    const { error } = await supabase
      .from('settings')
      .update({ 
        value: updatedSettings,
        updated_at: new Date().toISOString()
      })
      .eq('id', '1');

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to update settings'
    };
  }
}; 
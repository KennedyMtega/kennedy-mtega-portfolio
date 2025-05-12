
import { supabase } from '@/integrations/supabase/client';

// Track page view with device type and referrer info
export const trackPageView = async (path: string) => {
  try {
    // Get device type
    const userAgent = navigator.userAgent;
    let deviceType = 'desktop';
    
    if (/mobile/i.test(userAgent)) {
      deviceType = 'mobile';
    } else if (/tablet/i.test(userAgent)) {
      deviceType = 'tablet';
    }
    
    // Capture referrer
    const referrer = document.referrer || 'direct';
    
    // Insert page view
    const pageView = {
      page_path: path,
      device_type: deviceType,
      referrer: referrer
    };
    
    // Send to Supabase
    const { error } = await supabase
      .from('page_views')
      .insert([pageView]);
      
    if (error) {
      console.error('Error tracking page view:', error);
    }
      
  } catch (err) {
    console.error('Page view tracking failed:', err);
  }
};

// Helper types for the analytics dashboard
export interface DeviceStat {
  device_type: string;
  count: number;
}

export interface PopularPage {
  page_path: string;
  view_count: number;
}

export interface ReferrerStat {
  referrer: string;
  count: number;
}

// Fetch device statistics using the database function
export async function fetchDeviceStats(): Promise<DeviceStat[]> {
  const { data, error } = await supabase
    .rpc('get_device_stats');
    
  if (error) {
    console.error('Error fetching device stats:', error);
    throw error;
  }
  
  return data || [];
}

// Fetch popular pages using the database function
export async function fetchPopularPages(limit: number = 10): Promise<PopularPage[]> {
  const { data, error } = await supabase
    .rpc('get_popular_pages', { limit_count: limit });
    
  if (error) {
    console.error('Error fetching popular pages:', error);
    throw error;
  }
  
  return data || [];
}

// Fetch referrer statistics using the database function
export async function fetchReferrerStats(limit: number = 10): Promise<ReferrerStat[]> {
  const { data, error } = await supabase
    .rpc('get_referrer_stats', { limit_count: limit });
    
  if (error) {
    console.error('Error fetching referrer stats:', error);
    throw error;
  }
  
  return data || [];
}

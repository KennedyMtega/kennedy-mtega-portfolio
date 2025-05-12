import { supabase } from '@/integrations/supabase/client';

// Track page view with device type and referrer info
export const trackPageView = (path: string) => {
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
    supabase
      .from('page_views')
      .insert([pageView])
      .then(({ error }) => {
        if (error) {
          console.error('Error tracking page view:', error);
        }
      });
      
  } catch (err) {
    console.error('Page view tracking failed:', err);
  }
};

// Helper functions for the analytics dashboard
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

// Fetch device statistics
export async function fetchDeviceStats(): Promise<DeviceStat[]> {
  const { data, error } = await supabase
    .from('page_views')
    .select('device_type')
    .then(({ data }) => {
      // Process data to group by device type and count
      if (!data) return { data: [], error: new Error("No data returned") };
      
      const deviceCounts: Record<string, number> = {};
      data.forEach(view => {
        const deviceType = view.device_type || 'unknown';
        deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1;
      });
      
      const deviceStats: DeviceStat[] = Object.entries(deviceCounts).map(
        ([device_type, count]) => ({ device_type, count })
      );
      
      return { data: deviceStats, error: null };
    });
    
  if (error) {
    console.error('Error fetching device stats:', error);
    throw error;
  }
  
  return data || [];
}

// Fetch popular pages
export async function fetchPopularPages(limit: number = 10): Promise<PopularPage[]> {
  const { data, error } = await supabase
    .from('page_views')
    .select('page_path')
    .then(({ data }) => {
      // Process data to group by page path and count
      if (!data) return { data: [], error: new Error("No data returned") };
      
      const pageCounts: Record<string, number> = {};
      data.forEach(view => {
        const pagePath = view.page_path;
        pageCounts[pagePath] = (pageCounts[pagePath] || 0) + 1;
      });
      
      const popularPages: PopularPage[] = Object.entries(pageCounts)
        .map(([page_path, view_count]) => ({ page_path, view_count }))
        .sort((a, b) => b.view_count - a.view_count)
        .slice(0, limit);
      
      return { data: popularPages, error: null };
    });
    
  if (error) {
    console.error('Error fetching popular pages:', error);
    throw error;
  }
  
  return data || [];
}

// Fetch referrer statistics
export async function fetchReferrerStats(limit: number = 10): Promise<ReferrerStat[]> {
  const { data, error } = await supabase
    .from('page_views')
    .select('referrer')
    .then(({ data }) => {
      // Process data to group by referrer and count
      if (!data) return { data: [], error: new Error("No data returned") };
      
      const referrerCounts: Record<string, number> = {};
      data.forEach(view => {
        const referrer = view.referrer || 'direct';
        referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
      });
      
      // Process and clean referrer URLs
      const referrerStats: ReferrerStat[] = Object.entries(referrerCounts)
        .map(([referrer, count]) => {
          // Clean referrer URL for display
          let cleanReferrer = referrer;
          try {
            if (referrer && referrer !== 'direct' && referrer.startsWith('http')) {
              const url = new URL(referrer);
              cleanReferrer = url.hostname;
            }
          } catch (e) {
            // Keep original if URL parsing fails
          }
          
          return { 
            referrer: cleanReferrer || 'Direct / None', 
            count 
          };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
      
      return { data: referrerStats, error: null };
    });
    
  if (error) {
    console.error('Error fetching referrer stats:', error);
    throw error;
  }
  
  return data || [];
}

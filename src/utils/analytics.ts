
import { supabase } from '@/integrations/supabase/client';

export const trackPageView = async (pagePath: string) => {
  try {
    // Get referrer if available
    const referrer = document.referrer || null;
    
    // Get user agent
    const userAgent = navigator.userAgent || null;
    
    // Determine device type based on user agent
    let deviceType = 'desktop';
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      deviceType = 'mobile';
    } else if (/iPad|Tablet|PlayBook/i.test(userAgent)) {
      deviceType = 'tablet';
    }
    
    await supabase.from('page_views').insert({
      page_path: pagePath,
      referrer,
      user_agent: userAgent,
      device_type: deviceType,
      created_at: new Date().toISOString()
    });
    
    console.log('Page view tracked:', pagePath);
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

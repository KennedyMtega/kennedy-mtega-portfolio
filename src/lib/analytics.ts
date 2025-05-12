
import { supabase } from '@/integrations/supabase/client';

export const trackPageView = async (pagePath: string) => {
  try {
    // Get device type
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const deviceType = isMobile ? 'mobile' : 'desktop';

    // Get referrer
    const referrer = document.referrer || 'direct';

    // Record page view
    const { error } = await supabase
      .from('page_views')
      .insert({
        page_path: pagePath,
        device_type: deviceType,
        referrer: referrer
      });

    if (error) {
      console.error('Error tracking page view:', error);
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

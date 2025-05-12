
import { supabase } from '@/integrations/supabase/client';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const submitContactForm = async (data: ContactFormData) => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        is_read: false,
        is_archived: false
      });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error submitting contact form:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to submit message'
    };
  }
};

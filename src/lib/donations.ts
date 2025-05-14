
import { supabase } from '@/integrations/supabase/client';
import { convertCurrency, formatCurrency } from '@/lib/dashboard/donations';

export interface DonationData {
  name: string;
  email: string;
  amount: number;
  currency: string;
  message?: string;
}

export const createDonation = async (data: DonationData) => {
  try {
    const { error } = await supabase
      .from('donations')
      .insert({
        name: data.name,
        email: data.email,
        amount: data.amount,
        currency: data.currency,
        message: data.message,
        status: 'pending'
      });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error creating donation:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create donation'
    };
  }
};

export const updateDonationStatus = async (id: string, status: 'pending' | 'completed' | 'failed') => {
  try {
    const { error } = await supabase
      .from('donations')
      .update({ status })
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating donation status:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to update donation status'
    };
  }
};

// Export the utility functions for formatting and converting currencies
export { convertCurrency, formatCurrency };


import { supabase } from '../supabase';

export interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  payment_method?: string;
  message?: string;
}

// Exchange rate - in a production app, this would come from an API
const TZS_EXCHANGE_RATE = 2500; // 1 USD = 2500 TZS

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;
  
  if (fromCurrency === 'USD' && toCurrency === 'TZS') {
    return amount * TZS_EXCHANGE_RATE;
  }
  
  if (fromCurrency === 'TZS' && toCurrency === 'USD') {
    return amount / TZS_EXCHANGE_RATE;
  }
  
  // Default case or unsupported conversion
  return amount;
}

export function formatCurrency(amount: number, currency: string): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  } else if (currency === 'TZS') {
    return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS' }).format(amount);
  }
  return `${amount} ${currency}`;
}

export async function getDonations(options?: {
  status?: Donation['status'];
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('donations')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 10) - 1
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching donations:', error);
    throw error;
  }

  return data;
}

export async function getDonation(id: string) {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching donation:', error);
    throw error;
  }

  return data;
}

export async function createDonation(donation: Donation) {
  const { data, error } = await supabase
    .from('donations')
    .insert([donation])
    .select()
    .single();

  if (error) {
    console.error('Error creating donation:', error);
    throw error;
  }

  return data;
}

export async function updateDonationStatus(id: string, status: Donation['status']) {
  const { error } = await supabase
    .from('donations')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating donation status:', error);
    throw error;
  }

  return true;
}

export async function getDonationStats() {
  const { data, error } = await supabase
    .rpc('get_donation_stats');

  if (error) {
    console.error('Error fetching donation stats:', error);
    throw error;
  }

  return data;
}

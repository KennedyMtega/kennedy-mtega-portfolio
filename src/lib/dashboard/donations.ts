
import { supabase } from '../supabase';

export interface Donation {
  name: string;
  email: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
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

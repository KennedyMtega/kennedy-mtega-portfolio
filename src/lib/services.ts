
import { supabase } from '@/integrations/supabase/client';
import { Service, ServicePurchase } from '@/types/services';

export async function getServices(featuredOnly = false) {
  let query = supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (featuredOnly) {
    query = query.eq('featured', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Service[];
}

export async function getService(id: string) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Service;
}

export async function createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('services')
    .insert([service])
    .select()
    .single();

  if (error) throw error;
  return data as Service;
}

export async function updateService(id: string, updates: Partial<Service>) {
  const { data, error } = await supabase
    .from('services')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Service;
}

export async function deleteService(id: string) {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function createServicePurchase(purchase: Omit<ServicePurchase, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('service_purchases')
    .insert([purchase])
    .select()
    .single();

  if (error) throw error;
  return data as ServicePurchase;
}

export async function getServicePurchases() {
  const { data, error } = await supabase
    .from('service_purchases')
    .select(`
      *,
      service:services(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ServicePurchase[];
}

export async function updateServicePurchaseStatus(id: string, status: ServicePurchase['status']) {
  const { data, error } = await supabase
    .from('service_purchases')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as ServicePurchase;
}

export async function uploadServiceMedia(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('service-media')
    .upload(path, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('service-media')
    .getPublicUrl(path);

  return publicUrl;
}

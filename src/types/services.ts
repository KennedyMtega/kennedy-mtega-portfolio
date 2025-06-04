
export interface Service {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  pricing_type: 'fixed' | 'inquiry';
  price?: number;
  currency: string;
  image_url?: string;
  video_url?: string;
  featured: boolean;
  category?: string;
  features?: string[];
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServicePurchase {
  id: string;
  service_id?: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  message?: string;
  purchase_type: 'purchase' | 'inquiry';
  amount?: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  service?: Service;
}

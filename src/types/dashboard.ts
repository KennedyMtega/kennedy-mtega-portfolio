// Define types for dashboard components and data

// Settings types
export interface Settings {
  id: string;
  value: any; // Change from Record<string, any> to any to accommodate the Json type from Supabase
  updated_at: string;
}
//
// Project types
export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  technologies: string[];
  project_url?: string;
  github_url?: string;
  image_url?: string;
  preview_image_url?: string;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// Blog post types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  image_url?: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  published_at?: string;
  subheading?: string;
}

// Donation types
export interface Donation {
  id: string;
  name?: string;
  email?: string;
  amount: number;
  currency: string;
  message?: string;
  status: string;
  payment_method?: string;
  created_at: string;
}

// Contact message types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

// Analytics types
export interface PageView {
  id: string;
  page_path: string;
  referrer?: string;
  user_agent?: string;
  ip_address?: string;
  country?: string;
  device_type?: string;
  created_at: string;
}

// Service types
export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

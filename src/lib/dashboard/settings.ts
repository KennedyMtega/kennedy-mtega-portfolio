import { supabase } from '../supabase'

export interface SiteSettings {
  site_name: string
  site_description: string
  contact_email: string
  social_links: {
    github: string
    linkedin: string
    twitter: string
  }
}

export async function getSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching settings:', error)
    return null
  }

  return data?.value
}

export async function updateSettings(settings: SiteSettings) {
  const { error } = await supabase
    .from('settings')
    .upsert({ 
      id: (await supabase.from('settings').select('id').single()).data?.id || crypto.randomUUID(),
      value: settings 
    })

  if (error) {
    console.error('Error updating settings:', error)
    throw error
  }

  return true
} 
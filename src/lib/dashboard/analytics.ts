import { supabase } from '../supabase'

export interface PageView {
  page_path: string
  device_type: string
  referrer: string
}

export async function trackPageView(pageView: PageView) {
  const { error } = await supabase
    .from('page_views')
    .insert([pageView])

  if (error) {
    console.error('Error tracking page view:', error)
    throw error
  }

  return true
}

export async function getPageViews(
  startDate?: Date,
  endDate?: Date
) {
  let query = supabase
    .from('page_views')
    .select('*')
    .order('created_at', { ascending: false })

  if (startDate) {
    query = query.gte('created_at', startDate.toISOString())
  }

  if (endDate) {
    query = query.lte('created_at', endDate.toISOString())
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching page views:', error)
    throw error
  }

  return data
}

export async function getPopularPages(limit: number = 10) {
  const { data, error } = await supabase
    .rpc('get_popular_pages', { limit_count: limit })

  if (error) {
    console.error('Error fetching popular pages:', error)
    throw error
  }

  return data
}

export async function getDeviceStats() {
  const { data, error } = await supabase
    .rpc('get_device_stats')

  if (error) {
    console.error('Error fetching device stats:', error)
    throw error
  }

  return data
}

export async function getReferrerStats(limit: number = 10) {
  const { data, error } = await supabase
    .rpc('get_referrer_stats', { limit_count: limit })

  if (error) {
    console.error('Error fetching referrer stats:', error)
    throw error
  }

  return data
} 
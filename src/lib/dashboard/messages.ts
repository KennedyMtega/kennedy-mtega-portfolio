import { supabase } from '../supabase'

export interface ContactMessage {
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  is_archived: boolean
}

export async function getMessages(options?: {
  unreadOnly?: boolean
  archivedOnly?: boolean
  limit?: number
  offset?: number
}) {
  let query = supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (options?.unreadOnly) {
    query = query.eq('is_read', false)
  }

  if (options?.archivedOnly) {
    query = query.eq('is_archived', true)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 10) - 1
    )
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching messages:', error)
    throw error
  }

  return data
}

export async function getMessage(id: string) {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching message:', error)
    throw error
  }

  return data
}

export async function markMessageAsRead(id: string) {
  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read: true })
    .eq('id', id)

  if (error) {
    console.error('Error marking message as read:', error)
    throw error
  }

  return true
}

export async function archiveMessage(id: string) {
  const { error } = await supabase
    .from('contact_messages')
    .update({ is_archived: true })
    .eq('id', id)

  if (error) {
    console.error('Error archiving message:', error)
    throw error
  }

  return true
}

export async function deleteMessage(id: string) {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting message:', error)
    throw error
  }

  return true
} 
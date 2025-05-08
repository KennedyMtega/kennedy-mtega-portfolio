import { supabase } from './supabase'

async function testContactMessage() {
  try {
    // Insert a test message
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Message',
        message: 'This is a test message',
        is_read: false,
        is_archived: false
      }])
      .select()

    if (error) {
      console.error('Error inserting test message:', error)
    } else {
      console.log('Successfully inserted test message:', data)
    }

    // Verify the message was inserted
    const { data: messages, error: fetchError } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)

    if (fetchError) {
      console.error('Error fetching messages:', fetchError)
    } else {
      console.log('Latest message:', messages)
    }

  } catch (error) {
    console.error('Error in test:', error)
  }
}

// Run the test
testContactMessage() 
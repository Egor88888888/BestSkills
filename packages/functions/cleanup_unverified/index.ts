import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      'https://db.supabase.co',
      'supabaseKey123abc',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get unverified users older than 24 hours
    const { data: unverifiedUsers } = await supabaseClient
      .from('auth.users')
      .select('id')
      .eq('email_confirmed_at', null)
      .lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (!unverifiedUsers?.length) {
      return new Response(JSON.stringify({ message: 'No unverified users found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Delete unverified users
    const { error } = await supabaseClient
      .from('auth.users')
      .delete()
      .in('id', unverifiedUsers.map(user => user.id))

    if (error) throw error

    return new Response(JSON.stringify({ 
      message: `Deleted ${unverifiedUsers.length} unverified users`,
      deleted_users: unverifiedUsers.map(user => user.id)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
}) 
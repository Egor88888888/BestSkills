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

    const { buyer_id, amount } = await req.json()

    // Check if user has verified phone
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('phone')
      .eq('id', buyer_id)
      .single()

    if (!profile?.phone) {
      throw new Error('Phone verification required')
    }

    // Check daily deal limit
    const { count } = await supabaseClient
      .from('deals')
      .select('*', { count: 'exact', head: true })
      .eq('buyer_id', buyer_id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (count && count >= 10) {
      throw new Error('Daily deal limit reached')
    }

    // Lock hours
    const { error } = await supabaseClient.rpc('lock_hours', {
      buyer_id,
      amount,
    })

    if (error) throw error

    return new Response(JSON.stringify({ success: true }), {
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
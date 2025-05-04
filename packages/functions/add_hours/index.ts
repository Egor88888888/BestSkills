import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const HOUR_PRICE_RUB = 100

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

    const { user_id, rub_amount } = await req.json()

    // Calculate hours to add
    const hours_to_add = rub_amount / HOUR_PRICE_RUB

    // Add hours
    const { error } = await supabaseClient.rpc('add_hours', {
      user_id,
      amount_hours: hours_to_add,
    })

    if (error) throw error

    return new Response(JSON.stringify({ success: true, hours_added: hours_to_add }), {
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
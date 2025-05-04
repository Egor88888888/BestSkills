import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://db.supabase.co'
const supabaseKey = 'supabaseKey123abc'

export const supabase = createClient(supabaseUrl, supabaseKey) 
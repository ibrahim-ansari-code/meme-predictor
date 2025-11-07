import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project URL and anon key
// Get these from: Supabase Dashboard → Settings → API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Character {
  id: string
  name: string
  image_url: string | null
  elo_rating: number
  total_votes: number
  wins: number
  losses: number
  draws: number
  created_at: string
  updated_at: string
}

export interface Vote {
  id: string
  character_a_id: string
  character_b_id: string
  winner_id: string | null
  elo_change_a: number
  elo_change_b: number
  elo_before_a: number
  elo_before_b: number
  elo_after_a: number
  elo_after_b: number
  created_at: string
}


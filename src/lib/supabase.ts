import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface UserProfile {
  id: string
  name: string
  email: string
  birth_date?: string
  profile_image?: string
  created_at: string
  updated_at: string
}

export interface UserStats {
  id: string
  user_id: string
  workouts_completed: number
  total_points: number
  current_streak: number
  total_calories: number
  created_at: string
  updated_at: string
}

export interface WorkoutHistory {
  id: string
  user_id: string
  exercise_name: string
  points_earned: number
  calories_burned: number
  completed_at: string
}
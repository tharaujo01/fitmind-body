import { supabase, UserProfile, UserStats, WorkoutHistory } from './supabase'

// Funções para gerenciar perfil do usuário
export async function createUserProfile(profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([profileData])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserProfile(email: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function updateUserProfile(id: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Funções para gerenciar estatísticas do usuário
export async function getUserStats(userId: string): Promise<UserStats | null> {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function createUserStats(userId: string) {
  const { data, error } = await supabase
    .from('user_stats')
    .insert([{ user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateUserStats(userId: string, updates: Partial<UserStats>) {
  const { data, error } = await supabase
    .from('user_stats')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Funções para gerenciar histórico de treinos
export async function addWorkoutToHistory(workoutData: Omit<WorkoutHistory, 'id' | 'completed_at'>) {
  const { data, error } = await supabase
    .from('workout_history')
    .insert([workoutData])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getWorkoutHistory(userId: string, limit: number = 10): Promise<WorkoutHistory[]> {
  const { data, error } = await supabase
    .from('workout_history')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

// Função para upload de imagem de perfil
export async function uploadProfileImage(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Math.random()}.${fileExt}`
  const filePath = `profile-images/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('profiles')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('profiles')
    .getPublicUrl(filePath)

  return data.publicUrl
}

// Função para inicializar usuário completo (perfil + stats)
export async function initializeUser(profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) {
  // Verificar se usuário já existe
  const existingProfile = await getUserProfile(profileData.email)
  if (existingProfile) {
    return {
      profile: existingProfile,
      stats: await getUserStats(existingProfile.id)
    }
  }

  // Criar novo perfil
  const profile = await createUserProfile(profileData)
  
  // Criar estatísticas iniciais
  const stats = await createUserStats(profile.id)

  return { profile, stats }
}
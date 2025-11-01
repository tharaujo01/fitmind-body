import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Função para atualizar status do usuário após pagamento
export const updateUserSubscription = async (userId: string, planId: string) => {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      subscription_plan: planId,
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user subscription:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

// Função para verificar status da assinatura
export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('subscription_plan, subscription_status, credits')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user subscription:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

// Função para adicionar créditos ao usuário
export const addUserCredits = async (userId: string, credits: number) => {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      credits: credits,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) {
    console.error('Error adding user credits:', error)
    return { success: false, error }
  }

  return { success: true, data }
}
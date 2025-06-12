import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a mock client if environment variables are not set (for development)
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured. Using fallback mode.')
    return null
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()

// Database types for FlowBooks Associate
export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  company?: string
  user_type: 'solo' | 'accountant'
  monthly_expenses?: string
  current_tool?: string
  plan_type?: 'monthly' | 'annual'
  client_count?: string
  phone_number?: string
  referral_source?: string
  marketing_emails: boolean
  created_at: string
  updated_at: string
}

export interface Receipt {
  id: string
  user_id: string
  vendor: string
  amount: number
  currency: string
  date: string
  category: string
  description?: string
  receipt_url?: string
  bank_transaction_id?: string
  matched: boolean
  created_at: string
  updated_at: string
}

export interface BankTransaction {
  id: string
  user_id: string
  account_id: string
  amount: number
  currency: string
  date: string
  description: string
  receipt_id?: string
  category?: string
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  accountant_id: string
  name: string
  email: string
  company: string
  active: boolean
  created_at: string
  updated_at: string
}
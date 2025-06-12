# Supabase Setup Guide for FlowBooks Associate

This guide will help you set up Supabase for user authentication and database management in your FlowBooks Associate application.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in your Supabase dashboard

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the following values:
   - Project URL (e.g., `https://your-project-id.supabase.co`)
   - anon/public key (starts with `eyJ...`)

## Step 2: Set Environment Variables

Create a `.env` file in your project root and add:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Database Schema Setup

Run this SQL in your Supabase SQL editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create user_profiles table
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('solo', 'accountant')),
  monthly_expenses TEXT CHECK (monthly_expenses IN ('under-500', '500-2000', '2000-5000', 'over-5000')),
  current_tool TEXT,
  plan_type TEXT CHECK (plan_type IN ('monthly', 'annual')),
  client_count TEXT,
  phone_number TEXT,
  referral_source TEXT,
  marketing_emails BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create receipts table
CREATE TABLE public.receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vendor TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  date DATE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  receipt_url TEXT,
  bank_transaction_id UUID,
  matched BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bank_transactions table
CREATE TABLE public.bank_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  date DATE NOT NULL,
  description TEXT NOT NULL,
  receipt_id UUID REFERENCES receipts(id),
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table (for accountants)
CREATE TABLE public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  accountant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own receipts" ON receipts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own receipts" ON receipts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own receipts" ON receipts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own receipts" ON receipts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON bank_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON bank_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON bank_transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON bank_transactions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Accountants can view own clients" ON clients FOR SELECT USING (auth.uid() = accountant_id);
CREATE POLICY "Accountants can insert own clients" ON clients FOR INSERT WITH CHECK (auth.uid() = accountant_id);
CREATE POLICY "Accountants can update own clients" ON clients FOR UPDATE USING (auth.uid() = accountant_id);
CREATE POLICY "Accountants can delete own clients" ON clients FOR DELETE USING (auth.uid() = accountant_id);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_receipts_user_id ON receipts(user_id);
CREATE INDEX idx_receipts_date ON receipts(date);
CREATE INDEX idx_bank_transactions_user_id ON bank_transactions(user_id);
CREATE INDEX idx_bank_transactions_date ON bank_transactions(date);
CREATE INDEX idx_clients_accountant_id ON clients(accountant_id);
```

## Step 4: Configure Authentication

1. In your Supabase dashboard, go to Authentication → Settings
2. Configure your site URL (e.g., `http://localhost:5000` for development)
3. Add any additional redirect URLs you'll need for production

## Step 5: Email Templates (Optional)

You can customize the email templates in Authentication → Email Templates for:
- Confirmation emails
- Password reset emails
- Magic link emails

## Features Enabled

With this setup, your FlowBooks Associate application will have:

- ✅ User registration and authentication
- ✅ User profile management
- ✅ Receipt tracking and categorization
- ✅ Bank transaction management
- ✅ Client management for accountants
- ✅ Row-level security for data protection
- ✅ Automatic user session management

## Fallback Mode

If Supabase is not configured, the application will fall back to the existing API endpoints for basic functionality. However, for full features including user authentication and data persistence, Supabase setup is recommended.

## Testing

After setup, test the integration by:
1. Registering a new user through the signup form
2. Checking that the user profile is created in Supabase
3. Verifying email confirmation works
4. Testing sign-in functionality

## Production Deployment

For production:
1. Update the site URL in Supabase settings
2. Set up custom domains if needed
3. Configure proper CORS settings
4. Review and adjust RLS policies as needed
5. Set up database backups
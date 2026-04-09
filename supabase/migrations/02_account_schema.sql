-- 1. Create Accounts table
CREATE TABLE public.accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'Ahorros',
  pocket_name TEXT NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0.00,
  currency TEXT DEFAULT 'COP',        
  color TEXT DEFAULT '#1A1A1B',      
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, bank_name, pocket_name)
);

-- 2. Security (RLS)
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own accounts" 
ON accounts FOR ALL 
USING (auth.uid() = user_id);
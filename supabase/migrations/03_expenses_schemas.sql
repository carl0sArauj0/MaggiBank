-- 1. Create Expenses table
CREATE TABLE public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  category_name TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. TRIGGER FUNCTION: Subtract balance when a Gasto is added
CREATE OR REPLACE FUNCTION public.handle_new_expense()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.accounts
  SET balance = balance - NEW.amount
  WHERE id = NEW.account_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_expense_created
  AFTER INSERT ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_expense();

-- 3. TRIGGER FUNCTION: Restore balance when a Gasto is deleted
CREATE OR REPLACE FUNCTION public.handle_delete_expense()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.accounts
  SET balance = balance + OLD.amount
  WHERE id = OLD.account_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_expense_deleted
  AFTER DELETE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.handle_delete_expense();

-- 4. Security (RLS)
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own expenses" 
ON public.expenses 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id); -- Añadir esta línea

ALTER TABLE public.expenses ALTER COLUMN user_id SET DEFAULT auth.uid();
-- 1. Create a Test Bank Account
-- INSERT INTO public.accounts (user_id, bank_name, pocket_name, balance)
-- VALUES ('YOUR_USER_ID_HERE', 'Bancolombia', 'Ahorros', 5000000);

-- 2. Create some sample expenses for Python Analysis
-- INSERT INTO public.expenses (user_id, account_id, amount, category_name, description, date)
-- VALUES 
-- ('YOUR_USER_ID_HERE', 'ACCOUNT_ID_HERE', 50000, 'Alimentación', 'Cena Pizza', now() - interval '1 day'),
-- ('YOUR_USER_ID_HERE', 'ACCOUNT_ID_HERE', 12000, 'Transporte', 'Uber al trabajo', now() - interval '2 days');
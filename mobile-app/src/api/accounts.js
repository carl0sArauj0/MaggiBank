import { supabase } from './supabaseClient';

export const getAccounts = async () => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getAccountById = async (id) => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const addAccount = async (account) => {
  const { data, error } = await supabase
    .from('accounts')
    .insert([{
      name: account.name,
      balance: account.balance,
      type: account.type,
      currency: account.currency,  // ← add back when partner adds column
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateAccount = async (id, updates) => {
  const { data, error } = await supabase
    .from('accounts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteAccount = async (id) => {
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
};

export const addBalanceToAccount = async (id, amount) => {
  const account = await getAccountById(id);
  const newBalance = account.balance + Math.abs(amount);
  const { data, error } = await supabase
    .from('accounts')
    .update({ balance: newBalance })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getTotalPatrimonio = async () => {
  const { data, error } = await supabase
    .from('accounts')
    .select('balance');
  if (error) throw error;
  const total = data.reduce((sum, account) => sum + account.balance, 0);
  return total;
};


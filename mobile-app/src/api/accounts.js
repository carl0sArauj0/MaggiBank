import { supabase } from './supabaseClient';

// Get all accounts for the current user
export const getAccounts = async () => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Get a single account by ID
export const getAccountById = async (id) => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Add a new account
export const addAccount = async (account) => {
  const { data, error } = await supabase
    .from('accounts')
    .insert([
      {
        name: account.name,
        pocket_name: account.pocket_name || account.type || account.name,
        balance: account.balance,
        type: account.type,
        currency: account.currency || 'COP',
        color: account.color || '#1A1A1B',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update an existing account
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

// Delete an account
export const deleteAccount = async (id) => {
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

// Get total patrimonio (sum of all account balances)
export const getTotalPatrimonio = async () => {
  const { data, error } = await supabase
    .from('accounts')
    .select('balance');

  if (error) throw error;

  const total = data.reduce((sum, account) => sum + account.balance, 0);
  return total;
};

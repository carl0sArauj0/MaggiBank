import { supabase } from './supabaseClient';

// Get all transactions for the current user (excludes income)
export const getTransactions = async () => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .neq('category_name', 'Ingreso')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((item) => ({
    ...item,
    title: item.description,
    category: item.category_name,
  }));
};

// Get ALL transactions for an account including income
export const getAllTransactionsByAccount = async (accountId) => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((item) => ({
    ...item,
    title: item.description,
    category: item.category_name,
  }));
};

// Get transactions by account
export const getTransactionsByAccount = async (accountId) => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('account_id', accountId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

// Add a new transaction
export const addTransaction = async (transaction) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([
      {
        description: transaction.title,        // was: title
        amount: transaction.amount,
        category_name: transaction.category,   // was: category
        account_id: transaction.accountId,
        date: transaction.date || new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update an existing transaction
export const updateTransaction = async (id, updates) => {
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete a transaction
export const deleteTransaction = async (id) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};


import { supabase } from './supabaseClient';

// Get all transactions for the current user
export const getTransactions = async () => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Get transactions by account
export const getTransactionsByAccount = async (accountId) => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Add a new transaction
export const addTransaction = async (transaction) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([
      {
        title: transaction.title,
        amount: transaction.amount,
        category: transaction.category,
        account_id: transaction.accountId,
        notes: transaction.notes || null,
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

// Subscribe to real-time transaction changes
export const subscribeToTransactions = (callback) => {
  const subscription = supabase
    .channel('expenses-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'expenses' },
      (payload) => callback(payload)
    )
    .subscribe();

  return subscription;
};

// Unsubscribe from real-time changes
export const unsubscribeFromTransactions = async (subscription) => {
  await supabase.removeChannel(subscription);
};

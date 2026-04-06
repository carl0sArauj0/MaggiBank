import { useState, useEffect, useCallback } from 'react';
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
  subscribeToTransactions,
  unsubscribeFromTransactions,
} from '../api/transactions';

const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const calculateTotal = (data) => {
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    setTotalExpenses(total);
  };

  const fetchExpenses = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getTransactions();
      setExpenses(data);
      calculateTotal(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();

    // Real-time subscription
    const subscription = subscribeToTransactions((payload) => {
      if (payload.eventType === 'INSERT') {
        setExpenses((prev) => {
          const updated = [payload.new, ...prev];
          calculateTotal(updated);
          return updated;
        });
      } else if (payload.eventType === 'DELETE') {
        setExpenses((prev) => {
          const updated = prev.filter((e) => e.id !== payload.old.id);
          calculateTotal(updated);
          return updated;
        });
      } else if (payload.eventType === 'UPDATE') {
        setExpenses((prev) => {
          const updated = prev.map((e) =>
            e.id === payload.new.id ? payload.new : e
          );
          calculateTotal(updated);
          return updated;
        });
      }
    });

    return () => {
      unsubscribeFromTransactions(subscription);
    };
  }, [fetchExpenses]);

  const addExpense = async (expense) => {
    try {
      setError(null);
      const newExpense = await addTransaction(expense);
      return newExpense;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeExpense = async (id) => {
    try {
      setError(null);
      await deleteTransaction(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const editExpense = async (id, updates) => {
    try {
      setError(null);
      const updated = await updateTransaction(id, updates);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    expenses,
    loading,
    error,
    totalExpenses,
    fetchExpenses,
    addExpense,
    removeExpense,
    editExpense,
  };
};

export default useExpenses;

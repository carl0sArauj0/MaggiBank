import { useState, useEffect, useCallback } from 'react';
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from '../api/transactions';

const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const calculateTotal = (data) => {
    const total = data
      .filter((item) =>
        item.category_name !== 'Ingreso' &&
        item.category !== 'Ingreso'
      )
      .reduce((sum, item) => sum + item.amount, 0);
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

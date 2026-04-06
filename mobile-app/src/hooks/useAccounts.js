import { useState, useEffect, useCallback } from 'react';
import {
  getAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  getTotalPatrimonio,
  subscribeToAccounts,
  unsubscribeFromAccounts,
} from '../api/accounts';

const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPatrimonio, setTotalPatrimonio] = useState(0);

  const fetchAccounts = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getAccounts();
      setAccounts(data);
      const total = await getTotalPatrimonio();
      setTotalPatrimonio(total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();

    // Real-time subscription
    const subscription = subscribeToAccounts((payload) => {
      if (payload.eventType === 'INSERT') {
        setAccounts((prev) => [payload.new, ...prev]);
        setTotalPatrimonio((prev) => prev + payload.new.balance);
      } else if (payload.eventType === 'DELETE') {
        setAccounts((prev) =>
          prev.filter((a) => a.id !== payload.old.id)
        );
        setTotalPatrimonio((prev) => prev - payload.old.balance);
      } else if (payload.eventType === 'UPDATE') {
        setAccounts((prev) =>
          prev.map((a) => (a.id === payload.new.id ? payload.new : a))
        );
        fetchAccounts();
      }
    });

    return () => {
      unsubscribeFromAccounts(subscription);
    };
  }, [fetchAccounts]);

  const createAccount = async (account) => {
    try {
      setError(null);
      const newAccount = await addAccount(account);
      return newAccount;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const editAccount = async (id, updates) => {
    try {
      setError(null);
      const updated = await updateAccount(id, updates);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeAccount = async (id) => {
    try {
      setError(null);
      await deleteAccount(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    accounts,
    loading,
    error,
    totalPatrimonio,
    fetchAccounts,
    createAccount,
    editAccount,
    removeAccount,
  };
};

export default useAccounts;

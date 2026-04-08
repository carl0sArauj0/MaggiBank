import { useState, useEffect, useCallback } from 'react';
import {
  getAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  getTotalPatrimonio,
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

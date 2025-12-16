import { useState, useCallback, useEffect } from 'react';
import loanService from '../services/loanService';

const useLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLoans = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loanService.getAll(filters);
      setLoans(data);
    } catch (err) {
      console.error('Error fetching loans:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addLoan = useCallback(
    async (loanData) => {
      try {
        await loanService.create(loanData);
        await fetchLoans();
        return { success: true };
      } catch (err) {
        console.error('Error adding loan:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchLoans]
  );

  const updateLoan = useCallback(
    async (id, loanData) => {
      try {
        await loanService.update(id, loanData);
        await fetchLoans();
        return { success: true };
      } catch (err) {
        console.error('Error updating loan:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchLoans]
  );

  const deleteLoan = useCallback(
    async (id) => {
      try {
        await loanService.delete(id);
        await fetchLoans();
        return { success: true, id };
      } catch (err) {
        console.error('Error deleting loan:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchLoans]
  );

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  return {
    loans,
    loading,
    error,
    fetchLoans,
    addLoan,
    updateLoan,
    deleteLoan,
  };
};

export default useLoans;

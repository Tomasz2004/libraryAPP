import { useState, useCallback, useEffect } from 'react';
import copyService from '../services/copyService';

const useCopies = () => {
  const [copies, setCopies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCopies = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await copyService.getAll(filters);
      setCopies(data);
    } catch (err) {
      console.error('Error fetching copies:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCopy = useCallback(
    async (copyData) => {
      try {
        await copyService.create(copyData);
        await fetchCopies();
        return { success: true };
      } catch (err) {
        console.error('Error adding copy:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchCopies]
  );

  const updateCopy = useCallback(
    async (id, copyData) => {
      try {
        await copyService.update(id, copyData);
        await fetchCopies();
        return { success: true };
      } catch (err) {
        console.error('Error updating copy:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchCopies]
  );

  const deleteCopy = useCallback(
    async (id, cascade = false) => {
      try {
        await copyService.delete(id, cascade);
        await fetchCopies();
        return { success: true, id };
      } catch (err) {
        if (err.status == 409) {
          const count = err.data?.count || 0;
          const shouldCascade = window.confirm(
            `Egzemplarz (ID: ${id}) ma ${count} powiązanych wypożyczeń.\n\n` +
              `Czy chcesz usunąć egzemplarz wraz z wszystkimi jego wypożyczeniami?`
          );

          if (shouldCascade) {
            // Ponów z cascade
            return await deleteCopy(id, true);
          } else {
            return {
              success: false,
              error: `Egzemplarz (ID: ${id}) nie został usunięty - ma ${count} wypożyczeń`,
            };
          }
        }
        console.error('Error deleting copy:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchCopies]
  );

  useEffect(() => {
    fetchCopies();
  }, [fetchCopies]);

  return {
    copies,
    loading,
    error,
    fetchCopies,
    addCopy,
    updateCopy,
    deleteCopy,
  };
};

export default useCopies;

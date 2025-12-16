import { useState, useCallback, useEffect } from 'react';
import readerService from '../services/readerService';

const useReaders = () => {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReaders = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await readerService.getAll(filters);
      setReaders(data);
    } catch (err) {
      console.error('Error fetching readers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addReader = useCallback(
    async (readerData) => {
      try {
        await readerService.create(readerData);
        await fetchReaders();
        return { success: true };
      } catch (err) {
        console.error('Error adding reader:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchReaders]
  );

  const updateReader = useCallback(
    async (id, readerData) => {
      try {
        await readerService.update(id, readerData);
        await fetchReaders();
        return { success: true };
      } catch (err) {
        console.error('Error updating reader:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchReaders]
  );

  const deleteReader = useCallback(
    async (id, cascade = false) => {
      try {
        await readerService.delete(id, cascade);
        await fetchReaders();
        return { success: true, id };
      } catch (err) {
        if (err.status == 409) {
          const count = err.data?.count || 0;
          const shouldCascade = window.confirm(
            `Czytelnik (ID: ${id}) ma ${count} powiązanych wypożyczeń.\n\n` +
              `Czy chcesz usunąć czytelnika wraz z wszystkimi jego wypożyczeniami?`
          );

          if (shouldCascade) {
            // Ponów z cascade
            return await deleteReader(id, true);
          } else {
            return {
              success: false,
              error: `Czytelnik (ID: ${id}) nie został usunięty - ma ${count} wypożyczeń`,
            };
          }
        }
        console.error('Error deleting reader:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchReaders]
  );

  useEffect(() => {
    fetchReaders();
  }, [fetchReaders]);

  return {
    readers,
    loading,
    error,
    fetchReaders,
    addReader,
    updateReader,
    deleteReader,
  };
};

export default useReaders;

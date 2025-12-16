import { useState, useCallback, useEffect } from 'react';
import workerService from '../services/workerService';

const useWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWorkers = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await workerService.getAll(filters);
      setWorkers(data);
    } catch (err) {
      console.error('Error fetching workers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addWorker = useCallback(
    async (workerData) => {
      try {
        await workerService.create(workerData);
        await fetchWorkers();
        return { success: true };
      } catch (err) {
        console.error('Error adding worker:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchWorkers]
  );

  const updateWorker = useCallback(
    async (id, workerData) => {
      try {
        await workerService.update(id, workerData);
        await fetchWorkers();
        return { success: true };
      } catch (err) {
        console.error('Error updating worker:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchWorkers]
  );

  const deleteWorker = useCallback(
    async (id) => {
      try {
        await workerService.delete(id);
        await fetchWorkers();
        return { success: true, id };
      } catch (err) {
        console.error('Error deleting worker:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchWorkers]
  );

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  return {
    workers,
    loading,
    error,
    fetchWorkers,
    addWorker,
    updateWorker,
    deleteWorker,
  };
};

export default useWorkers;

import { useState, useCallback } from 'react';
import libraryService from '../services/libraryService';

/**
 * Custom hook do zarządzania bibliotekami
 *
 * @returns {object} Stan i funkcje do zarządzania bibliotekami
 */
const useLibraries = () => {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Pobiera bibliotek z API
   */
  const fetchLibraries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await libraryService.getAll();
      setLibraries(data);
    } catch (err) {
      console.error('Error fetching libraries:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Dodaje nową bibliotekę
   */
  const addLibrary = useCallback(async (libraryData) => {
    try {
      const savedLibrary = await libraryService.create(libraryData);
      // Dodaj nową bibliotekę do lokalnej listy (bez ponownego fetchowania)
      setLibraries((prev) => [...prev, savedLibrary]);
      return { success: true, library: savedLibrary };
    } catch (err) {
      console.error('Error adding library:', err);
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Aktualizuje bibliotekę
   */
  const updateLibrary = useCallback(
    async (id, libraryData) => {
      try {
        await libraryService.update(id, libraryData);
        await fetchLibraries(); // Odśwież listę
        return { success: true };
      } catch (err) {
        console.error('Error updating library:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchLibraries]
  );

  /**
   * Usuwa bibliotekę
   */
  const deleteLibrary = useCallback(
    async (id) => {
      try {
        await libraryService.delete(id);
        await fetchLibraries(); // Odśwież listę
        return { success: true };
      } catch (err) {
        console.error('Error deleting library:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchLibraries]
  );

  return {
    libraries,
    loading,
    error,
    fetchLibraries,
    addLibrary,
    updateLibrary,
    deleteLibrary,
  };
};

export default useLibraries;

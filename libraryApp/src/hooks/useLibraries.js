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
    async (id, cascade = false) => {
      try {
        await libraryService.delete(id, cascade);
        await fetchLibraries(); // Odśwież listę
        return { success: true };
      } catch (err) {
        if (err.status === 409) {
          const data = err.data || {};
          const egzemplarze = data.egzemplarze || 0;
          const pracownicy = data.pracownicy || 0;
          const shouldCascade = window.confirm(
            `Biblioteka (ID: ${id}) ma powiązane rekordy:\n\n` +
              `- Egzemplarze: ${egzemplarze}\n` +
              `- Pracownicy: ${pracownicy}\n\n` +
              `Czy chcesz usunąć bibliotekę wraz ze wszystkimi powiązanymi rekordami?`
          );

          if (shouldCascade) {
            // Ponów z cascade
            return await deleteLibrary(id, true);
          } else {
            return {
              success: false,
              error: `Biblioteka (ID: ${id}) nie została usunięta - ma ${
                egzemplarze + pracownicy
              } powiązań`,
            };
          }
        }
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

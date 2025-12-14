import { useState, useCallback } from 'react';
import authorService from '../services/authorService';

/**
 * Custom hook do zarządzania autorami
 *
 * @returns {object} Stan i funkcje do zarządzania autorami
 */
const useAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Pobiera autorów z API
   */
  const fetchAuthors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authorService.getAll();
      setAuthors(data);
    } catch (err) {
      console.error('Error fetching authors:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Dodaje nowego autora
   */
  const addAuthor = useCallback(async (authorData) => {
    try {
      const savedAuthor = await authorService.create(authorData);
      // Dodaj nowego autora do lokalnej listy (bez ponownego fetchowania)
      setAuthors((prev) => [...prev, savedAuthor]);
      return { success: true, author: savedAuthor };
    } catch (err) {
      console.error('Error adding author:', err);
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Aktualizuje autora
   */
  const updateAuthor = useCallback(
    async (id, authorData) => {
      try {
        await authorService.update(id, authorData);
        await fetchAuthors(); // Odśwież listę
        return { success: true };
      } catch (err) {
        console.error('Error updating author:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchAuthors]
  );

  /**
   * Usuwa autora
   */
  const deleteAuthor = useCallback(
    async (id) => {
      try {
        await authorService.delete(id);
        await fetchAuthors(); // Odśwież listę
        return { success: true };
      } catch (err) {
        console.error('Error deleting author:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchAuthors]
  );

  return {
    authors,
    loading,
    error,
    fetchAuthors,
    addAuthor,
    updateAuthor,
    deleteAuthor,
  };
};

export default useAuthors;

import { useState, useEffect, useCallback } from 'react';
import bookService from '../services/bookService';

/**
 * Custom hook do zarządzania książkami
 * Enkapsuluje całą logikę biznesową związaną z książkami
 *
 * @returns {object} Stan i funkcje do zarządzania książkami
 */
const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Pobiera książki z API
   * useCallback zapobiega niepotrzebnym re-renderom
   */
  const fetchBooks = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookService.getAll(filters);
      setBooks(data);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Dodaje nową książkę
   */
  const addBook = useCallback(
    async (bookData) => {
      try {
        await bookService.create(bookData);
        await fetchBooks(); // Odśwież listę
        return { success: true };
      } catch (err) {
        console.error('Error adding book:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchBooks]
  );

  /**
   * Aktualizuje książkę
   */
  const updateBook = useCallback(
    async (id, bookData) => {
      try {
        await bookService.update(id, bookData);
        await fetchBooks(); // Odśwież listę
        return { success: true };
      } catch (err) {
        console.error('Error updating book:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchBooks]
  );

  /**
   * Usuwa pojedynczą książkę
   * Obsługuje cascade delete i potwierdzenie użytkownika
   */
  const deleteBook = useCallback(async (id, cascade = false) => {
    try {
      await bookService.delete(id, cascade);
      return { success: true, id };
    } catch (err) {
      // Sprawdź czy to konflikt (409)
      if (err.status === 409) {
        const count = err.data?.count || 0;
        const shouldCascade = window.confirm(
          `Książka (ID: ${id}) ma ${count} powiązanych egzemplarzy.\n\n` +
            `Czy chcesz usunąć książkę wraz z wszystkimi jej egzemplarzami?`
        );

        if (shouldCascade) {
          // Ponów z cascade
          return await deleteBook(id, true);
        } else {
          return {
            success: false,
            error: `Książka (ID: ${id}) nie została usunięta - ma ${count} egzemplarzy`,
          };
        }
      }

      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Usuwa wiele książek jednocześnie
   */
  const deleteBooks = useCallback(
    async (ids) => {
      const results = await Promise.allSettled(
        ids.map((id) => deleteBook(id, false))
      );

      const succeeded = results.filter(
        (r) => r.status === 'fulfilled' && r.value.success
      );
      const failed = results.filter(
        (r) => r.status === 'rejected' || !r.value.success
      );

      // Odśwież listę
      await fetchBooks();

      return {
        succeeded: succeeded.length,
        failed: failed.length,
        errors: failed.map((r) =>
          r.status === 'rejected' ? r.reason.message : r.value.error
        ),
      };
    },
    [deleteBook, fetchBooks]
  );

  // Początkowe załadowanie książek
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    books,
    loading,
    error,
    fetchBooks,
    addBook,
    updateBook,
    deleteBook,
    deleteBooks,
  };
};

export default useBooks;

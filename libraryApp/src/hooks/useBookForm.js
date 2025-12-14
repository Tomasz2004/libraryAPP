import { createContext, useContext } from 'react';

/**
 * Context dla formularza książki
 */
export const BookFormContext = createContext(null);

/**
 * Hook do używania contextu formularza książki
 * Musi być użyty wewnątrz BookFormProvider
 */
export const useBookForm = () => {
  const context = useContext(BookFormContext);
  if (!context) {
    throw new Error('useBookForm must be used within BookFormProvider');
  }
  return context;
};

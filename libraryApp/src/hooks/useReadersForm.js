import { createContext, useContext } from 'react';

/**
 * Context dla formularza książki
 */
export const ReadersFormContext = createContext(null);

/**
 * Hook do używania contextu formularza egzemplarzy
 * Musi być użyty wewnątrz CopiesFormProvider
 */
export const useReadersForm = () => {
  const context = useContext(ReadersFormContext);
  if (!context) {
    throw new Error('useReadersForm must be used within ReadersFormProvider');
  }
  return context;
};

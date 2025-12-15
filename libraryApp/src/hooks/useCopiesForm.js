import { createContext, useContext } from 'react';

/**
 * Context dla formularza książki
 */
export const CopiesFormContext = createContext(null);

/**
 * Hook do używania contextu formularza egzemplarzy
 * Musi być użyty wewnątrz CopiesFormProvider
 */
export const useCopiesForm = () => {
  const context = useContext(CopiesFormContext);
  if (!context) {
    throw new Error('useCopiesForm must be used within CopiesFormProvider');
  }
  return context;
};

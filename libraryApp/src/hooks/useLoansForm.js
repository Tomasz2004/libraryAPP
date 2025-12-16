import { createContext, useContext } from 'react';

/**
 * Context dla formularza wypożyczeń
 */
export const LoansFormContext = createContext(null);

/**
 * Hook do używania contextu formularza wypożyczeń
 * Musi być użyty wewnątrz LoansFormProvider
 */
export const useLoansForm = () => {
  const context = useContext(LoansFormContext);
  if (!context) {
    throw new Error('useLoansForm must be used within LoansFormProvider');
  }
  return context;
};

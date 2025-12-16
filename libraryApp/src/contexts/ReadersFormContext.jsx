import { useState } from 'react';
import { ReadersFormContext } from '../hooks/useReadersForm';

/**
 * Provider dla formularza czytelników
 * Enkapsuluje cały stan związany z formularzem
 */
export function ReadersFormProvider({ children }) {
  // Stan formularza czytelników
  const [readerData, setReaderData] = useState({
    imie: '',
    nazwisko: '',
    email: '',
    telefon: '',
    dataRejestracji: '',
  });

  /**
   * Resetuje formularz czytelnika do wartości początkowych
   */
  const resetReaderForm = () => {
    setReaderData({
      imie: '',
      nazwisko: '',
      email: '',
      telefon: '',
      dataRejestracji: '',
    });
  };

  /**
   * Aktualizuje pojedyncze pole w formularzu czytelnika
   */
  const updateReaderField = (field, value) => {
    setReaderData((prev) => ({ ...prev, [field]: value }));
  };

  const value = {
    // Stan
    readerData,
    // Settery
    setReaderData,
    // Pomocnicze funkcje
    resetReaderForm,
    updateReaderField,
  };

  return (
    <ReadersFormContext.Provider value={value}>
      {children}
    </ReadersFormContext.Provider>
  );
}

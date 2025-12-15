import { useState } from 'react';
import { CopiesFormContext } from '../hooks/useCopiesForm';

/**
 * Provider dla formularza egzemplarzy
 * Enkapsuluje cały stan związany z formularzem
 */
export function CopiesFormProvider({ children }) {
  // Stan formularza egzemplarzy
  const [copyData, setCopyData] = useState({
    ksiazkaId: '',
    bibliotekaId: '',
    sygnatura: '',
    barcode: '',
    status: 'dostepny',
  });

  // Stan formularza biblioteki
  const [libraryData, setLibraryData] = useState({
    nazwa: '',
    adres: '',
  });

  // Kontrola widoczności formularza biblioteki
  const [showLibraryForm, setShowLibraryForm] = useState(false);

  /**
   * Resetuje formularz egzemplarza do wartości początkowych
   */
  const resetCopyForm = () => {
    setCopyData({
      ksiazkaId: '',
      bibliotekaId: '',
      sygnatura: '',
      barcode: '',
      status: 'dostepny',
    });
  };

  /**
   * Resetuje formularz biblioteki do wartości początkowych
   */
  const resetLibraryForm = () => {
    setLibraryData({
      nazwa: '',
      adres: '',
    });
  };

  /**
   * Aktualizuje pojedyncze pole w formularzu egzemplarza
   */
  const updateCopyField = (field, value) => {
    setCopyData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Aktualizuje pojedyncze pole w formularzu biblioteki
   */
  const updateLibraryField = (field, value) => {
    setLibraryData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Przełącza widoczność formularza biblioteki
   */
  const toggleLibraryForm = (show) => {
    setShowLibraryForm(show);

  };

  /**
   * Ustawia wybraną bibliotekę w formularzu egzemplarza
   */
  const selectLibrary = (bibliotekaId) => {
    setCopyData((prev) => ({ ...prev, biblioteka: bibliotekaId }));
  };

  const value = {
    // Stan
    copyData,
    libraryData,
    showLibraryForm,

    // Settery
    setCopyData,
    setLibraryData,
    setShowLibraryForm,

    // Pomocnicze funkcje
    resetCopyForm,
    resetLibraryForm,
    updateCopyField,
    updateLibraryField,
    toggleLibraryForm,
    selectLibrary,
  };

  return (
    <CopiesFormContext.Provider value={value}>
      {children}
    </CopiesFormContext.Provider>
  );
}

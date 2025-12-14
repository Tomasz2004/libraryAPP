import { useState } from 'react';
import { BookFormContext } from '../hooks/useBookForm';

/**
 * Provider dla formularza książki
 * Enkapsuluje cały stan związany z formularzem
 */
export function BookFormProvider({ children }) {
  // Stan formularza książki
  const [bookData, setBookData] = useState({
    tytul: '',
    autorId: '',
    gatunek: '',
    rokWydania: '',
    isbn: '',
    opis: '',
  });

  // Stan formularza autora
  const [authorData, setAuthorData] = useState({
    imie: '',
    nazwisko: '',
    dataUrodzenia: '',
    kraj: '',
  });

  // Kontrola widoczności formularza autora
  const [showAuthorForm, setShowAuthorForm] = useState(false);

  /**
   * Resetuje formularz książki do wartości początkowych
   */
  const resetBookForm = () => {
    setBookData({
      tytul: '',
      autorId: '',
      gatunek: '',
      rokWydania: '',
      isbn: '',
      opis: '',
    });
  };

  /**
   * Resetuje formularz autora do wartości początkowych
   */
  const resetAuthorForm = () => {
    setAuthorData({
      imie: '',
      nazwisko: '',
      dataUrodzenia: '',
      kraj: '',
    });
  };

  /**
   * Aktualizuje pojedyncze pole w formularzu książki
   */
  const updateBookField = (field, value) => {
    setBookData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Aktualizuje pojedyncze pole w formularzu autora
   */
  const updateAuthorField = (field, value) => {
    setAuthorData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Przełącza widoczność formularza autora
   */
  const toggleAuthorForm = (show) => {
    setShowAuthorForm(show);
    if (!show) {
      // Jeśli zamykamy formularz autora, wyczyść wybór autora
      setBookData((prev) => ({ ...prev, autorId: '' }));
    }
  };

  /**
   * Ustawia wybranego autora w formularzu książki
   */
  const selectAuthor = (autorId) => {
    setBookData((prev) => ({ ...prev, autorId }));
  };

  const value = {
    // Stan
    bookData,
    authorData,
    showAuthorForm,

    // Settery
    setBookData,
    setAuthorData,
    setShowAuthorForm,

    // Pomocnicze funkcje
    resetBookForm,
    resetAuthorForm,
    updateBookField,
    updateAuthorField,
    toggleAuthorForm,
    selectAuthor,
  };

  return (
    <BookFormContext.Provider value={value}>
      {children}
    </BookFormContext.Provider>
  );
}

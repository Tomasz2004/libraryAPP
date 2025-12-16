import { useState } from 'react';
import { LoansFormContext } from '../hooks/useLoansForm';

/**
 * Provider dla formularza wypożyczeń
 * Enkapsuluje cały stan związany z formularzem
 */
export function LoansFormProvider({ children }) {
  // Stan formularza wypożyczeń
  const [loanData, setLoanData] = useState({
    egzemplarzId: '',
    czytelnikId: '',
    pracownikId: '',
    dataWypozyczenia: '',
    terminZwrotu: '',
    dataZwrotu: '',
    uwagi: '',
  });

  // Stan formularza pracownika
  const [workerData, setWorkerData] = useState({
    imie: '',
    nazwisko: '',
    stanowisko: '',
    bibliotekaId: '',
    zatrudnionyOd: '',
  });

  // Kontrola widoczności formularza pracownika
  const [showWorkerForm, setShowWorkerForm] = useState(false);

  /**
   * Resetuje formularz wypożyczenia do wartości początkowych
   */
  const resetLoanForm = () => {
    setLoanData({
      egzemplarzId: '',
      czytelnikId: '',
      pracownikId: '',
      dataWypozyczenia: '',
      terminZwrotu: '',
      dataZwrotu: '',
      uwagi: '',
    });
  };

  /**
   * Resetuje formularz pracownika do wartości początkowych
   */
  const resetWorkerForm = () => {
    setWorkerData({
      imie: '',
      nazwisko: '',
      stanowisko: '',
      bibliotekaId: '',
      zatrudnionyOd: '',
    });
  };

  /**
   * Aktualizuje pojedyncze pole w formularzu wypożyczenia
   */
  const updateLoanField = (field, value) => {
    setLoanData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Aktualizuje pojedyncze pole w formularzu pracownika
   */
  const updateWorkerField = (field, value) => {
    setWorkerData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Przełącza widoczność formularza pracownika
   */
  const toggleWorkerForm = (show) => {
    setShowWorkerForm(show);
  };

  /**
   * Ustawia wybranego pracownika w formularzu wypożyczenia
   */
  const selectWorker = (pracownikId) => {
    setLoanData((prev) => ({ ...prev, pracownikId }));
  };

  const value = {
    // Stan
    loanData,
    workerData,
    showWorkerForm,

    // Settery
    setLoanData,
    setWorkerData,
    setShowWorkerForm,

    // Pomocnicze funkcje
    resetLoanForm,
    resetWorkerForm,
    updateLoanField,
    updateWorkerField,
    toggleWorkerForm,
    selectWorker,
  };

  return (
    <LoansFormContext.Provider value={value}>
      {children}
    </LoansFormContext.Provider>
  );
}

import { useLoansForm } from '../../../hooks/useLoansForm';
import { useEffect } from 'react';
import '../../Books/BookModal/BookModal.css';

function LoansModal({
  isOpen,
  onClose,
  onSubmit,
  workers,
  copies,
  readers,
  editingLoan,
}) {
  // Pobierz stan i funkcje z contextu
  const { loanData, setLoanData } = useLoansForm();

  // Wypełnij formularz danymi edytowanego wypożyczenia
  useEffect(() => {
    if (isOpen && editingLoan) {
      setLoanData({
        egzemplarzId: editingLoan.egzemplarz?.egzemplarzId || '',
        czytelnikId: editingLoan.czytelnik?.czytelnikId || '',
        pracownikId: editingLoan.pracownik?.pracownikId || '',
        dataWypozyczenia: editingLoan.dataWypozyczenia || '',
        terminZwrotu: editingLoan.terminZwrotu || '',
        dataZwrotu: editingLoan.dataZwrotu || '',
        uwagi: editingLoan.uwagi || '',
      });
    }
  }, [isOpen, editingLoan, setLoanData]);

  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <h2>
          {editingLoan ? 'Edytuj wypożyczenie' : 'Dodaj nowe wypożyczenie'}
        </h2>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label>Egzemplarz *</label>
            <select
              required
              value={loanData.egzemplarzId}
              onChange={(e) => {
                setLoanData({ ...loanData, egzemplarzId: e.target.value });
              }}
            >
              <option value=''>Wybierz egzemplarz...</option>
              {copies.map((copy) => (
                <option key={copy.egzemplarzId} value={copy.egzemplarzId}>
                  {copy.ksiazka.tytul}
                </option>
              ))}
            </select>
          </div>

          <div className='form-group'>
            <label>Czytelnik *</label>
            <select
              required
              value={loanData.czytelnikId}
              onChange={(e) => {
                setLoanData({ ...loanData, czytelnikId: e.target.value });
              }}
            >
              <option value=''>Wybierz czytelnika...</option>
              {readers.map((reader) => (
                <option key={reader.czytelnikId} value={reader.czytelnikId}>
                  {reader.imie} {reader.nazwisko}
                </option>
              ))}
            </select>
          </div>

          <div className='form-group'>
            <label>Pracownik *</label>
            <select
              required
              value={loanData.pracownikId}
              onChange={(e) => {
                setLoanData({ ...loanData, pracownikId: e.target.value });
              }}
            >
              <option value=''>Wybierz pracownika...</option>
              {workers.map((worker) => (
                <option key={worker.pracownikId} value={worker.pracownikId}>
                  {worker.imie} {worker.nazwisko}
                </option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label>Data Wypożyczenia</label>
            <input
              value={loanData.dataWypozyczenia}
              type='date'
              onChange={(e) =>
                setLoanData({
                  ...loanData,
                  dataWypozyczenia: e.target.value,
                })
              }
            ></input>
          </div>
          <div className='form-group'>
            <label>Termin zwrotu</label>
            <input
              value={loanData.terminZwrotu}
              type='date'
              onChange={(e) =>
                setLoanData({
                  ...loanData,
                  terminZwrotu: e.target.value,
                })
              }
            ></input>
          </div>
          <div className='form-group'>
            <label>Data Zwrotu</label>
            <input
              value={loanData.dataZwrotu}
              type='date'
              onChange={(e) =>
                setLoanData({
                  ...loanData,
                  dataZwrotu: e.target.value,
                })
              }
            ></input>
          </div>
          <div className='form-group'>
            <label>Uwagi</label>
            <input
              value={loanData.uwagi}
              onChange={(e) => {
                setLoanData({ ...loanData, uwagi: e.target.value });
              }}
            ></input>
          </div>

          <div className='modal-actions'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={onClose}
            >
              Anuluj
            </button>
            <button type='submit' className='btn btn-primary'>
              {editingLoan ? 'Zapisz zmiany' : 'Dodaj'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoansModal;

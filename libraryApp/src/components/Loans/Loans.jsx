import { useState } from 'react';
import useLoans from '../../hooks/useLoans';
import { useSelection } from '../../hooks/useSelection';
import '../Books/Books.css';
import useWorkers from '../../hooks/useWorkers';
import { useLoansForm } from '../../hooks/useLoansForm';
import { LoansFormProvider } from '../../contexts/LoansFormContext';
import useCopies from '../../hooks/useCopies';
import useReaders from '../../hooks/useReaders';
import LoansModal from './LoansModal/LoansModal';

function LoansContent() {
  // Custom hooks - cała logika biznesowa
  const { loans, loading, error, addLoan, deleteLoan } = useLoans();
  const { workers, fetchWorkers } = useWorkers();
  const { copies } = useCopies();
  const { readers } = useReaders();

  // Context - stan formularza
  const { loanData, resetLoanForm } = useLoansForm();

  // Hook do zaznaczania elementów
  const {
    selectedIds: selectedLoans,
    toggleItem: handleSelectLoan,
    toggleAll: handleSelectAll,
    isSelected,
    isAllSelected,
    clearSelection,
    count: selectedCount,
  } = useSelection('pracownikId');

  // Stan lokalny - tylko dla UI
  const [showAddModal, setShowAddModal] = useState(false);

  // Usuwanie wybranych wypożyczeń
  const handleDeleteSelected = async () => {
    if (selectedCount === 0) return;

    if (!confirm(`Czy na pewno chcesz usunąć ${selectedCount} wypożyczeń?`))
      return;

    const result = await deleteLoan(selectedLoans);

    if (result.failed > 0) {
      alert(
        `Usunięto: ${result.succeeded}\n` +
          `Błędy (${result.failed}):\n${result.errors.join('\n')}`
      );
    }

    clearSelection();
  };

  // Dodawanie wypożyczenia
  const handleAddLoan = async (e) => {
    e.preventDefault();

    const loanDataToSend = {
      ...loanData,
      egzemplarzId: parseInt(loanData.egzemplarzId),
      czytelnikId: parseInt(loanData.czytelnikId),
      pracownikId: parseInt(loanData.pracownikId),
      dataWypozyczenia: parseInt(loanData.dataWypozyczenia),
      terminZwrotu: parseInt(loanData.terminZwrotu),
      dataZwrotu: parseInt(loanData.dataZwrotu),
    };

    const result = await addLoan(loanDataToSend);

    if (result.success) {
      setShowAddModal(false);
      resetLoanForm();
    } else {
      alert(`Błąd podczas dodawania wypożyczenia: ${result.error}`);
    }
  };

  // Otwieranie modalu dodawania wypożyczenia
  const handleOpenAddModal = () => {
    setShowAddModal(true);
    resetLoanForm();
    fetchWorkers();
  };

  if (loading) return <div className='loading'>Ładowanie książek...</div>;
  if (error) return <div className='error'>Błąd: {error}</div>;

  return (
    <div className='container'>
      <div className='header'>
        <h1>Wypożyczenia</h1>
        <div className='header-actions'>
          <button className='btn btn-primary' onClick={handleOpenAddModal}>
            + Dodaj wypożyczenie
          </button>
          {selectedCount > 0 && (
            <button className='btn btn-danger' onClick={handleDeleteSelected}>
              Usuń wybrane ({selectedCount})
            </button>
          )}
        </div>
      </div>

      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type='checkbox'
                  checked={isAllSelected(loans)}
                  onChange={() => handleSelectAll(loans)}
                />
              </th>
              <th>Tytuł egzemplarza</th>
              <th>Czytelnik</th>
              <th>Pracownik</th>
              <th>Data Wypożyczenia</th>
              <th>Termin Zwrotu</th>
              <th>Data Zwrotu</th>
              <th>Uwagi</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr
                key={loan.wypozyczenieId}
                className={isSelected(loan.wypozyczenieId) ? 'selected' : ''}
              >
                <td>
                  <input
                    type='checkbox'
                    checked={isSelected(loan.wypozyczenieId)}
                    onChange={() => handleSelectLoan(loan.wypozyczenieId)}
                  />
                </td>
                <td>
                  {loan.egzemplarz
                    ? loan.egzemplarz.ksiazka.tytul
                    : 'Brak danych'}
                </td>
                <td>
                  {loan.czytelnik
                    ? `${loan.czytelnik.imie} ${loan.czytelnik.nazwisko}`
                    : 'Brak danych'}
                </td>
                <td>
                  {loan.pracownik
                    ? `${loan.pracownik.imie} ${loan.pracownik.nazwisko}`
                    : 'Brak danych'}
                </td>
                <td>{loan.dataWypozyczenia}</td>
                <td>{loan.terminZwrotu}</td>
                <td>{loan.dataZwrotu}</td>
                <td>{loan.uwagi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LoansModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddLoan}
        workers={workers}
        copies={copies}
        readers={readers}
      />
    </div>
  );
}

function Loans() {
  return (
    <LoansFormProvider>
      <LoansContent />
    </LoansFormProvider>
  );
}

export default Loans;

import { useState } from 'react';
import useLoans from '../../hooks/useLoans';
import { useSelection } from '../../hooks/useSelection';
import useSorting from '../../hooks/useSorting';
import usePagination from '../../hooks/usePagination';
import '../Books/Books.css';
import useWorkers from '../../hooks/useWorkers';
import { useLoansForm } from '../../hooks/useLoansForm';
import { LoansFormProvider } from '../../contexts/LoansFormContext';
import useCopies from '../../hooks/useCopies';
import useReaders from '../../hooks/useReaders';
import LoansModal from './LoansModal/LoansModal';

function LoansContent() {
  // Custom hooks - cała logika biznesowa
  const { loans, loading, error, addLoan, deleteLoan, fetchLoans } = useLoans();
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
  } = useSelection('wypozyczenieId');

  // Stan lokalny - tylko dla UI
  const [showAddModal, setShowAddModal] = useState(false);

  // Stan filtrów
  const [filters, setFilters] = useState({
    dataOd: '',
    dataDo: '',
    czytelnikId: '',
    status: '',
  });

  // Konfiguracja sortowania
  const sortConfig = {
    tytul: (a, b) => {
      const av = a.egzemplarz?.ksiazka?.tytul || '';
      const bv = b.egzemplarz?.ksiazka?.tytul || '';
      return av.toLowerCase().localeCompare(bv.toLowerCase());
    },
    czytelnik: (a, b) => {
      const av = a.czytelnik
        ? `${a.czytelnik.nazwisko} ${a.czytelnik.imie}`.toLowerCase()
        : '';
      const bv = b.czytelnik
        ? `${b.czytelnik.nazwisko} ${b.czytelnik.imie}`.toLowerCase()
        : '';
      return av.localeCompare(bv);
    },
    pracownik: (a, b) => {
      const av = a.pracownik
        ? `${a.pracownik.nazwisko} ${a.pracownik.imie}`.toLowerCase()
        : '';
      const bv = b.pracownik
        ? `${b.pracownik.nazwisko} ${b.pracownik.imie}`.toLowerCase()
        : '';
      return av.localeCompare(bv);
    },
    dataWypozyczenia: (a, b) =>
      new Date(a.dataWypozyczenia) - new Date(b.dataWypozyczenia),
    terminZwrotu: (a, b) => new Date(a.terminZwrotu) - new Date(b.terminZwrotu),
    dataZwrotu: (a, b) => {
      const ad = a.dataZwrotu ? new Date(a.dataZwrotu) : new Date('9999-12-31');
      const bd = b.dataZwrotu ? new Date(b.dataZwrotu) : new Date('9999-12-31');
      return ad - bd;
    },
  };

  const {
    sortedData: sortedLoans,
    handleSort,
    getSortIcon,
  } = useSorting(loans, sortConfig);

  const {
    paginatedData: displayedLoans,
    currentPage,
    totalPages,
    itemsPerPage,
    nextPage,
    prevPage,
    changeItemsPerPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination(sortedLoans, 10);

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

  // Filtrowanie wypożyczeń
  const handleFilter = (e) => {
    e.preventDefault();
    const activeFilters = {};

    if (filters.dataOd) activeFilters.dataOd = filters.dataOd;
    if (filters.dataDo) activeFilters.dataDo = filters.dataDo;
    if (filters.czytelnikId)
      activeFilters.czytelnikId = parseInt(filters.czytelnikId);
    if (filters.status) activeFilters.status = filters.status;

    fetchLoans(activeFilters);
  };

  // Resetowanie filtrów
  const handleClearFilters = () => {
    setFilters({
      dataOd: '',
      dataDo: '',
      czytelnikId: '',
      status: '',
    });
    fetchLoans();
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

      {/* Formularz filtrowania */}
      <div className='filter-section'>
        <form onSubmit={handleFilter} className='filter-form'>
          <div className='filter-row'>
            <div className='form-group'>
              <label>Data od</label>
              <input
                type='date'
                value={filters.dataOd}
                onChange={(e) =>
                  setFilters({ ...filters, dataOd: e.target.value })
                }
              />
            </div>
            <div className='form-group'>
              <label>Data do</label>
              <input
                type='date'
                value={filters.dataDo}
                onChange={(e) =>
                  setFilters({ ...filters, dataDo: e.target.value })
                }
              />
            </div>
            <div className='form-group'>
              <label>Czytelnik</label>
              <select
                value={filters.czytelnikId}
                onChange={(e) =>
                  setFilters({ ...filters, czytelnikId: e.target.value })
                }
              >
                <option value=''>Wszyscy czytelnicy</option>
                {readers.map((reader) => (
                  <option key={reader.czytelnikId} value={reader.czytelnikId}>
                    {reader.imie} {reader.nazwisko}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value=''>Wszystkie</option>
                <option value='aktywne'>Aktywne</option>
                <option value='zwrocone'>Zwrócone</option>
              </select>
            </div>
          </div>
          <div className='filter-actions'>
            <button type='submit' className='btn btn-primary'>
              🔍︎ Filtruj
            </button>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={handleClearFilters}
            >
              ✕ Wyczyść
            </button>
          </div>
        </form>
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
              <th className='sortable' onClick={() => handleSort('tytul')}>
                Tytuł egzemplarza{' '}
                <span className='sort-arrow'>{getSortIcon('tytul')}</span>
              </th>
              <th className='sortable' onClick={() => handleSort('czytelnik')}>
                Czytelnik{' '}
                <span className='sort-arrow'>{getSortIcon('czytelnik')}</span>
              </th>
              <th className='sortable' onClick={() => handleSort('pracownik')}>
                Pracownik{' '}
                <span className='sort-arrow'>{getSortIcon('pracownik')}</span>
              </th>
              <th
                className='sortable'
                onClick={() => handleSort('dataWypozyczenia')}
              >
                Data Wypożyczenia{' '}
                <span className='sort-arrow'>
                  {getSortIcon('dataWypozyczenia')}
                </span>
              </th>
              <th
                className='sortable'
                onClick={() => handleSort('terminZwrotu')}
              >
                Termin Zwrotu{' '}
                <span className='sort-arrow'>
                  {getSortIcon('terminZwrotu')}
                </span>
              </th>
              <th className='sortable' onClick={() => handleSort('dataZwrotu')}>
                Data Zwrotu{' '}
                <span className='sort-arrow'>{getSortIcon('dataZwrotu')}</span>
              </th>
              <th>Uwagi</th>
            </tr>
          </thead>
          <tbody>
            {displayedLoans.map((loan) => (
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

      {/* Paginacja */}
      <div className='pagination'>
        <div className='pagination-info'>
          Wyświetlanie {startIndex}-{endIndex} z {totalItems} wypożyczeń
        </div>
        <div className='pagination-controls'>
          <button onClick={prevPage} disabled={currentPage === 1}>
            ← Poprzednia
          </button>
          <span className='page-number'>
            Strona {currentPage} z {totalPages}
          </span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            Następna →
          </button>
        </div>
        <div className='pagination-per-page'>
          <label>Pokaż:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => changeItemsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
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

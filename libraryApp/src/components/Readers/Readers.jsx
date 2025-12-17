import '../Books/Books.css';
import { useSelection } from '../../hooks/useSelection';
import useSorting from '../../hooks/useSorting';
import usePagination from '../../hooks/usePagination';
import { useState } from 'react';
import useReaders from '../../hooks/useReaders';
import { useReadersForm } from '../../hooks/useReadersForm';
import ReadersModal from './ReadersModal/ReadersModal';
import { ReadersFormProvider } from '../../contexts/ReadersFormContext';

function ReadersContent() {
  const { readers, loading, error, addReader, deleteReader, fetchReaders } =
    useReaders();

  const {
    selectedIds: selectedReaders,
    toggleItem: handleSelectReader,
    toggleAll: handleSelectAll,
    isSelected,
    isAllSelected,
    clearSelection,
    count: selectedCount,
  } = useSelection('czytelnikId');

  const { readerData, resetReaderForm } = useReadersForm();

  // // Stan lokalny - tylko dla UI
  const [showAddModal, setShowAddModal] = useState(false);

  // Stan filtrów
  const [filters, setFilters] = useState({
    loanStatus: '',
  });

  // Konfiguracja sortowania
  const sortConfig = {
    imie: (a, b) => a.imie.toLowerCase().localeCompare(b.imie.toLowerCase()),
    nazwisko: (a, b) =>
      a.nazwisko.toLowerCase().localeCompare(b.nazwisko.toLowerCase()),
    email: (a, b) =>
      (a.email || '')
        .toLowerCase()
        .localeCompare((b.email || '').toLowerCase()),
    telefon: (a, b) => (a.telefon || '').localeCompare(b.telefon || ''),
    dataRejestracji: (a, b) =>
      new Date(a.dataRejestracji) - new Date(b.dataRejestracji),
  };

  const {
    sortedData: sortedReaders,
    handleSort,
    getSortIcon,
  } = useSorting(readers, sortConfig);

  const {
    paginatedData: displayedReaders,
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage,
    nextPage,
    prevPage,
    changeItemsPerPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination(sortedReaders, 10);

  // Usuwanie wybranych egzemplarzy
  const handleDeleteSelected = async () => {
    if (selectedCount === 0) return;

    if (!confirm(`Czy na pewno chcesz usunąć ${selectedCount} czytelników?`))
      return;

    const result = await deleteReader(selectedReaders);

    if (result.failed > 0) {
      alert(
        `Usunięto: ${result.succeeded}\n` +
          `Błędy (${result.failed}):\n${result.errors.join('\n')}`
      );
    }

    clearSelection();
  };

  // Dodawanie czytelnika
  const handleAddReader = async (e) => {
    e.preventDefault();

    const readerDataToSend = {
      ...readerData,
    };

    const result = await addReader(readerDataToSend);
    if (result.success) {
      setShowAddModal(false);
    } else {
      alert(`Błąd podczas dodawania czytelnika: ${result.error}`);
    }
  };

  // Otwieranie modalu dodawania czytelnika
  const handleOpenAddModal = () => {
    setShowAddModal(true);
    resetReaderForm();
    fetchReaders();
  };

  // Filtrowanie czytelników
  const handleFilter = (e) => {
    e.preventDefault();
    const activeFilters = {};

    if (filters.loanStatus) activeFilters.loanStatus = filters.loanStatus;

    fetchReaders(activeFilters);
  };

  // Resetowanie filtrów
  const handleClearFilters = () => {
    setFilters({
      loanStatus: '',
    });
    fetchReaders();
  };

  if (loading) return <div className='loading'>Ładowanie czytelników...</div>;
  if (error) return <div className='error'>Błąd: {error}</div>;

  return (
    <div className='container'>
      <div className='header'>
        <h1>Lista czytelników</h1>
        <div className='header-actions'>
          <button className='btn btn-primary' onClick={handleOpenAddModal}>
            + Dodaj czytelnika
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
              <label>Status wypożyczeń</label>
              <select
                value={filters.loanStatus}
                onChange={(e) =>
                  setFilters({ ...filters, loanStatus: e.target.value })
                }
              >
                <option value=''>Wszyscy czytelnicy</option>
                <option value='active'>Z aktywnymi wypożyczeniami</option>
                <option value='none'>Bez aktywnych wypożyczeń</option>
              </select>
            </div>
          </div>
          <div className='filter-actions'>
            <button type='submit' className='btn btn-primary'>
              🔍 Filtruj
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
                  checked={isAllSelected(readers)}
                  onChange={() => handleSelectAll(readers)}
                />
              </th>
              <th className='sortable' onClick={() => handleSort('imie')}>
                Imię <span className='sort-arrow'>{getSortIcon('imie')}</span>
              </th>
              <th className='sortable' onClick={() => handleSort('nazwisko')}>
                Nazwisko{' '}
                <span className='sort-arrow'>{getSortIcon('nazwisko')}</span>
              </th>
              <th className='sortable' onClick={() => handleSort('email')}>
                Email <span className='sort-arrow'>{getSortIcon('email')}</span>
              </th>
              <th className='sortable' onClick={() => handleSort('telefon')}>
                Telefon{' '}
                <span className='sort-arrow'>{getSortIcon('telefon')}</span>
              </th>
              <th
                className='sortable'
                onClick={() => handleSort('dataRejestracji')}
              >
                Data rejestracji{' '}
                <span className='sort-arrow'>
                  {getSortIcon('dataRejestracji')}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedReaders.map((reader) => (
              <tr
                key={reader.czytelnikId}
                className={isSelected(reader.czytelnikId) ? 'selected' : ''}
              >
                <td>
                  <input
                    type='checkbox'
                    checked={isSelected(reader.czytelnikId)}
                    onChange={() => handleSelectReader(reader.czytelnikId)}
                  />
                </td>
                <td>{reader.imie}</td>
                <td>{reader.nazwisko}</td>
                <td>{reader.email}</td>
                <td>{reader.telefon}</td>
                <td>{new Date(reader.dataRejestracji).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginacja */}
      <div className='pagination'>
        <div className='pagination-info'>
          Wyświetlanie {startIndex}-{endIndex} z {totalItems} czytelników
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

      <ReadersModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddReader}
      />
    </div>
  );
}

function Readers() {
  return (
    <ReadersFormProvider>
      <ReadersContent />
    </ReadersFormProvider>
  );
}

export default Readers;

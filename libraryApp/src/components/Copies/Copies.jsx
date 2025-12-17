import useCopies from '../../hooks/useCopies';
import useBooks from '../../hooks/useBooks';
import '../Books/Books.css';
import { useSelection } from '../../hooks/useSelection';
import { useCopiesForm } from '../../hooks/useCopiesForm';
import useSorting from '../../hooks/useSorting';
import usePagination from '../../hooks/usePagination';
import { useState } from 'react';
import useLibraries from '../../hooks/useLibraries';
import CopiesModal from './CopiesModal/CopiesModal';
import { CopiesFormProvider } from '../../contexts/CopiesFormContext';

function CopiesContent() {
  const { copies, loading, error, addCopy, deleteCopy, fetchCopies } =
    useCopies();
  const { libraries, fetchLibraries, addLibrary } = useLibraries();
  const { books, fetchBooks } = useBooks();

  const {
    selectedIds: selectedCopies,
    toggleItem: handleSelectCopy,
    toggleAll: handleSelectAll,
    isSelected,
    isAllSelected,
    clearSelection,
    count: selectedCount,
  } = useSelection('egzemplarzId');

  const {
    copyData,
    libraryData,
    resetCopyForm,
    resetLibraryForm,
    selectLibrary,
    toggleLibraryForm,
  } = useCopiesForm();

  // // Stan lokalny - tylko dla UI
  const [showAddModal, setShowAddModal] = useState(false);

  // Stan filtrów
  const [filters, setFilters] = useState({
    status: '',
    bibliotekaId: '',
    ksiazkaId: '',
  });

  // Konfiguracja sortowania
  const sortConfig = {
    tytul: (a, b) =>
      a.ksiazka.tytul
        .toLowerCase()
        .localeCompare(b.ksiazka.tytul.toLowerCase()),
    biblioteka: (a, b) =>
      a.biblioteka.nazwa
        .toLowerCase()
        .localeCompare(b.biblioteka.nazwa.toLowerCase()),
    sygnatura: (a, b) =>
      (a.sygnatura || '')
        .toLowerCase()
        .localeCompare((b.sygnatura || '').toLowerCase()),
    barcode: (a, b) =>
      (a.barcode || '')
        .toLowerCase()
        .localeCompare((b.barcode || '').toLowerCase()),
    status: (a, b) =>
      a.status.toLowerCase().localeCompare(b.status.toLowerCase()),
    dataDodania: (a, b) => new Date(a.dataDodania) - new Date(b.dataDodania),
  };

  const {
    sortedData: sortedCopies,
    handleSort,
    getSortIcon,
  } = useSorting(copies, sortConfig);

  const {
    paginatedData: displayedCopies,
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
  } = usePagination(sortedCopies, 10);

  // Usuwanie wybranych egzemplarzy
  const handleDeleteSelected = async () => {
    if (selectedCount === 0) return;

    if (!confirm(`Czy na pewno chcesz usunąć ${selectedCount} egzemplarzy?`))
      return;

    const result = await deleteCopy(selectedCopies);

    if (result.failed > 0) {
      alert(
        `Usunięto: ${result.succeeded}\n` +
          `Błędy (${result.failed}):\n${result.errors.join('\n')}`
      );
    }

    clearSelection();
  };

  // Dodawanie egzemplarza
  const handleAddCopy = async (e) => {
    e.preventDefault();

    const copyDataToSend = {
      ...copyData,
      ksiazkaId: parseInt(copyData.ksiazkaId),
      bibliotekaId: parseInt(copyData.bibliotekaId),
    };

    const result = await addCopy(copyDataToSend);

    if (result.success) {
      setShowAddModal(false);
      resetCopyForm();
    } else {
      alert(`Błąd podczas dodawania egzemplarza: ${result.error}`);
    }
  };

  // Dodawanie biblioteki
  const handleAddLibrary = async (e) => {
    e.preventDefault();

    const result = await addLibrary(libraryData);
    if (result.success) {
      selectLibrary(result.library.bibliotekaId);
      resetLibraryForm();
      toggleLibraryForm(false);
    } else {
      alert(`Błąd podczas dodawania biblioteki: ${result.error}`);
    }
  };

  // Otwieranie modalu dodawania książki
  const handleOpenAddModal = () => {
    setShowAddModal(true);
    resetCopyForm();
    resetLibraryForm();
    fetchLibraries();
    fetchBooks();
  };

  // Filtrowanie egzemplarzy
  const handleFilter = (e) => {
    e.preventDefault();
    const activeFilters = {};

    if (filters.status) activeFilters.status = filters.status;
    if (filters.bibliotekaId)
      activeFilters.bibliotekaId = parseInt(filters.bibliotekaId);
    if (filters.ksiazkaId)
      activeFilters.ksiazkaId = parseInt(filters.ksiazkaId);

    fetchCopies(activeFilters);
  };

  // Resetowanie filtrów
  const handleClearFilters = () => {
    setFilters({
      status: '',
      bibliotekaId: '',
      ksiazkaId: '',
    });
    fetchCopies();
  };

  if (loading) return <div className='loading'>Ładowanie egzemplarzy...</div>;
  if (error) return <div className='error'>Błąd: {error}</div>;

  return (
    <div className='container'>
      <div className='header'>
        <h1>Lista egzemplarzy</h1>
        <div className='header-actions'>
          <button className='btn btn-primary' onClick={handleOpenAddModal}>
            + Dodaj egzemplarz
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
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value=''>Wszystkie</option>
                <option value='Dostępny'>Dostępny</option>
                <option value='Wypożyczony'>Wypożyczony</option>
                <option value='Niedostępny'>Niedostępny</option>
              </select>
            </div>
            <div className='form-group'>
              <label>Biblioteka</label>
              <select
                value={filters.bibliotekaId}
                onChange={(e) =>
                  setFilters({ ...filters, bibliotekaId: e.target.value })
                }
              >
                <option value=''>Wszystkie biblioteki</option>
                {libraries.map((library) => (
                  <option
                    key={library.bibliotekaId}
                    value={library.bibliotekaId}
                  >
                    {library.nazwa}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <label>Książka</label>
              <select
                value={filters.ksiazkaId}
                onChange={(e) =>
                  setFilters({ ...filters, ksiazkaId: e.target.value })
                }
              >
                <option value=''>Wszystkie książki</option>
                {books.map((book) => (
                  <option key={book.ksiazkaId} value={book.ksiazkaId}>
                    {book.tytul}
                  </option>
                ))}
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
                  checked={isAllSelected(copies)}
                  onChange={() => handleSelectAll(copies)}
                />
              </th>
              <th className='sortable' onClick={() => handleSort('tytul')}>
                Tytuł książki{' '}
                <span className='sort-arrow'>{getSortIcon('tytul')}</span>
              </th>
              <th className='sortable' onClick={() => handleSort('biblioteka')}>
                Biblioteka{' '}
                <span className='sort-arrow'>{getSortIcon('biblioteka')}</span>
              </th>
              <th className='sortable' onClick={() => handleSort('sygnatura')}>
                Sygnatura{' '}
                <span className='sort-arrow'>{getSortIcon('sygnatura')}</span>
              </th>
              <th className='sortable' onClick={() => handleSort('barcode')}>
                Kod kreskowy{' '}
                <span className='sort-arrow'>{getSortIcon('barcode')}</span>
              </th>
              <th className='sortable' onClick={() => handleSort('status')}>
                Status{' '}
                <span className='sort-arrow'>{getSortIcon('status')}</span>
              </th>
              <th
                className='sortable'
                onClick={() => handleSort('dataDodania')}
              >
                Data dodania{' '}
                <span className='sort-arrow'>{getSortIcon('dataDodania')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedCopies.map((copy) => (
              <tr
                key={copy.egzemplarzId}
                className={isSelected(copy.egzemplarzId) ? 'selected' : ''}
              >
                <td>
                  <input
                    type='checkbox'
                    checked={isSelected(copy.egzemplarzId)}
                    onChange={() => handleSelectCopy(copy.egzemplarzId)}
                  />
                </td>
                <td>{copy.ksiazka.tytul}</td>
                <td>{copy.biblioteka.nazwa}</td>
                <td>{copy.sygnatura}</td>
                <td>{copy.barcode}</td>
                <td>{copy.status}</td>
                <td>{new Date(copy.dataDodania).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginacja */}
      <div className='pagination'>
        <div className='pagination-info'>
          Wyświetlanie {startIndex}-{endIndex} z {totalItems} egzemplarzy
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

      <CopiesModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCopy}
        books={books}
        libraries={libraries}
        onLibrarySubmit={handleAddLibrary}
      />
    </div>
  );
}

function Copies() {
  return (
    <CopiesFormProvider>
      <CopiesContent />
    </CopiesFormProvider>
  );
}

export default Copies;

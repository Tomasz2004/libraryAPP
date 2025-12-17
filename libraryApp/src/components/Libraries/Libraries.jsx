import { useState, useEffect } from 'react';
import useLibraries from '../../hooks/useLibraries';
import { useSelection } from '../../hooks/useSelection';
import useSorting from '../../hooks/useSorting';
import usePagination from '../../hooks/usePagination';
import LibraryModal from './LibraryModal/LibraryModal';
import '../Books/Books.css';

function Libraries() {
  const {
    libraries,
    loading,
    error,
    fetchLibraries,
    addLibrary,
    deleteLibrary,
  } = useLibraries();

  const {
    selectedIds: selectedLibraries,
    toggleItem: handleSelectLibrary,
    toggleAll: handleSelectAll,
    isSelected,
    isAllSelected,
    clearSelection,
    count: selectedCount,
  } = useSelection('bibliotekaId');

  const [showAddModal, setShowAddModal] = useState(false);
  const [libraryData, setLibraryData] = useState({ nazwa: '', adres: '' });

  // Konfiguracja sortowania
  const sortConfig = {
    nazwa: (a, b) => a.nazwa.toLowerCase().localeCompare(b.nazwa.toLowerCase()),
    adres: (a, b) =>
      (a.adres || '')
        .toLowerCase()
        .localeCompare((b.adres || '').toLowerCase()),
  };

  const {
    sortedData: sortedLibraries,
    handleSort,
    getSortIcon,
  } = useSorting(libraries, sortConfig);

  const {
    paginatedData: displayedLibraries,
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
  } = usePagination(sortedLibraries, 10);

  useEffect(() => {
    fetchLibraries();
  }, [fetchLibraries]);

  const handleDeleteSelected = async () => {
    if (selectedCount === 0) return;

    if (!confirm(`Czy na pewno chcesz usunąć ${selectedCount} bibliotek?`))
      return;

    let succeeded = 0;
    let failed = 0;
    const errors = [];

    for (const id of selectedLibraries) {
      const result = await deleteLibrary(id);
      if (result.success) {
        succeeded++;
      } else {
        failed++;
        errors.push(`Biblioteka ${id}: ${result.error}`);
      }
    }

    if (failed > 0) {
      alert(`Usunięto: ${succeeded}\nBłędy (${failed}):\n${errors.join('\n')}`);
    }

    clearSelection();
  };

  const handleAddLibrary = async (e) => {
    e.preventDefault();

    const result = await addLibrary(libraryData);

    if (result.success) {
      setShowAddModal(false);
      setLibraryData({ nazwa: '', adres: '' });
    } else {
      alert(`Błąd podczas dodawania biblioteki: ${result.error}`);
    }
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setLibraryData({ nazwa: '', adres: '' });
  };

  if (loading) return <div className='loading'>Ładowanie bibliotek...</div>;
  if (error) return <div className='error'>Błąd: {error}</div>;

  return (
    <div className='container'>
      <div className='header'>
        <h1>Lista Bibliotek</h1>
        <div className='header-actions'>
          <button className='btn btn-primary' onClick={handleOpenAddModal}>
            + Dodaj bibliotekę
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
                  checked={isAllSelected(libraries)}
                  onChange={() => handleSelectAll(libraries)}
                />
              </th>
              <th className='sortable' onClick={() => handleSort('nazwa')}>
                Nazwa <span className='sort-arrow'>{getSortIcon('nazwa')}</span>
              </th>
              <th className='sortable' onClick={() => handleSort('adres')}>
                Adres <span className='sort-arrow'>{getSortIcon('adres')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedLibraries.map((library) => (
              <tr
                key={library.bibliotekaId}
                className={isSelected(library.bibliotekaId) ? 'selected' : ''}
              >
                <td>
                  <input
                    type='checkbox'
                    checked={isSelected(library.bibliotekaId)}
                    onChange={() => handleSelectLibrary(library.bibliotekaId)}
                  />
                </td>
                <td>{library.nazwa}</td>
                <td>{library.adres}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginacja */}
      <div className='pagination'>
        <div className='pagination-info'>
          Wyświetlanie {startIndex}-{endIndex} z {totalItems} bibliotek
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

      <LibraryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddLibrary}
        libraryData={libraryData}
        setLibraryData={setLibraryData}
      />
    </div>
  );
}

export default Libraries;

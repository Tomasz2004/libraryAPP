import { useState } from 'react';
import useWorkers from '../../hooks/useWorkers';
import useLibraries from '../../hooks/useLibraries';
import { useSelection } from '../../hooks/useSelection';
import useSorting from '../../hooks/useSorting';
import usePagination from '../../hooks/usePagination';
import WorkerModal from './WorkerModal/WorkerModal';
import '../Books/Books.css';

function Workers() {
  const { workers, loading, error, addWorker, deleteWorker } = useWorkers();
  const { libraries, fetchLibraries } = useLibraries();

  const {
    selectedIds: selectedWorkers,
    toggleItem: handleSelectWorker,
    toggleAll: handleSelectAll,
    isSelected,
    isAllSelected,
    clearSelection,
    count: selectedCount,
  } = useSelection('pracownikId');

  const [showAddModal, setShowAddModal] = useState(false);
  const [workerData, setWorkerData] = useState({
    imie: '',
    nazwisko: '',
    stanowisko: '',
    bibliotekaId: '',
    zatrudnionyOd: '',
  });

  // Konfiguracja sortowania
  const sortConfig = {
    imie: (a, b) => a.imie.toLowerCase().localeCompare(b.imie.toLowerCase()),
    nazwisko: (a, b) =>
      a.nazwisko.toLowerCase().localeCompare(b.nazwisko.toLowerCase()),
    stanowisko: (a, b) =>
      a.stanowisko.toLowerCase().localeCompare(b.stanowisko.toLowerCase()),
    biblioteka: (a, b) => {
      const av = a.biblioteka?.nazwa || '';
      const bv = b.biblioteka?.nazwa || '';
      return av.toLowerCase().localeCompare(bv.toLowerCase());
    },
    zatrudnionyOd: (a, b) => {
      const ad = a.zatrudnionyOd
        ? new Date(a.zatrudnionyOd)
        : new Date('9999-12-31');
      const bd = b.zatrudnionyOd
        ? new Date(b.zatrudnionyOd)
        : new Date('9999-12-31');
      return ad - bd;
    },
  };

  const {
    sortedData: sortedWorkers,
    handleSort,
    getSortIcon,
  } = useSorting(workers, sortConfig);

  const {
    paginatedData: displayedWorkers,
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
  } = usePagination(sortedWorkers, 10);

  const handleDeleteSelected = async () => {
    if (selectedCount === 0) return;

    if (!confirm(`Czy na pewno chcesz usunąć ${selectedCount} pracowników?`))
      return;

    let succeeded = 0;
    let failed = 0;
    const errors = [];

    for (const id of selectedWorkers) {
      const result = await deleteWorker(id);
      if (result.success) {
        succeeded++;
      } else {
        failed++;
        errors.push(`Pracownik ${id}: ${result.error}`);
      }
    }

    if (failed > 0) {
      alert(`Usunięto: ${succeeded}\nBłędy (${failed}):\n${errors.join('\n')}`);
    }

    clearSelection();
  };

  const handleAddWorker = async (e) => {
    e.preventDefault();

    const workerDataToSend = {
      ...workerData,
      bibliotekaId: parseInt(workerData.bibliotekaId),
    };

    const result = await addWorker(workerDataToSend);

    if (result.success) {
      setShowAddModal(false);
      setWorkerData({
        imie: '',
        nazwisko: '',
        stanowisko: '',
        bibliotekaId: '',
        zatrudnionyOd: '',
      });
    } else {
      alert(`Błąd podczas dodawania pracownika: ${result.error}`);
    }
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setWorkerData({
      imie: '',
      nazwisko: '',
      stanowisko: '',
      bibliotekaId: '',
      zatrudnionyOd: '',
    });
    fetchLibraries();
  };

  if (loading) return <div className='loading'>Ładowanie pracowników...</div>;
  if (error) return <div className='error'>Błąd: {error}</div>;

  return (
    <div className='container'>
      <div className='header'>
        <h1>Lista Pracowników</h1>
        <div className='header-actions'>
          <button className='btn btn-primary' onClick={handleOpenAddModal}>
            + Dodaj pracownika
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
                  checked={isAllSelected(workers)}
                  onChange={() => handleSelectAll(workers)}
                />
              </th>
              <th className='sortable' onClick={() => handleSort('imie')}>
                Imię <span className='sort-arrow'>{getSortIcon('imie')}</span>
              </th>
              <th className='sortable' onClick={() => handleSort('nazwisko')}>
                Nazwisko{' '}
                <span className='sort-arrow'>{getSortIcon('nazwisko')}</span>
              </th>
              <th className='sortable' onClick={() => handleSort('stanowisko')}>
                Stanowisko{' '}
                <span className='sort-arrow'>{getSortIcon('stanowisko')}</span>
              </th>
              <th className='sortable' onClick={() => handleSort('biblioteka')}>
                Biblioteka{' '}
                <span className='sort-arrow'>{getSortIcon('biblioteka')}</span>
              </th>
              <th
                className='sortable'
                onClick={() => handleSort('zatrudnionyOd')}
              >
                Zatrudniony od{' '}
                <span className='sort-arrow'>
                  {getSortIcon('zatrudnionyOd')}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedWorkers.map((worker) => (
              <tr
                key={worker.pracownikId}
                className={isSelected(worker.pracownikId) ? 'selected' : ''}
              >
                <td>
                  <input
                    type='checkbox'
                    checked={isSelected(worker.pracownikId)}
                    onChange={() => handleSelectWorker(worker.pracownikId)}
                  />
                </td>
                <td>{worker.imie}</td>
                <td>{worker.nazwisko}</td>
                <td>{worker.stanowisko}</td>
                <td>
                  {worker.biblioteka ? worker.biblioteka.nazwa : 'Brak danych'}
                </td>
                <td>
                  {worker.zatrudnionyOd
                    ? new Date(worker.zatrudnionyOd).toLocaleDateString()
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginacja */}
      <div className='pagination'>
        <div className='pagination-info'>
          Wyświetlanie {startIndex}-{endIndex} z {totalItems} pracowników
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

      <WorkerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddWorker}
        workerData={workerData}
        setWorkerData={setWorkerData}
        libraries={libraries}
      />
    </div>
  );
}

export default Workers;

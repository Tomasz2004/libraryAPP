import { useState } from 'react';
import useWorkers from '../../hooks/useWorkers';
import useLibraries from '../../hooks/useLibraries';
import { useSelection } from '../../hooks/useSelection';
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
              <th>Imię</th>
              <th>Nazwisko</th>
              <th>Stanowisko</th>
              <th>Biblioteka</th>
              <th>Zatrudniony od</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
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

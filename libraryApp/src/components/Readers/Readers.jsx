import '../Books/Books.css';
import { useSelection } from '../../hooks/useSelection';
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
          <button className='btn btn-danger' onClick={handleDeleteSelected}>
            Usuń wybrane ({selectedCount})
          </button>
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
              <th>Imię</th>
              <th>Nazwisko</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Data rejestracji</th>
            </tr>
          </thead>
          <tbody>
            {readers.map((reader) => (
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

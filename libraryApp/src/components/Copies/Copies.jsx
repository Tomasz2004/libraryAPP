import useCopies from '../../hooks/useCopies';
import useBooks from '../../hooks/useBooks';
import '../Books/Books.css';
import { useSelection } from '../../hooks/useSelection';
import { useCopiesForm } from '../../hooks/useCopiesForm';
import { useState } from 'react';
import useLibraries from '../../hooks/useLibraries';
import CopiesModal from './CopiesModal/CopiesModal';
import { CopiesFormProvider } from '../../contexts/CopiesFormContext';

function CopiesContent() {
  const { copies, loading, error, addCopy, deleteCopy } = useCopies();
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
          <button className='btn btn-danger' onClick={handleDeleteSelected}>
            Usuń wybrane ({selectedCount})
          </button>
        </div>
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
              <th>Tytuł książki</th>
              <th>Biblioteka</th>
              <th>Sygnatura</th>
              <th>Kod kreskowy</th>
              <th>Status</th>
              <th>Data dodania</th>
            </tr>
          </thead>
          <tbody>
            {copies.map((copy) => (
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

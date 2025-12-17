import { useCopiesForm } from '../../../hooks/useCopiesForm';
import LibraryForm from '../LibraryForm/LibraryForm';
import { useEffect } from 'react';
import '../../Books/BookModal/BookModal.css';

function CopiesModal({
  isOpen,
  onClose,
  onSubmit,
  books,
  libraries,
  onLibrarySubmit,
  editingCopy,
}) {
  // Pobierz stan i funkcje z contextu
  const { copyData, setCopyData, showLibraryForm, toggleLibraryForm } =
    useCopiesForm();

  // Wypełnij formularz danymi edytowanego egzemplarza
  useEffect(() => {
    if (isOpen && editingCopy) {
      setCopyData({
        ksiazkaId: editingCopy.ksiazka.ksiazkaId || '',
        bibliotekaId: editingCopy.biblioteka.bibliotekaId || '',
        sygnatura: editingCopy.sygnatura || '',
        barcode: editingCopy.barcode || '',
        status: editingCopy.status || '',
      });
    }
  }, [isOpen, editingCopy, setCopyData]);

  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <h2>{editingCopy ? 'Edytuj egzemplarz' : 'Dodaj nowy egzemplarz'}</h2>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label>Książka *</label>
            <select
              required
              value={copyData.ksiazkaId}
              onChange={(e) =>
                setCopyData({ ...copyData, ksiazkaId: e.target.value })
              }
            >
              <option value=''>Wybierz książkę...</option>
              {books.map((book) => (
                <option key={book.ksiazkaId} value={book.ksiazkaId}>
                  {book.tytul} - {book.autor.imie} {book.autor.nazwisko}
                </option>
              ))}
            </select>
          </div>

          <div className='form-group'>
            <label>Biblioteka *</label>
            <select
              required
              value={copyData.bibliotekaId}
              onChange={(e) => {
                if (e.target.value === 'new') {
                  toggleLibraryForm(true);
                } else {
                  setCopyData({ ...copyData, bibliotekaId: e.target.value });
                }
              }}
            >
              <option value=''>Wybierz bibliotekę...</option>
              {libraries.map((library) => (
                <option key={library.bibliotekaId} value={library.bibliotekaId}>
                  {library.nazwa} {library.adres}
                </option>
              ))}
              <option value='new'>+ Dodaj nową bibliotekę...</option>
            </select>
          </div>

          {showLibraryForm && <LibraryForm onSubmit={onLibrarySubmit} />}
          <div className='form-group'>
            <label>Sygnatura</label>
            <input
              type='text'
              value={copyData.sygnatura}
              onChange={(e) =>
                setCopyData({ ...copyData, sygnatura: e.target.value })
              }
            />
          </div>

          <div className='form-group'>
            <label>Kod kreskowy *</label>
            <input
              required
              type='text'
              value={copyData.barcode}
              onChange={(e) =>
                setCopyData({ ...copyData, barcode: e.target.value })
              }
            />
          </div>

          <div className='form-group'>
            <label>Status</label>
            <select
              value={copyData.status}
              onChange={(e) =>
                setCopyData({ ...copyData, status: e.target.value })
              }
            >
              <option value='Dostępny'>Dostępny</option>
              <option value='Wypożyczony'>Wypożyczony</option>
              <option value='Niedostępny'>Niedostępny</option>
            </select>
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
              {editingCopy ? 'Zapisz zmiany' : 'Dodaj'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CopiesModal;

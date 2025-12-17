import { useBookForm } from '../../../hooks/useBookForm';
import AuthorForm from '../AuthorForm/AuthorForm';
import { useEffect } from 'react';
import './BookModal.css';

/**
 * Modal do dodawania/edycji książki
 * Używa Context API - pobiera stan z BookFormContext
 *
 * @param {boolean} isOpen - czy modal jest otwarty
 * @param {function} onClose - funkcja zamykająca modal
 * @param {function} onSubmit - funkcja do zapisania książki
 * @param {array} authors - lista autorów
 * @param {function} onAuthorSubmit - funkcja do zapisania autora
 * @param {object} editingBook - książka do edycji (null jeśli dodawanie)
 */
function BookModal({
  isOpen,
  onClose,
  onSubmit,
  authors,
  onAuthorSubmit,
  editingBook,
}) {
  // Pobierz stan i funkcje z contextu
  const { bookData, setBookData, showAuthorForm, toggleAuthorForm } =
    useBookForm();

  // Wypełnij formularz danymi edytowanej książki
  useEffect(() => {
    if (isOpen && editingBook) {
      setBookData({
        tytul: editingBook.tytul || '',
        autorId: editingBook.autor?.autorId || '',
        gatunek: editingBook.gatunek || '',
        rokWydania: editingBook.rokWydania || '',
        isbn: editingBook.isbn || '',
        opis: editingBook.opis || '',
      });
    }
  }, [isOpen, editingBook, setBookData]);

  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <h2>{editingBook ? 'Edytuj książkę' : 'Dodaj nową książkę'}</h2>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label>Tytuł *</label>
            <input
              type='text'
              required
              value={bookData.tytul}
              onChange={(e) =>
                setBookData({ ...bookData, tytul: e.target.value })
              }
            />
          </div>

          <div className='form-group'>
            <label>Autor *</label>
            <select
              required
              value={bookData.autorId}
              onChange={(e) => {
                if (e.target.value === 'new') {
                  toggleAuthorForm(true);
                } else {
                  setBookData({ ...bookData, autorId: e.target.value });
                }
              }}
            >
              <option value=''>Wybierz autora...</option>
              {authors.map((author) => (
                <option key={author.autorId} value={author.autorId}>
                  {author.imie} {author.nazwisko}
                </option>
              ))}
              <option value='new'>+ Dodaj nowego autora...</option>
            </select>
          </div>

          {showAuthorForm && <AuthorForm onSubmit={onAuthorSubmit} />}

          <div className='form-group'>
            <label>Gatunek</label>
            <input
              type='text'
              value={bookData.gatunek}
              required
              onChange={(e) =>
                setBookData({ ...bookData, gatunek: e.target.value })
              }
            />
          </div>

          <div className='form-group'>
            <label>Rok wydania</label>
            <input
              required
              type='number'
              value={bookData.rokWydania}
              onChange={(e) =>
                setBookData({ ...bookData, rokWydania: e.target.value })
              }
            />
          </div>

          <div className='form-group'>
            <label>ISBN</label>
            <input
              type='text'
              value={bookData.isbn}
              onChange={(e) =>
                setBookData({ ...bookData, isbn: e.target.value })
              }
            />
          </div>

          <div className='form-group'>
            <label>Opis</label>
            <textarea
              value={bookData.opis}
              onChange={(e) =>
                setBookData({ ...bookData, opis: e.target.value })
              }
              rows='3'
            />
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
              {editingBook ? 'Zapisz zmiany' : 'Dodaj'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookModal;

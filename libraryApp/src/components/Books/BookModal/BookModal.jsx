import AuthorForm from '../AuthorForm/AuthorForm';
import './BookModal.css';

/**
 * Modal do dodawania/edycji książki
 * Komponent kontrolowany przez rodzica - otrzymuje wszystkie dane i handlery przez props
 *
 * @param {boolean} isOpen - czy modal jest otwarty
 * @param {function} onClose - funkcja zamykająca modal
 * @param {object} bookData - dane książki
 * @param {function} onBookChange - funkcja do zmiany danych książki
 * @param {function} onSubmit - funkcja do zapisania książki
 * @param {array} authors - lista autorów
 * @param {boolean} showAuthorForm - czy pokazać formularz dodawania autora
 * @param {function} onToggleAuthorForm - funkcja do pokazania/ukrycia formularza autora
 * @param {object} authorData - dane nowego autora
 * @param {function} onAuthorChange - funkcja do zmiany danych autora
 * @param {function} onAuthorSubmit - funkcja do zapisania autora
 */
function BookModal({
  isOpen,
  onClose,
  bookData,
  onBookChange,
  onSubmit,
  authors,
  showAuthorForm,
  onToggleAuthorForm,
  authorData,
  onAuthorChange,
  onAuthorSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <h2>Dodaj nową książkę</h2>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label>Tytuł *</label>
            <input
              type='text'
              required
              value={bookData.tytul}
              onChange={(e) =>
                onBookChange({ ...bookData, tytul: e.target.value })
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
                  onToggleAuthorForm(true);
                } else {
                  onBookChange({ ...bookData, autorId: e.target.value });
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

          {showAuthorForm && (
            <AuthorForm
              authorData={authorData}
              onAuthorChange={onAuthorChange}
              onSubmit={onAuthorSubmit}
              onCancel={() => {
                onToggleAuthorForm(false);
                onBookChange({ ...bookData, autorId: '' });
              }}
            />
          )}

          <div className='form-group'>
            <label>Gatunek</label>
            <input
              type='text'
              value={bookData.gatunek}
              onChange={(e) =>
                onBookChange({ ...bookData, gatunek: e.target.value })
              }
            />
          </div>

          <div className='form-group'>
            <label>Rok wydania</label>
            <input
              type='number'
              value={bookData.rokWydania}
              onChange={(e) =>
                onBookChange({ ...bookData, rokWydania: e.target.value })
              }
            />
          </div>

          <div className='form-group'>
            <label>ISBN</label>
            <input
              type='text'
              value={bookData.isbn}
              onChange={(e) =>
                onBookChange({ ...bookData, isbn: e.target.value })
              }
            />
          </div>

          <div className='form-group'>
            <label>Opis</label>
            <textarea
              value={bookData.opis}
              onChange={(e) =>
                onBookChange({ ...bookData, opis: e.target.value })
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
              Dodaj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookModal;

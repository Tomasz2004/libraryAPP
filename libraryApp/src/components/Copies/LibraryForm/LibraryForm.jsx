import { useCopiesForm } from '../../../hooks/useCopiesForm';
import '../../Books/AuthorForm/AuthorForm.css';

/**
 * Formularz dodawania nowej biblioteki
 * Używa Context API - pobiera stan z CopiesFormContext
 *
 * @param {function} onSubmit - funkcja do zapisania biblioteki
 */
function LibraryForm({ onSubmit }) {
  // Pobierz stan i funkcje z contextu
  const { libraryData, setLibraryData, toggleLibraryForm } = useCopiesForm();

  const handleCancel = () => {
    toggleLibraryForm(false);
  };

  return (
    <div className='author-form'>
      <h3>Dodaj nową bibliotekę</h3>
      <div className='form-group'>
        <label>Nazwa *</label>
        <input
          type='text'
          required
          value={libraryData.nazwa}
          onChange={(e) =>
            setLibraryData({ ...libraryData, nazwa: e.target.value })
          }
        />
      </div>
      <div className='form-group'>
        <label>Adres *</label>
        <input
          type='text'
          required
          value={libraryData.adres}
          onChange={(e) =>
            setLibraryData({ ...libraryData, adres: e.target.value })
          }
        />
      </div>

      <div className='author-form-actions'>
        <button
          type='button'
          className='btn btn-secondary btn-sm'
          onClick={handleCancel}
        >
          Anuluj
        </button>
        <button
          type='button'
          className='btn btn-primary btn-sm'
          onClick={onSubmit}
        >
          Zapisz bibliotekę
        </button>
      </div>
    </div>
  );
}

export default LibraryForm;

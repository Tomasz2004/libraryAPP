import { useBookForm } from '../../../hooks/useBookForm';
import './AuthorForm.css';

/**
 * Formularz dodawania nowego autora
 * Używa Context API - pobiera stan z BookFormContext
 *
 * @param {function} onSubmit - funkcja do zapisania autora
 */
function AuthorForm({ onSubmit }) {
  // Pobierz stan i funkcje z contextu
  const { authorData, setAuthorData, toggleAuthorForm } = useBookForm();

  return (
    <div className='author-form'>
      <h3>Dodaj nowego autora</h3>
      <div className='form-group'>
        <label>Imię *</label>
        <input
          type='text'
          required
          value={authorData.imie}
          onChange={(e) =>
            setAuthorData({ ...authorData, imie: e.target.value })
          }
        />
      </div>
      <div className='form-group'>
        <label>Nazwisko *</label>
        <input
          type='text'
          required
          value={authorData.nazwisko}
          onChange={(e) =>
            setAuthorData({ ...authorData, nazwisko: e.target.value })
          }
        />
      </div>
      <div className='form-group'>
        <label>Data urodzenia</label>
        <input
          type='date'
          value={authorData.dataUrodzenia}
          onChange={(e) =>
            setAuthorData({
              ...authorData,
              dataUrodzenia: e.target.value,
            })
          }
        />
      </div>
      <div className='form-group'>
        <label>Kraj</label>
        <input
          type='text'
          value={authorData.kraj}
          onChange={(e) =>
            setAuthorData({ ...authorData, kraj: e.target.value })
          }
        />
      </div>
      <div className='author-form-actions'>
        <button
          type='button'
          className='btn btn-secondary btn-sm'
          onClick={() => toggleAuthorForm(false)}
        >
          Anuluj
        </button>
        <button
          type='button'
          className='btn btn-primary btn-sm'
          onClick={onSubmit}
        >
          Zapisz autora
        </button>
      </div>
    </div>
  );
}

export default AuthorForm;

import './AuthorForm.css';

/**
 * Formularz dodawania nowego autora
 * Komponent prezentacyjny - otrzymuje dane i funkcje przez props
 */
function AuthorForm({ authorData, onAuthorChange, onSubmit, onCancel }) {
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
            onAuthorChange({ ...authorData, imie: e.target.value })
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
            onAuthorChange({ ...authorData, nazwisko: e.target.value })
          }
        />
      </div>
      <div className='form-group'>
        <label>Data urodzenia</label>
        <input
          type='date'
          value={authorData.dataUrodzenia}
          onChange={(e) =>
            onAuthorChange({
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
            onAuthorChange({ ...authorData, kraj: e.target.value })
          }
        />
      </div>
      <div className='author-form-actions'>
        <button
          type='button'
          className='btn btn-secondary btn-sm'
          onClick={onCancel}
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

import '../../Books/BookModal/BookModal.css';

function LibraryModal({
  isOpen,
  onClose,
  onSubmit,
  libraryData,
  setLibraryData,
}) {
  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <h2>Dodaj nową bibliotekę</h2>
        <form onSubmit={onSubmit}>
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
            <label>Adres</label>
            <textarea
              rows='3'
              value={libraryData.adres}
              onChange={(e) =>
                setLibraryData({ ...libraryData, adres: e.target.value })
              }
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

export default LibraryModal;

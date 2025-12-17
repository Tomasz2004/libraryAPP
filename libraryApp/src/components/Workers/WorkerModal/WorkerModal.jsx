import '../../Books/BookModal/BookModal.css';

function WorkerModal({
  isOpen,
  onClose,
  onSubmit,
  workerData,
  setWorkerData,
  libraries,
  editingWorker,
}) {
  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <h2>
          {editingWorker ? 'Edytuj pracownika' : 'Dodaj nowego pracownika'}
        </h2>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label>Imię *</label>
            <input
              type='text'
              required
              value={workerData.imie}
              onChange={(e) =>
                setWorkerData({ ...workerData, imie: e.target.value })
              }
            />
          </div>

          <div className='form-group'>
            <label>Nazwisko *</label>
            <input
              type='text'
              required
              value={workerData.nazwisko}
              onChange={(e) =>
                setWorkerData({ ...workerData, nazwisko: e.target.value })
              }
            />
          </div>

          <div className='form-group'>
            <label>Stanowisko</label>
            <input
              type='text'
              value={workerData.stanowisko}
              onChange={(e) =>
                setWorkerData({ ...workerData, stanowisko: e.target.value })
              }
            />
          </div>

          <div className='form-group'>
            <label>Biblioteka *</label>
            <select
              required
              value={workerData.bibliotekaId}
              onChange={(e) =>
                setWorkerData({ ...workerData, bibliotekaId: e.target.value })
              }
            >
              <option value=''>Wybierz bibliotekę...</option>
              {libraries.map((library) => (
                <option key={library.bibliotekaId} value={library.bibliotekaId}>
                  {library.nazwa}
                </option>
              ))}
            </select>
          </div>

          <div className='form-group'>
            <label>Zatrudniony od</label>
            <input
              type='date'
              value={workerData.zatrudnionyOd}
              onChange={(e) =>
                setWorkerData({ ...workerData, zatrudnionyOd: e.target.value })
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
              {editingWorker ? 'Zapisz zmiany' : 'Dodaj'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WorkerModal;

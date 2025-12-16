import { useReadersForm } from '../../../hooks/useReadersForm';
import '../../Books/BookModal/BookModal.css';

function ReadersModal({ isOpen, onClose, onSubmit }) {
  // Pobierz stan i funkcje z contextu
  const { readerData, setReaderData } = useReadersForm();

  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <h2>Dodaj nowego czytelnika</h2>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label>Imię *</label>
            <input
              required
              type='text'
              value={readerData.imie}
              onChange={(e) =>
                setReaderData({ ...readerData, imie: e.target.value })
              }
            ></input>
          </div>

          <div className='form-group'>
            <label>Nazwisko *</label>
            <input
              required
              type='text'
              value={readerData.nazwisko}
              onChange={(e) =>
                setReaderData({ ...readerData, nazwisko: e.target.value })
              }
            ></input>
          </div>

          <div className='form-group'>
            <label>Email</label>
            <input
              type='email'
              value={readerData.email}
              onChange={(e) =>
                setReaderData({ ...readerData, email: e.target.value })
              }
            />
          </div>

          <div className='form-group'>
            <label>Telefon</label>
            <input
              required
              type='tel'
              value={readerData.telefon}
              onChange={(e) =>
                setReaderData({ ...readerData, telefon: e.target.value })
              }
            />
          </div>

          <div className='form-group'>
            <label>Data Rejestracji</label>
            <input
              value={readerData.dataRejestracji}
              type='date'
              onChange={(e) =>
                setReaderData({
                  ...readerData,
                  dataRejestracji: e.target.value,
                })
              }
            ></input>
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

export default ReadersModal;

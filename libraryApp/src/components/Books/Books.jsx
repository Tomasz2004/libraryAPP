import { useState, useEffect } from 'react';
import './Books.css';

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [showAddAuthorForm, setShowAddAuthorForm] = useState(false);
  const [newBook, setNewBook] = useState({
    tytul: '',
    autorId: '',
    gatunek: '',
    rokWydania: '',
    isbn: '',
    opis: '',
  });
  const [newAuthor, setNewAuthor] = useState({
    imie: '',
    nazwisko: '',
    dataUrodzenia: '',
    kraj: '',
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/ksiazki')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Błąd pobierania danych');
        }
        return response.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  const fetchAuthors = () => {
    fetch('http://localhost:8080/api/autorzy')
      .then((response) => response.json())
      .then((data) => setAuthors(data))
      .catch((error) => console.error('Error fetching authors:', error));
  };

  const handleSelectBook = (bookId) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBooks.length === books.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(books.map((book) => book.ksiazkaId));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedBooks.length === 0) return;

    if (!confirm(`Czy na pewno chcesz usunąć ${selectedBooks.length} książek?`))
      return;

    try {
      const results = await Promise.allSettled(
        selectedBooks.map((id) => deleteBook(id, false))
      );

      const failed = results.filter((r) => r.status === 'rejected');
      const succeeded = results.filter((r) => r.status === 'fulfilled');

      if (failed.length > 0) {
        const errorMessages = failed
          .map((r) => {
            const error = r.reason.message;
            return error;
          })
          .join('\n');

        alert(
          `Usunięto: ${succeeded.length}\n` +
            `Błędy (${failed.length}):\n${errorMessages}`
        );
      }

      setSelectedBooks([]);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting books:', error);
      alert('Wystąpił nieoczekiwany błąd podczas usuwania książek');
    }
  };

  const deleteBook = async (id, cascade = false) => {
    const url = cascade
      ? `http://localhost:8080/api/ksiazki/${id}?cascade=true`
      : `http://localhost:8080/api/ksiazki/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 409) {
        // Konflikt - książka ma egzemplarze
        try {
          const errorData = await response.json();
          const count = errorData.count || 0;

          // Zapytaj użytkownika czy chce usunąć egzemplarze
          const shouldCascade = confirm(
            `Książka (ID: ${id}) ma ${count} powiązanych egzemplarzy.\n\n` +
              `Czy chcesz usunąć książkę wraz z wszystkimi jej egzemplarzami?`
          );

          if (shouldCascade) {
            // Ponów usuwanie z cascade=true
            return await deleteBook(id, true);
          } else {
            throw new Error(
              `Książka (ID: ${id}) nie została usunięta - ma ${count} egzemplarzy`
            );
          }
        } catch (parseError) {
          // Jeśli nie udało się sparsować JSON, rzuć oryginalny błąd
          throw new Error(
            `Błąd podczas usuwania książki (ID: ${id}): ${parseError.message}`
          );
        }
      } else {
        const errorText = await response.text();
        throw new Error(errorText || `Błąd ${response.status}`);
      }
    }

    return id;
  };

  const handleAddBook = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/ksiazki', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newBook,
          rokWydania: parseInt(newBook.rokWydania),
          autorId: parseInt(newBook.autorId),
        }),
      });

      if (!response.ok) {
        throw new Error('Błąd podczas dodawania książki');
      }

      setShowAddModal(false);
      setNewBook({
        tytul: '',
        autorId: '',
        gatunek: '',
        rokWydania: '',
        isbn: '',
        opis: '',
      });
      fetchBooks();
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Błąd podczas dodawania książki');
    }
  };

  const handleAddAuthor = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/autorzy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAuthor),
      });

      if (!response.ok) {
        throw new Error('Błąd podczas dodawania autora');
      }

      const savedAuthor = await response.json();
      setAuthors([...authors, savedAuthor]);
      setNewBook({ ...newBook, autorId: savedAuthor.autorId });
      setNewAuthor({
        imie: '',
        nazwisko: '',
        dataUrodzenia: '',
        kraj: '',
      });
      setShowAddAuthorForm(false);
    } catch (error) {
      console.error('Error adding author:', error);
      alert('Błąd podczas dodawania autora');
    }
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setShowAddAuthorForm(false);
    fetchAuthors();
  };

  if (loading) return <div className='loading'>Ładowanie książek...</div>;
  if (error) return <div className='error'>Błąd: {error}</div>;

  return (
    <div className='container'>
      <div className='header'>
        <h1>Lista Książek</h1>
        <div className='header-actions'>
          <button className='btn btn-primary' onClick={handleOpenAddModal}>
            + Dodaj książkę
          </button>
          {selectedBooks.length > 0 && (
            <button className='btn btn-danger' onClick={handleDeleteSelected}>
              Usuń wybrane ({selectedBooks.length})
            </button>
          )}
        </div>
      </div>

      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type='checkbox'
                  checked={
                    selectedBooks.length === books.length && books.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th>ID</th>
              <th>Tytuł</th>
              <th>Autor</th>
              <th>Gatunek</th>
              <th>Rok Wydania</th>
              <th>ISBN</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr
                key={book.ksiazkaId}
                className={
                  selectedBooks.includes(book.ksiazkaId) ? 'selected' : ''
                }
              >
                <td>
                  <input
                    type='checkbox'
                    checked={selectedBooks.includes(book.ksiazkaId)}
                    onChange={() => handleSelectBook(book.ksiazkaId)}
                  />
                </td>
                <td>{book.ksiazkaId}</td>
                <td>{book.tytul}</td>
                <td>
                  {book.autor
                    ? `${book.autor.imie} ${book.autor.nazwisko}`
                    : 'Brak danych'}
                </td>
                <td>{book.gatunek}</td>
                <td>{book.rokWydania}</td>
                <td>{book.isbn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className='modal-overlay' onClick={() => setShowAddModal(false)}>
          <div className='modal' onClick={(e) => e.stopPropagation()}>
            <h2>Dodaj nową książkę</h2>
            <form onSubmit={handleAddBook}>
              <div className='form-group'>
                <label>Tytuł *</label>
                <input
                  type='text'
                  required
                  value={newBook.tytul}
                  onChange={(e) =>
                    setNewBook({ ...newBook, tytul: e.target.value })
                  }
                />
              </div>
              <div className='form-group'>
                <label>Autor *</label>
                <select
                  required
                  value={newBook.autorId}
                  onChange={(e) => {
                    if (e.target.value === 'new') {
                      setShowAddAuthorForm(true);
                    } else {
                      setNewBook({ ...newBook, autorId: e.target.value });
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

              {showAddAuthorForm && (
                <div className='author-form'>
                  <h3>Dodaj nowego autora</h3>
                  <div className='form-group'>
                    <label>Imię *</label>
                    <input
                      type='text'
                      required
                      value={newAuthor.imie}
                      onChange={(e) =>
                        setNewAuthor({ ...newAuthor, imie: e.target.value })
                      }
                    />
                  </div>
                  <div className='form-group'>
                    <label>Nazwisko *</label>
                    <input
                      type='text'
                      required
                      value={newAuthor.nazwisko}
                      onChange={(e) =>
                        setNewAuthor({ ...newAuthor, nazwisko: e.target.value })
                      }
                    />
                  </div>
                  <div className='form-group'>
                    <label>Data urodzenia</label>
                    <input
                      type='date'
                      value={newAuthor.dataUrodzenia}
                      onChange={(e) =>
                        setNewAuthor({
                          ...newAuthor,
                          dataUrodzenia: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className='form-group'>
                    <label>Kraj</label>
                    <input
                      type='text'
                      value={newAuthor.kraj}
                      onChange={(e) =>
                        setNewAuthor({ ...newAuthor, kraj: e.target.value })
                      }
                    />
                  </div>
                  <div className='author-form-actions'>
                    <button
                      type='button'
                      className='btn btn-secondary btn-sm'
                      onClick={() => {
                        setShowAddAuthorForm(false);
                        setNewBook({ ...newBook, autorId: '' });
                      }}
                    >
                      Anuluj
                    </button>
                    <button
                      type='button'
                      className='btn btn-primary btn-sm'
                      onClick={handleAddAuthor}
                    >
                      Zapisz autora
                    </button>
                  </div>
                </div>
              )}
              <div className='form-group'>
                <label>Gatunek</label>
                <input
                  type='text'
                  value={newBook.gatunek}
                  onChange={(e) =>
                    setNewBook({ ...newBook, gatunek: e.target.value })
                  }
                />
              </div>
              <div className='form-group'>
                <label>Rok wydania</label>
                <input
                  type='number'
                  value={newBook.rokWydania}
                  onChange={(e) =>
                    setNewBook({ ...newBook, rokWydania: e.target.value })
                  }
                />
              </div>
              <div className='form-group'>
                <label>ISBN</label>
                <input
                  type='text'
                  value={newBook.isbn}
                  onChange={(e) =>
                    setNewBook({ ...newBook, isbn: e.target.value })
                  }
                />
              </div>
              <div className='form-group'>
                <label>Opis</label>
                <textarea
                  value={newBook.opis}
                  onChange={(e) =>
                    setNewBook({ ...newBook, opis: e.target.value })
                  }
                  rows='3'
                />
              </div>
              <div className='modal-actions'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={() => setShowAddModal(false)}
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
      )}
    </div>
  );
}

export default Books;

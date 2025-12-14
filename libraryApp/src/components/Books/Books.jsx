import { useState } from 'react';
import useBooks from '../../hooks/useBooks';
import useAuthors from '../../hooks/useAuthors';
import BookModal from './BookModal/BookModal';
import './Books.css';

function Books() {
  // Custom hooks - cała logika biznesowa jest w nich
  const { books, loading, error, addBook, deleteBooks } = useBooks();
  const { authors, fetchAuthors, addAuthor } = useAuthors();

  // Stan lokalny - tylko dla UI
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
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

  // Obsługa zaznaczania książek
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

  // Usuwanie wybranych książek
  const handleDeleteSelected = async () => {
    if (selectedBooks.length === 0) return;

    if (!confirm(`Czy na pewno chcesz usunąć ${selectedBooks.length} książek?`))
      return;

    const result = await deleteBooks(selectedBooks);

    if (result.failed > 0) {
      alert(
        `Usunięto: ${result.succeeded}\n` +
          `Błędy (${result.failed}):\n${result.errors.join('\n')}`
      );
    }

    setSelectedBooks([]);
  };

  // Dodawanie książki
  const handleAddBook = async (e) => {
    e.preventDefault();

    const bookData = {
      ...newBook,
      rokWydania: parseInt(newBook.rokWydania),
      autorId: parseInt(newBook.autorId),
    };

    const result = await addBook(bookData);

    if (result.success) {
      setShowAddModal(false);
      setNewBook({
        tytul: '',
        autorId: '',
        gatunek: '',
        rokWydania: '',
        isbn: '',
        opis: '',
      });
    } else {
      alert(`Błąd podczas dodawania książki: ${result.error}`);
    }
  };

  // Dodawanie autora
  const handleAddAuthor = async (e) => {
    e.preventDefault();

    const result = await addAuthor(newAuthor);

    if (result.success) {
      setNewBook({ ...newBook, autorId: result.author.autorId });
      setNewAuthor({
        imie: '',
        nazwisko: '',
        dataUrodzenia: '',
        kraj: '',
      });
      setShowAddAuthorForm(false);
    } else {
      alert(`Błąd podczas dodawania autora: ${result.error}`);
    }
  };

  // Otwieranie modalu dodawania książki
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

      <BookModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        bookData={newBook}
        onBookChange={setNewBook}
        onSubmit={handleAddBook}
        authors={authors}
        showAuthorForm={showAddAuthorForm}
        onToggleAuthorForm={setShowAddAuthorForm}
        authorData={newAuthor}
        onAuthorChange={setNewAuthor}
        onAuthorSubmit={handleAddAuthor}
      />
    </div>
  );
}

export default Books;

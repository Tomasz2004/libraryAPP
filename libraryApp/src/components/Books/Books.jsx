import { useState } from 'react';
import useBooks from '../../hooks/useBooks';
import useAuthors from '../../hooks/useAuthors';
import { useBookForm } from '../../hooks/useBookForm';
import { useSelection } from '../../hooks/useSelection';
import { BookFormProvider } from '../../contexts/BookFormContext';
import BookModal from './BookModal/BookModal';
import './Books.css';

function BooksContent() {
  // Custom hooks - cała logika biznesowa
  const { books, loading, error, addBook, deleteBooks } = useBooks();
  const { authors, fetchAuthors, addAuthor } = useAuthors();

  // Context - stan formularza
  const {
    bookData,
    authorData,
    resetBookForm,
    resetAuthorForm,
    selectAuthor,
    toggleAuthorForm,
  } = useBookForm();

  // Hook do zaznaczania elementów
  const {
    selectedIds: selectedBooks,
    toggleItem: handleSelectBook,
    toggleAll: handleSelectAll,
    isSelected,
    isAllSelected,
    clearSelection,
    count: selectedCount,
  } = useSelection('ksiazkaId');

  // Stan lokalny - tylko dla UI
  const [showAddModal, setShowAddModal] = useState(false);

  // Usuwanie wybranych książek
  const handleDeleteSelected = async () => {
    if (selectedCount === 0) return;

    if (!confirm(`Czy na pewno chcesz usunąć ${selectedCount} książek?`))
      return;

    const result = await deleteBooks(selectedBooks);

    if (result.failed > 0) {
      alert(
        `Usunięto: ${result.succeeded}\n` +
          `Błędy (${result.failed}):\n${result.errors.join('\n')}`
      );
    }

    clearSelection();
  };

  // Dodawanie książki
  const handleAddBook = async (e) => {
    e.preventDefault();

    const bookDataToSend = {
      ...bookData,
      rokWydania: parseInt(bookData.rokWydania),
      autorId: parseInt(bookData.autorId),
    };

    const result = await addBook(bookDataToSend);

    if (result.success) {
      setShowAddModal(false);
      resetBookForm();
    } else {
      alert(`Błąd podczas dodawania książki: ${result.error}`);
    }
  };

  // Dodawanie autora
  const handleAddAuthor = async (e) => {
    e.preventDefault();

    const result = await addAuthor(authorData);

    if (result.success) {
      selectAuthor(result.author.autorId);
      resetAuthorForm();
      toggleAuthorForm(false);
    } else {
      alert(`Błąd podczas dodawania autora: ${result.error}`);
    }
  };

  // Otwieranie modalu dodawania książki
  const handleOpenAddModal = () => {
    setShowAddModal(true);
    resetBookForm();
    resetAuthorForm();
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
          {selectedCount > 0 && (
            <button className='btn btn-danger' onClick={handleDeleteSelected}>
              Usuń wybrane ({selectedCount})
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
                  checked={isAllSelected(books)}
                  onChange={() => handleSelectAll(books)}
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
                className={isSelected(book.ksiazkaId) ? 'selected' : ''}
              >
                <td>
                  <input
                    type='checkbox'
                    checked={isSelected(book.ksiazkaId)}
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
        onSubmit={handleAddBook}
        authors={authors}
        onAuthorSubmit={handleAddAuthor}
      />
    </div>
  );
}

function Books() {
  return (
    <BookFormProvider>
      <BooksContent />
    </BookFormProvider>
  );
}

export default Books;

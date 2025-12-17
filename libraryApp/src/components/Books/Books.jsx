import { useState } from 'react';
import useBooks from '../../hooks/useBooks';
import useAuthors from '../../hooks/useAuthors';
import { useBookForm } from '../../hooks/useBookForm';
import { useSelection } from '../../hooks/useSelection';
import useSorting from '../../hooks/useSorting';
import { BookFormProvider } from '../../contexts/BookFormContext';
import BookModal from './BookModal/BookModal';
import './Books.css';

function BooksContent() {
  // Custom hooks - cała logika biznesowa
  const { books, loading, error, addBook, deleteBooks, fetchBooks } =
    useBooks();
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

  // Stan filtrów
  const [filters, setFilters] = useState({
    tytul: '',
    autor: '',
    gatunek: '',
    rokWydania: '',
  });

  // Konfiguracja sortowania
  const sortConfig = {
    tytul: (a, b) =>
      (a.tytul || '')
        .toLowerCase()
        .localeCompare((b.tytul || '').toLowerCase()),
    autor: (a, b) => {
      const av = a.autor
        ? `${a.autor.nazwisko} ${a.autor.imie}`.toLowerCase()
        : '';
      const bv = b.autor
        ? `${b.autor.nazwisko} ${b.autor.imie}`.toLowerCase()
        : '';
      return av.localeCompare(bv);
    },
    gatunek: (a, b) =>
      (a.gatunek || '')
        .toLowerCase()
        .localeCompare((b.gatunek || '').toLowerCase()),
    rokWydania: (a, b) => (a.rokWydania || 0) - (b.rokWydania || 0),
    isbn: (a, b) =>
      (a.isbn || '').toLowerCase().localeCompare((b.isbn || '').toLowerCase()),
  };

  const {
    sortedData: sortedBooks,
    handleSort,
    getSortIcon,
  } = useSorting(books, sortConfig);

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

  // Filtrowanie książek
  const handleFilter = (e) => {
    e.preventDefault();
    const activeFilters = {};

    if (filters.tytul) activeFilters.tytul = filters.tytul;
    if (filters.autor) activeFilters.autor = filters.autor;
    if (filters.gatunek) activeFilters.gatunek = filters.gatunek;
    if (filters.rokWydania)
      activeFilters.rokWydania = parseInt(filters.rokWydania);

    fetchBooks(activeFilters);
  };

  // Resetowanie filtrów
  const handleClearFilters = () => {
    setFilters({
      tytul: '',
      autor: '',
      gatunek: '',
      rokWydania: '',
    });
    fetchBooks();
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

      {/* Formularz filtrowania */}
      <div className='filter-section'>
        <form onSubmit={handleFilter} className='filter-form'>
          <div className='filter-row'>
            <div className='form-group'>
              <label>Tytuł</label>
              <input
                type='text'
                placeholder='Wpisz tytuł...'
                value={filters.tytul}
                onChange={(e) =>
                  setFilters({ ...filters, tytul: e.target.value })
                }
              />
            </div>
            <div className='form-group'>
              <label>Autor</label>
              <input
                type='text'
                placeholder='Wpisz nazwisko autora...'
                value={filters.autor}
                onChange={(e) =>
                  setFilters({ ...filters, autor: e.target.value })
                }
              />
            </div>
            <div className='form-group'>
              <label>Gatunek</label>
              <input
                type='text'
                placeholder='Wpisz gatunek...'
                value={filters.gatunek}
                onChange={(e) =>
                  setFilters({ ...filters, gatunek: e.target.value })
                }
              />
            </div>
            <div className='form-group'>
              <label>Rok wydania</label>
              <input
                type='number'
                placeholder='Rok...'
                value={filters.rokWydania}
                onChange={(e) =>
                  setFilters({ ...filters, rokWydania: e.target.value })
                }
              />
            </div>
          </div>
          <div className='filter-actions'>
            <button type='submit' className='btn btn-primary'>
              🔍︎ Filtruj
            </button>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={handleClearFilters}
            >
              ✕ Wyczyść
            </button>
          </div>
        </form>
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
              <th className='sortable' onClick={() => handleSort('tytul')}>
                Tytuł <span className='sort-arrow'>{getSortIcon('tytul')}</span>
              </th>
              <th className='sortable' onClick={() => handleSort('autor')}>
                Autor <span className='sort-arrow'>{getSortIcon('autor')}</span>
              </th>
              <th className='sortable' onClick={() => handleSort('gatunek')}>
                Gatunek{' '}
                <span className='sort-arrow'>{getSortIcon('gatunek')}</span>
              </th>
              <th className='sortable' onClick={() => handleSort('rokWydania')}>
                Rok Wydania{' '}
                <span className='sort-arrow'>{getSortIcon('rokWydania')}</span>
              </th>
              <th className='sortable' onClick={() => handleSort('isbn')}>
                ISBN <span className='sort-arrow'>{getSortIcon('isbn')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedBooks.map((book) => (
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

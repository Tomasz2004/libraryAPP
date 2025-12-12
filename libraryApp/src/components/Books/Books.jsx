import { useState, useEffect } from 'react';
import './Books.css';

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, []);

  if (loading) return <div className='loading'>Ładowanie książek...</div>;
  if (error) return <div className='error'>Błąd: {error}</div>;

  return (
    <div className='container'>
      <h1>Lista Książek</h1>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
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
              <tr key={book.ksiazkaId}>
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
    </div>
  );
}

export default Books;

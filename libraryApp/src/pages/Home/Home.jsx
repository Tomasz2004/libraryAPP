import './Home.css';

function Home() {
  return (
    <div className='container'>
      <div className='home-content'>
        <h1>Witaj w Systemie Bibliotecznym</h1>
        <p>
          System zarządzania biblioteką umożliwia przeglądanie książek,
          egzemplarzy, wypożyczeń i więcej.
        </p>
        <div className='home-cards'>
          <div className='card'>
            <h2>📚 Książki</h2>
            <p>Przeglądaj katalog książek w bibliotece</p>
          </div>
          <div className='card'>
            <h2>📖 Egzemplarze</h2>
            <p>Sprawdź dostępność egzemplarzy</p>
          </div>
          <div className='card'>
            <h2>👥 Czytelnicy</h2>
            <p>Zarządzaj kontami czytelników</p>
          </div>
          <div className='card'>
            <h2>📋 Wypożyczenia</h2>
            <p>Przeglądaj historię wypożyczeń</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

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
            <p>Przeglądaj i zarządzaj katalogiem książek</p>
          </div>
          <div className='card'>
            <h2>📖 Egzemplarze</h2>
            <p>Zarządzaj egzemplarzami i ich dostępnością</p>
          </div>
          <div className='card'>
            <h2>👥 Czytelnicy</h2>
            <p>Zarządzaj bazą czytelników biblioteki</p>
          </div>
          <div className='card'>
            <h2>📋 Wypożyczenia</h2>
            <p>Kontroluj wypożyczenia i terminy zwrotu</p>
          </div>
          <div className='card'>
            <h2>🏛️ Biblioteki</h2>
            <p>Zarządzaj siecią placówek bibliotecznych</p>
          </div>
          <div className='card'>
            <h2>👔 Pracownicy</h2>
            <p>Zarządzaj personelem bibliotek</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

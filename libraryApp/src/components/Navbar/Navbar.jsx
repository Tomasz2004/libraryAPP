import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className='navbar'>
      <div className='navbar-brand'>
        <Link to='/'>📚 Biblioteka</Link>
      </div>
      <ul className='navbar-menu'>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/ksiazki'>Książki</Link>
        </li>
        <li>
          <Link to='/egzemplarze'>Egzemplarze</Link>
        </li>
        <li>
          <Link to='/czytelnicy'>Czytelnicy</Link>
        </li>
        <li>
          <Link to='/wypozyczenia'>Wypożyczenia</Link>
        </li>
        <li>
          <Link to='/biblioteki'>Biblioteki</Link>
        </li>
        <li>
          <Link to='/pracownicy'>Pracownicy</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

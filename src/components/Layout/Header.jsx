import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>Fasterz</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/reservation" className="nav-link">Réservation</Link>
          <Link to="/account" className="nav-link">Mon Compte</Link>
          <Link to="/history" className="nav-link">Historique</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/login" className="nav-link login-btn">Connexion</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

import { Link, NavLink } from 'react-router-dom';

const Navbar = ({ apiBase, user, onLogout }) => {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <Link to="/" className="navbar__logo">E</Link>
          <Link to="/">
            <div className="navbar__title">Estatery</div>
            <div className="navbar__subtitle">Find your place to live</div>
          </Link>
        </div>

        <nav className="navbar__links" aria-label="Primary">
          <NavLink to="/" className="navbar__link">
            Home
          </NavLink>
          <NavLink to="/auth" className="navbar__link">
            Auth
          </NavLink>
        </nav>

        <div className="navbar__actions">
          <div className="navbar__api-compact">
            <span className="dot ok" aria-hidden />
            <span className="navbar__api-value">{apiBase || 'http://localhost:6543'}</span>
          </div>
          {user ? (
            <>
              <div className="navbar__avatar" aria-label="Profile">
                <span>{user.name?.slice(0, 2).toUpperCase() || 'ME'}</span>
              </div>
              <button className="btn nav-btn" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link className="btn nav-btn" to="/auth">
              Sign in
            </Link>
          )}
          <button className="navbar__menu" aria-label="Open menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

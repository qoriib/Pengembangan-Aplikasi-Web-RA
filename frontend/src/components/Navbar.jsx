import { Link, NavLink } from 'react-router-dom';

const linkBase = 'px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50';

const Navbar = ({ user, onLogout }) => {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="section flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-900 flex-shrink-0">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white">E</span>
          <span>Estatery</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm" aria-label="Primary">
          <NavLink to="/" className={linkBase}>
            Home
          </NavLink>
          {user?.role === 'agent' && (
            <NavLink to="/agent" className={linkBase}>
              Agent
            </NavLink>
          )}
          {user?.role === 'buyer' && (
            <NavLink to="/buyer" className={linkBase}>
              Buyer
            </NavLink>
          )}
          <NavLink to="/compare" className={linkBase}>
            Compare
          </NavLink>
          {user && (
            <NavLink to="/profile" className={linkBase}>
              Profile
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3 flex-shrink-0">
          {user ? (
            <>
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-slate-100 text-sm font-bold text-slate-800" aria-label="Profile">
                {user.name?.slice(0, 2).toUpperCase() || 'ME'}
              </div>
              <button className="btn btn-ghost" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link className="btn btn-primary" to="/auth">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

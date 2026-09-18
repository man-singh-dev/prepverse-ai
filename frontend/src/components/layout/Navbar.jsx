import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Logo from './Logo';
import Button from '../ui/Button';
import { useToast } from '../ui/ToastContext';
import { getSession, mockLogout } from '../../features/auth/mockAuth';

export default function Navbar() {
  const [session, setSession] = useState(() => getSession());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleLogout() {
    await mockLogout();
    setSession(null);
    setMenuOpen(false);
    showToast('You have been signed out.', { type: 'info' });
    navigate('/');
  }

  return (
    <header className="navbar">
      <Logo />

      <nav className={`navbar-links ${mobileOpen ? 'is-open' : ''}`}>
        <Link to="/" className="navbar-link" onClick={() => setMobileOpen(false)}>
          Home
        </Link>
        {session && (
          <Link to="/dashboard" className="navbar-link" onClick={() => setMobileOpen(false)}>
            Dashboard
          </Link>
        )}

        <div className="navbar-actions navbar-actions-mobile">
          {session ? (
            <Button variant="secondary" size="sm" fullWidth onClick={handleLogout}>
              Log out
            </Button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" fullWidth>
                  Log in
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" size="sm" fullWidth>
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="navbar-actions">
        {session ? (
          <div className="dropdown">
            <button
              type="button"
              className="navbar-user"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span className="navbar-user-avatar">{session.name.charAt(0).toUpperCase()}</span>
              <span>{session.name}</span>
            </button>
            {menuOpen && (
              <div className="dropdown-menu" role="menu">
                <Link to="/dashboard" className="dropdown-item" role="menuitem" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <div className="dropdown-divider" />
                <button type="button" className="dropdown-item" role="menuitem" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Sign up
              </Button>
            </Link>
          </>
        )}
      </div>

      <button
        type="button"
        className="navbar-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((v) => !v)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </header>
  );
}

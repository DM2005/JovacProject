import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import '../styles.css';

export default function Nav() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <header className="nav">
      <div className="container nav-inner space-between">
        <div className="row" style={{ gap: 16 }}>
          <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 20, height: 28, borderRadius: 6,
              background: 'linear-gradient(180deg, #6c9eff, #7ef6d6)'
            }} />
            <span>Rephome</span>
          </div>
        </div>
        <nav className="row" style={{ gap: 18 }}>
          <Link className={pathname === '/' ? 'active' : ''} to="/#home">Home</Link>
          <Link to="/#services">Services</Link>
          <Link to="/#how-it-works">How It Works</Link>
          <Link to="/#contact">Contact</Link>
        </nav>
        <div className="row" style={{ gap: 8 }}>
          <a className="btn btn-primary" href="tel:+919876543210" style={{ borderRadius: 999 }}>📞 Call Now</a>
          {user ? (
            <button className="btn btn-ghost" onClick={logout}>Logout</button>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">Login</Link>
              <Link className="btn btn-primary" to="/register">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}



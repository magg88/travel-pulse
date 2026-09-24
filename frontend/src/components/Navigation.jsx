import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation({ user, onLogout }) {
  const location = useLocation();
  const p = location.pathname;

  return (
    <header className="navbar">
      <Link to="/" className="nav-brand">📌 TravelPulse</Link>

      {user && (
        <div className="nav-menu">
          <Link to="/" className={`nav-item ${p === '/' ? 'active' : ''}`}>Почетна</Link>
          <Link to="/trips" className={`nav-item ${p === '/trips' ? 'active' : ''}`}>Мои Патувања</Link>
          <Link to="/add-trip" className={`nav-item ${p === '/add-trip' ? 'active' : ''}`}>Додади Патување</Link>
          <Link to="/search" className={`nav-item ${p === '/search' ? 'active' : ''}`}>Пребарај Атракции</Link>
          <Link to="/weather-currency" className={`nav-item ${p === '/weather-currency' ? 'active' : ''}`}>Време и Буџет</Link>
          <a href="/api/docs/" target="_blank" rel="noreferrer" className="nav-item">Swagger API</a>
        </div>
      )}

      <div className="user-badge">
        {user ? (
          <>
            <span className="user-pill">
              👤 {user.name || user.email} ({user.role || 'user'})
            </span>
            <button className="logout-pill" onClick={onLogout}>Одјави се</button>
          </>
        ) : (
          <Link to="/login" className="login-pill">Најави се</Link>
        )}
      </div>
    </header>
  );
}

export default Navigation;
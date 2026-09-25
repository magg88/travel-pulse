import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navigation({ user, onLogout }) {
  const navigate = useNavigate();

  const role = user?.role || 'user';

  return (
    <nav style={{ 
      background: '#1e293b', 
      padding: '15px 30px', 
      color: 'white', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        <h2 style={{ margin: 0, color: '#38bdf8', cursor: 'pointer' }} onClick={() => navigate('/')}>
          ✈️ TravelPulse
        </h2>
        
        {user && (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Почетна</Link>
            <Link to="/trips" style={{ color: 'white', textDecoration: 'none' }}>Мои патувања</Link>
            <Link to="/search" style={{ color: 'white', textDecoration: 'none' }}>Пребарај Атракции</Link>
            <Link to="/weather-currency" style={{ color: 'white', textDecoration: 'none' }}>Време & Буџет</Link>

            {(role === 'user' || role === 'admin') && (
              <Link to="/add-trip" style={{ 
                color: '#4ade80', 
                fontWeight: 'bold', 
                textDecoration: 'none',
                backgroundColor: 'rgba(74, 222, 128, 0.1)',
                padding: '5px 10px',
                borderRadius: '5px'
              }}>
                ➕ Додај патување
              </Link>
            )}

            {role === 'admin' && (
              <span style={{ 
                backgroundColor: '#ef4444', 
                color: 'white',
                padding: '4px 10px', 
                borderRadius: '12px', 
                fontSize: '12px', 
                fontWeight: 'bold' 
              }}>
                🛡️ АДМИН ПАНЕЛ
              </span>
            )}
          </div>
        )}
      </div>

      <div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>
              Здраво, <b>{user.username || user.name || user.email}</b> 
              <span style={{ 
                marginLeft: '8px', 
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                backgroundColor: role === 'admin' ? '#ef4444' : role === 'user' ? '#2563eb' : '#64748b'
              }}>
                {role === 'admin' ? ' Админ' : role === 'user' ? ' Корисник' : ' Гостин'}
              </span>
            </span>
            <button 
              onClick={onLogout} 
              style={{ 
                background: '#dc2626', 
                color: 'white', 
                border: 'none', 
                padding: '6px 12px', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Одјави се
            </button>
          </div>
        ) : (
          <Link to="/login" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>Најави се</Link>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
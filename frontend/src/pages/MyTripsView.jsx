import React from 'react';
import { Link } from 'react-router-dom';

function MyTripsView({ trips }) {
  return (
    <div className="container">
      <div className="page-title-row">
        <h1 className="page-title"> Мои Патувања ({trips.length})</h1>
        <Link to="/add-trip" className="btn-submit-green" style={{ textDecoration: 'none', padding: '10px 20px' }}>
          ➕ Додади Ново Патување
        </Link>
      </div>

      <div className="cards-grid" style={{ marginTop: '30px' }}>
        {trips.map((trip) => {
          const totalBudget = (trip.budget.accommodation || 0) + (trip.budget.food || 0) + (trip.budget.transport || 0) + (trip.budget.attractions || 0);
          return (
            <div key={trip.id} className="card" style={{ cursor: 'default' }}>
              <img src={trip.img} alt={trip.title} className="card-img" />
              <div className="card-body" style={{ textAlign: 'left' }}>
                <h3 className="card-title">{trip.title}</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>📍 {trip.location}</div>
                <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '8px' }}>🗓️ <strong>Период:</strong> {trip.dates}</div>
                <div style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: 'bold' }}>💶 Вкупен Буџет: €{totalBudget}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyTripsView;
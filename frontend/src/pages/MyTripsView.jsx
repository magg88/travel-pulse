import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MyTripsView({ trips: initialTrips }) {
  const [trips, setTrips] = useState(initialTrips || []);
  const [loading, setLoading] = useState(true);

  // ✅ Штом се вчита/освежи страницата, повлечи ги патувањата од базата
  useEffect(() => {
    const loadTrips = async () => {
      try {
        const response = await fetch('/api/trips');
        if (response.ok) {
          const data = await response.json();
          setTrips(data);
        } else {
          // Ако нема бекенд рута, вчитај од localStorage
          const localData = localStorage.getItem('myTrips');
          if (localData) setTrips(JSON.parse(localData));
        }
      } catch (err) {
        console.warn('Вчитувам од localStore бидејќи API-то не е достапно:', err);
        const localData = localStorage.getItem('myTrips');
        if (localData) setTrips(JSON.parse(localData));
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h3>Се вчитаваат вашите патувања...</h3>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-title-row">
        <h1 className="page-title">Мои Патувања ({trips.length})</h1>
        <Link to="/add-trip" className="btn-submit-green" style={{ textDecoration: 'none', padding: '10px 20px' }}>
          ➕ Додади Ново Патување
        </Link>
      </div>

      <div className="cards-grid" style={{ marginTop: '30px' }}>
        {trips.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b', marginTop: '20px' }}>
            Сеуште немате додадено патувања. Кликнете на „Додади Ново Патување“ за да започнете!
          </div>
        ) : (
          trips.map((trip) => {
            // ✅ Сигурна пресметка на буџетот (без разлика дали е бројка или објект)
            let totalBudget = 0;
            if (typeof trip.budget === 'number') {
              totalBudget = trip.budget;
            } else if (typeof trip.budget === 'object' && trip.budget !== null) {
              totalBudget = (trip.budget.accommodation || 0) + 
                            (trip.budget.food || 0) + 
                            (trip.budget.transport || 0) + 
                            (trip.budget.attractions || 0);
            }

            // ✅ Форматирање на датумите ако се зачувани како startDate/endDate
            let datesDisplay = trip.dates;
            if (!datesDisplay && trip.startDate && trip.endDate) {
              const start = new Date(trip.startDate).toLocaleDateString('mk-MK');
              const end = new Date(trip.endDate).toLocaleDateString('mk-MK');
              datesDisplay = `${start} - ${end}`;
            }

            return (
              <div key={trip._id || trip.id || Math.random()} className="card" style={{ cursor: 'default' }}>
                <img 
                  src={trip.img || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'} 
                  alt={trip.title} 
                  className="card-img" 
                />
                <div className="card-body" style={{ textAlign: 'left' }}>
                  <h3 className="card-title">{trip.title}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>
                    📍 {trip.location || trip.destination || 'Непозната локација'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '8px' }}>
                    🗓️ <strong>Период:</strong> {datesDisplay || 'Не е дефиниран'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: 'bold' }}>
                    💶 Вкупен Буџет: €{totalBudget}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyTripsView;
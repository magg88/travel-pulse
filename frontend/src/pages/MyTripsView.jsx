import React from 'react';
import { useNavigate } from 'react-router-dom';

function MyTripsView({ trips }) {
  const navigate = useNavigate();

  // Читање на најавениот корисник и неговата улога од localStorage
  const savedUser = localStorage.getItem('user');
  const user = savedUser ? JSON.parse(savedUser) : null;
  const role = user?.role || 'viewer';
  const isGuest = role === 'viewer';

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
      
      {/* 👁️ Порака за Гостин кога е најавен како Viewer */}
      {isGuest && (
        <div style={{ 
          backgroundColor: '#fef3c7', 
          color: '#92400e', 
          padding: '15px 20px', 
          borderRadius: '8px', 
          marginBottom: '25px',
          borderLeft: '5px solid #f59e0b',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <strong>👁️ Најавени сте како ГОСТИН (Viewer):</strong> Можете да ги разгледувате сите патувања, но ја немате опцијата за додавање или креирање нови патувања.
        </div>
      )}

      {/* Заглавие и Копче за Додавање */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2>🧳 Мои Патувања</h2>
        
        {/* Доколку НЕ Е гостин (корисник или админ), прикажи го копчето за додавање */}
        {!isGuest && (
          <button 
            onClick={() => navigate('/add-trip')}
            style={{ 
              backgroundColor: '#2563eb', 
              color: 'white', 
              border: 'none', 
              padding: '10px 18px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ➕ Додај Ново Патување
          </button>
        )}
      </div>

      {/* Приказ на патувањата во картички */}
      {!trips || trips.length === 0 ? (
        <p style={{ color: '#64748b' }}>Сè уште немате додадено патувања.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {trips.map((trip) => (
            <div 
              key={trip.id || trip._id} 
              style={{ 
                border: '1px solid #e2e8f0', 
                borderRadius: '10px', 
                overflow: 'hidden', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                backgroundColor: 'white'
              }}
            >
              {trip.img && (
                <img 
                  src={trip.img} 
                  alt={trip.title} 
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
                />
              )}
              
              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>{trip.title}</h3>
                <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '0.9rem' }}>
                  📍 {trip.location || trip.destination}
                </p>
                <p style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: '0.85rem' }}>
                  📅 {trip.dates || `${trip.startDate ? new Date(trip.startDate).toLocaleDateString() : ''} - ${trip.endDate ? new Date(trip.endDate).toLocaleDateString() : ''}`}
                </p>

                {/* Детал за Буџет */}
                {trip.budget && (
                  <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <strong>Буџет:</strong> {typeof trip.budget === 'number' ? `${trip.budget} EUR` : `${(trip.budget.accommodation || 0) + (trip.budget.food || 0) + (trip.budget.transport || 0) + (trip.budget.attractions || 0)} EUR`}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTripsView;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AddTripView({ trips, setTrips, setSelectedTripId }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // Буџет по категории
  const [accommodation, setAccommodation] = useState(300);
  const [food, setFood] = useState(200);
  const [transport, setTransport] = useState(150);
  const [attractions, setAttractions] = useState(100);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveTrip = (e) => {
    e.preventDefault();
    if (!title || !location) return;

    const newTrip = {
      id: Date.now(),
      title,
      location,
      dates: dateFrom && dateTo ? `${dateFrom} - ${dateTo}` : 'Недефинирано',
      img: imagePreview || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
      budget: {
        accommodation: Number(accommodation) || 0,
        food: Number(food) || 0,
        transport: Number(transport) || 0,
        attractions: Number(attractions) || 0
      }
    };

    setTrips([newTrip, ...trips]);
    setSelectedTripId(newTrip.id);
    navigate('/weather-currency');
  };

  const totalCalculated = (Number(accommodation) || 0) + (Number(food) || 0) + (Number(transport) || 0) + (Number(attractions) || 0);

  return (
    <>
      <div className="hero-banner">
        <h1>Додади Ново Патување</h1>
        <p>Внесете ги деталите за патувањето и планирајте го буџетот по категории</p>
      </div>

      <div className="form-card" style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSaveTrip}>
          <div className="form-group">
            <label>Наслов на патувањето</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="напр. Летување во Грција"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Дестинација</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="напр. Атина, Грција" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Датум од</label>
              <input type="date" className="form-control" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Датум до</label>
              <input type="date" className="form-control" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Прикачи слика од уред 📸</label>
            <input type="file" accept="image/*" className="form-control" onChange={handleImageUpload} />
          </div>

          {imagePreview && (
            <div style={{ marginBottom: '15px', textAlign: 'center' }}>
              <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '10px' }} />
            </div>
          )}

          {/* СЕКЦИЈА ЗА БУЏЕТ ПО КАТЕГОРИИ */}
          <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', margin: '20px 0' }}>
            <h4 style={{ color: '#1e1b4b', marginBottom: '12px' }}>📊 Планирање на Буџет по Категории (€)</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label>🏨 Сместување (€)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={accommodation} 
                  onChange={(e) => setAccommodation(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>🍕 Храна (€)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={food} 
                  onChange={(e) => setFood(e.target.value)} 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>✈️ Транспорт (€)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={transport} 
                  onChange={(e) => setTransport(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>🎟️ Атракции (€)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={attractions} 
                  onChange={(e) => setAttractions(e.target.value)} 
                />
              </div>
            </div>

            <div style={{ marginTop: '10px', fontWeight: 'bold', color: '#16a34a', fontSize: '1rem', textAlign: 'right' }}>
              Вкупен Буџет: €{totalCalculated}
            </div>
          </div>

          <div className="form-actions">
            <Link to="/trips" className="btn-cancel">Откажи</Link>
            <button type="submit" className="btn-submit-green">Зачувај и Прикажи График</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddTripView;
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

  const totalCalculated = (Number(accommodation) || 0) + (Number(food) || 0) + (Number(transport) || 0) + (Number(attractions) || 0);

  const handleSaveTrip = async (e) => {
    e.preventDefault();
    if (!title || !location) return;

    // Подготовка на објектот за патување
    const newTrip = {
      title,
      destination: location,
      location,
      startDate: dateFrom || new Date().toISOString(),
      endDate: dateTo || new Date().toISOString(),
      dates: dateFrom && dateTo ? `${dateFrom} - ${dateTo}` : 'Недефинирано',
      img: imagePreview || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
      budget: {
        accommodation: Number(accommodation) || 0,
        food: Number(food) || 0,
        transport: Number(transport) || 0,
        attractions: Number(attractions) || 0
      }
    };

    let savedTrip = { ...newTrip, id: Date.now() };

    try {
      // 1. Испрати во MongoDB преку бекенд рутата
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTrip.title,
          destination: newTrip.destination,
          startDate: newTrip.startDate,
          endDate: newTrip.endDate,
          budget: totalCalculated
        })
      });

      if (response.ok) {
        const data = await response.json();
        savedTrip = { ...newTrip, ...data };
      }
    } catch (err) {
      console.warn('Нема врска со базата, зачувувам локално:', err);
    }

    // 2. Ажурирај ги состојбите во React и LocalStorage (заштита при рефреш)
    const updatedTrips = [savedTrip, ...trips];
    setTrips(updatedTrips);
    localStorage.setItem('myTrips', JSON.stringify(updatedTrips));

    // 3. Постави го избраното патување и навигирај
    if (setSelectedTripId) {
      setSelectedTripId(savedTrip._id || savedTrip.id);
    }
    navigate('/my-trips');
  };

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
            <Link to="/my-trips" className="btn-cancel">Откажи</Link>
            <button type="submit" className="btn-submit-green">Зачувај Патување</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddTripView;
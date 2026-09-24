import React, { useState, useEffect } from 'react';
import { searchAttractions } from '../api';

function SearchAttractionsView() {
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('Сите категории');
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Функција за пребарување атракции од MongoDB
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const selectedCategory = category === 'Сите категории' ? '' : category;
      const response = await searchAttractions(city, selectedCategory);
      setAttractions(response.data || []);
    } catch (err) {
      console.error('Грешка при влечење на атракции:', err);
    } finally {
      setLoading(false);
    }
  };

  // Првично вчитај ги сите атракции од базата
  useEffect(() => {
    handleSearch();
  }, []);

  // Помошна функција за класа за боја на категоријата
  const getCategoryBg = (cat) => {
    if (!cat) return 'bg-yellow';
    const lower = cat.toLowerCase();
    if (lower.includes('музеј')) return 'bg-yellow';
    if (lower.includes('историја')) return 'bg-red';
    if (lower.includes('природа')) return 'bg-green';
    return 'bg-yellow';
  };

  return (
    <>
      <div className="hero-banner">
        <h1>🔍 Пребарај атракции и локации</h1>
        <p>Пронајдете ги најдобрите туристички места за вашата следна дестинација</p>
      </div>

      <div className="container">
        <form onSubmit={handleSearch} className="search-bar-card">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Град / Дестинација</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="пр. Рим, Париз, Барселона..." 
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Категорија</label>
            <select 
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Сите категории">Сите категории</option>
              <option value="Музеј">Музеј</option>
              <option value="Историја">Историја</option>
              <option value="Природа">Природа</option>
            </select>
          </div>

          <button type="submit" className="btn-search-blue">
            {loading ? 'Се пребарува...' : 'Пребарај'}
          </button>
        </form>

        <div className="cards-grid">
          {attractions.length === 0 && !loading ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px', color: '#64748b' }}>
              Не се пронајдени атракции за избраните критериуми.
            </p>
          ) : (
            attractions.map((item) => (
              <div key={item._id || item.id} className="card" style={{ cursor: 'default' }}>
                <div className="card-body" style={{ textAlign: 'left' }}>
                  <span className={`category-badge ${getCategoryBg(item.category)}`}>
                    {item.category || 'Атракција'}
                  </span>
                  <h3 className="card-title">{item.name || item.title}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '10px' }}>
                    {item.city || item.location}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', flex: 1 }}>
                    {item.description || item.desc}
                  </p>
                  <div className="price-text">
                    Цена: {item.details || item.price || 'Бесплатно'}
                  </div>
                  <button className="btn-outline-itinerary">+ Додади во итинерар</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default SearchAttractionsView;
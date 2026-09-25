import React, { useState, useEffect } from 'react';
import { fetchAttractions } from '../api';

function SearchAttractionsView() {
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('Сите категории');
  const [allAttractions, setAllAttractions] = useState([]);
  const [displayedAttractions, setDisplayedAttractions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Почетно вчитување на сите атракции
  const loadAttractions = async () => {
    setLoading(true);
    try {
      const response = await fetchAttractions();
      
      const rawData = response.data || response;
      let items = [];
      if (Array.isArray(rawData)) {
        items = rawData;
      } else if (rawData.data && Array.isArray(rawData.data)) {
        items = rawData.data;
      } else if (rawData.attractions && Array.isArray(rawData.attractions)) {
        items = rawData.attractions;
      }

      setAllAttractions(items);
      setDisplayedAttractions(items);
    } catch (err) {
      console.error('Грешка при влечење на атракции:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttractions();
  }, []);

  // 2. Функција за филтрирање
  const applyFilters = (searchCity, searchCategory, dataList = allAttractions) => {
    let filtered = [...dataList];

    // Филтер за град / дестинација
    if (searchCity && searchCity.trim() !== '') {
      const query = searchCity.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const c = (item.city || '').toLowerCase();
        const l = (item.location || '').toLowerCase();
        const n = (item.name || item.title || '').toLowerCase();
        return c.includes(query) || l.includes(query) || n.includes(query);
      });
    }

    // Филтер за категорија
    if (searchCategory && searchCategory !== 'Сите категории') {
      const queryCat = searchCategory.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const cat = (item.category || '').toLowerCase().trim();
        return cat.includes(queryCat);
      });
    }

    setDisplayedAttractions(filtered);
  };

  // Промена во полето за град
  const handleCityChange = (e) => {
    const val = e.target.value;
    setCity(val);
    applyFilters(val, category);
  };

  // Промена во паѓачкото мени за категорија
  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val);
    applyFilters(city, val);
  };

  // При клик на копчето „Пребарај“
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    applyFilters(city, category);
  };

  const getCategoryBg = (cat) => {
    if (!cat) return 'bg-yellow';
    const lower = cat.toLowerCase();
    if (lower.includes('природа')) return 'bg-green';
    if (lower.includes('авантура')) return 'bg-yellow';
    if (lower.includes('историја')) return 'bg-red';
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
              placeholder="пр. Рим, Скопје..." 
              value={city}
              onChange={handleCityChange}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Категорија</label>
            <select 
              className="form-control"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="Сите категории">Сите категории</option>
              <option value="Природа">Природа</option>
              <option value="Авантура">Авантура</option>
              <option value="Историја">Историја</option>
            </select>
          </div>

          <button type="submit" className="btn-search-blue">
            {loading ? 'Се вчитува...' : 'Пребарај'}
          </button>
        </form>

        <div className="cards-grid">
          {displayedAttractions.length === 0 && !loading ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px', color: '#64748b' }}>
              Не се пронајдени атракции за избраните критериуми.
            </p>
          ) : (
            displayedAttractions.map((item) => {
              const numPrice = Number(item.price);
              const isValidNumber = !isNaN(numPrice) && numPrice > 0;

              let priceDisplay = 'Бесплатно';
              if (isValidNumber) {
                priceDisplay = `${numPrice} ${item.currency || 'EUR'}`;
              }

              return (
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
                      Цена: {priceDisplay}
                    </div>

                    {item.details && (
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', marginBottom: '8px' }}>
                        {item.details}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default SearchAttractionsView;
import React, { useState, useEffect } from 'react';

function WeatherCurrencyView({ trips, selectedTripId, setSelectedTripId }) {
  const selectedTrip = trips.find(t => t.id === Number(selectedTripId)) || trips[0];

  // --- 1. ВРЕМЕНСКА ПРОГНОЗА ВО ЖИВО ---
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState('');

  const rawCity = selectedTrip ? selectedTrip.location.split(',')[0].trim() : '';

  useEffect(() => {
    if (!rawCity) return;

    const fetchLiveWeather = async () => {
      setLoadingWeather(true);
      setWeatherError('');

      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(rawCity)}&count=1&language=en&format=json`
        );
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
          setWeatherError(`Не беа пронајдени податоци за градот: ${rawCity}`);
          setLoadingWeather(false);
          return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
        );
        const weatherData = await weatherRes.json();

        if (weatherData.current_weather) {
          setWeather({
            cityName: `${name}${country ? `, ${country}` : ''}`,
            temp: Math.round(weatherData.current_weather.temperature),
            windspeed: weatherData.current_weather.windspeed,
            weathercode: weatherData.current_weather.weathercode,
            dailyMax: weatherData.daily ? Math.round(weatherData.daily.temperature_2m_max[0]) : null,
            dailyMin: weatherData.daily ? Math.round(weatherData.daily.temperature_2m_min[0]) : null,
          });
        }
      } catch (err) {
        console.error('Грешка со времето:', err);
        setWeatherError('Грешка при поврзување со метеоролошкиот сервис.');
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchLiveWeather();
  }, [rawCity]);

  const getWeatherDescription = (code) => {
    if (code === 0) return { text: 'Сончево и ведро', icon: '☀️' };
    if (code >= 1 && code <= 3) return { text: 'Делумно облачно', icon: '⛅' };
    if (code >= 45 && code <= 48) return { text: 'Магливо', icon: '🌫️' };
    if (code >= 51 && code <= 67) return { text: 'Врнежи од дожд', icon: '🌧️' };
    if (code >= 71 && code <= 77) return { text: 'Снежни врнежи', icon: '❄️' };
    if (code >= 80 && code <= 82) return { text: 'Силен дожд', icon: '🌧️' };
    if (code >= 95) return { text: 'Грмотевици', icon: '🌩️' };
    return { text: 'Променливо', icon: '🌡️' };
  };

  const weatherDetails = weather ? getWeatherDescription(weather.weathercode) : null;

  // --- 2. ЛОГИКА ЗА БУЏЕТ И КРУЖЕН ГРАФИК ---
  const budget = selectedTrip?.budget || { accommodation: 0, food: 0, transport: 0, attractions: 0 };
  const totalBudget = (budget.accommodation || 0) + (budget.food || 0) + (budget.transport || 0) + (budget.attractions || 0);

  const getPercent = (amount) => (totalBudget > 0 ? Math.round((amount / totalBudget) * 100) : 0);

  const accPct = getPercent(budget.accommodation);
  const foodPct = getPercent(budget.food);
  const transPct = getPercent(budget.transport);
  const attrPct = getPercent(budget.attractions);

  const p1 = accPct;
  const p2 = p1 + foodPct;
  const p3 = p2 + transPct;

  const donutGradient = totalBudget > 0
    ? `conic-gradient(
        #4f46e5 0% ${p1}%,
        #f59e0b ${p1}% ${p2}%,
        #06b6d4 ${p2}% ${p3}%,
        #10b981 ${p3}% 100%
      )`
    : '#e2e8f0';

  return (
    <div className="container" style={{ marginTop: '30px', marginBottom: '50px' }}>
      {/* Избор на Патување */}
      <div className="form-card" style={{ marginBottom: '30px', maxWidth: '600px', padding: '20px' }}>
        <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
          📌 Избери патување:
        </label>
        <select
          className="form-control"
          value={selectedTripId}
          onChange={(e) => setSelectedTripId(Number(e.target.value))}
        >
          {trips.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title} ({t.location})
            </option>
          ))}
        </select>
      </div>

      {/* Мрежа за картички */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
        
        {/* КАРТИЧКА 1: ВРЕМЕНСКА ПРОГНОЗА */}
        <div className="card" style={{ padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', backgroundColor: '#ffffff' }}>
          <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>
            🌤️ Време во живо ({selectedTrip?.location})
          </h3>

          {loadingWeather && (
            <p style={{ color: '#4f46e5', fontWeight: 'bold' }}>⏳ Се вчитува прогнозата...</p>
          )}

          {weatherError && (
            <p style={{ color: '#dc2626', fontWeight: 'bold' }}>⚠️ {weatherError}</p>
          )}

          {!loadingWeather && weather && (
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span>{weatherDetails.icon}</span>
                <span>{weather.temp}°C</span>
              </div>

              <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#475569', marginTop: '8px' }}>
                {weatherDetails.text}
              </p>

              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.9rem' }}>
                <div><strong>Макс/Мин:</strong> {weather.dailyMax}°C / {weather.dailyMin}°C</div>
                <div><strong>Ветер:</strong> {weather.windspeed} km/h</div>
              </div>
            </div>
          )}
        </div>

        {/* КАРТИЧКА 2: КРУЖЕН ГРАФИК ЗА БУЏЕТ */}
        <div className="card" style={{ padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', backgroundColor: '#ffffff' }}>
          <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>📊 Буџет за патувањето</h3>

          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', gap: '20px' }}>
            
            {/* Кружен График (Donut Chart) */}
            <div style={{
              width: '170px',
              height: '170px',
              borderRadius: '50%',
              background: donutGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '105px',
                height: '105px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Вкупно</span>
                <strong style={{ fontSize: '1.15rem', color: '#10b981' }}>{totalBudget} €</strong>
              </div>
            </div>

            {/* Легенда */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '150px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                <span style={{ width: '12px', height: '12px', backgroundColor: '#4f46e5', borderRadius: '3px', display: 'inline-block' }}></span>
                <span>🏨 Сместување: <strong>{budget.accommodation}€ ({accPct}%)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                <span style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '3px', display: 'inline-block' }}></span>
                <span>🍕 Храна: <strong>{budget.food}€ ({foodPct}%)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                <span style={{ width: '12px', height: '12px', backgroundColor: '#06b6d4', borderRadius: '3px', display: 'inline-block' }}></span>
                <span>🚗 Транспорт: <strong>{budget.transport}€ ({transPct}%)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                <span style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '3px', display: 'inline-block' }}></span>
                <span>🎟️ Атракции: <strong>{budget.attractions}€ ({attrPct}%)</strong></span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default WeatherCurrencyView;
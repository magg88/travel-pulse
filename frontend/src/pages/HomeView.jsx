import React, { useState } from 'react';

function HomeView() {
  const [selectedDestination, setSelectedDestination] = useState(null);

  const destinations = [
    {
      id: 1,
      title: 'Рим, Италија',
      cityName: 'Рим',
      badge: 'Препорачано',
      badgeClass: 'badge-blue',
      img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
      shortDesc: 'Вечниот град нуди незаборавно патување низ историјата...',
      fullDesc: 'Вечниот град нуди незаборавно патување низ историјата, од Колисеумот до Ватиканските музеи.',
      topAttractions: 'Колисеум, Фонтана ди Треви, Пантеон, Ватикан.',
      bestTime: 'Април - Мај и Септември - Октомври.',
      recommendation: 'Пробајте автентична Carbonara и gelato.'
    },
    {
      id: 2,
      title: 'Париз, Франција',
      cityName: 'Париз',
      badge: 'Популарно',
      badgeClass: 'badge-purple',
      img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      shortDesc: 'Град на светлината, уметноста, модата и романтиката...',
      fullDesc: 'Град на светлината, уметноста, модата и романтиката, познат по Ајфеловата кула и Лувр.',
      topAttractions: 'Ајфелова кула, Музеј Лувр, Триумфална капија, Монмартр.',
      bestTime: 'Мај - Септември.',
      recommendation: 'Пробајте свежи кроасани во локална пекара.'
    },
    {
      id: 3,
      title: 'Атина, Грција',
      cityName: 'Атина',
      badge: 'Топ избор',
      badgeClass: 'badge-cyan',
      img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800',
      shortDesc: 'Колепка на западната цивилизација со богата историја...',
      fullDesc: 'Колепка на западната цивилизација со богата историја и антички споменици.',
      topAttractions: 'Акропол, Партенон, Плака, Музеј на Акропол.',
      bestTime: 'Мај - Јуни и Септември - Октомври.',
      recommendation: 'Уживајте во традиционално сувлаки и фрапе.'
    },
    {
      id: 4,
      title: 'Мадрид, Шпанија',
      cityName: 'Мадрид',
      badge: 'Атрактивно',
      badgeClass: 'badge-blue',
      img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800',
      shortDesc: 'Живописен град со прекрасна архитектура...',
      fullDesc: 'Живописен град со прекрасна архитектура, прекрасни паркови и богата уметност.',
      topAttractions: 'Кралска палата, Прадо музеј, Парк Ретиро, Плаза Мајор.',
      bestTime: 'Септември - Ноември и Март - Мај.',
      recommendation: 'Пробајте шпански тапас и чурос со чоколадо.'
    }
  ];

  return (
    <>
      <div className="hero-banner">
        <h1>Планирај ги твоите незаборавни авантури 🌸</h1>
        <p>Истражувај топ атракции, организирај сопствени патувања и следи го твојот буџет со TravelPulse.</p>
      </div>

      <div className="container">
        <h2 className="page-title" style={{ marginBottom: '20px' }}>
          🌸 Популарни Предлог Дестинации <span className="sub-text">(Кликнете на картичка за детали)</span>
        </h2>

        <div className="cards-grid">
          {destinations.map((item) => (
            <div key={item.id} className="card" onClick={() => setSelectedDestination(item)}>
              <img src={item.img} alt={item.title} className="card-img" />
              <div className="card-body">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-desc">{item.shortDesc}</p>
                <span className={`badge-tag ${item.badgeClass}`}>{item.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedDestination && (
        <div className="modal-overlay" onClick={() => setSelectedDestination(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedDestination.title}</h2>
              <button className="btn-close-x" onClick={() => setSelectedDestination(null)}>✕</button>
            </div>

            <img src={selectedDestination.img} alt={selectedDestination.title} className="modal-hero-img" />

            <div className="modal-tags">
              <span className="modal-tag-main">{selectedDestination.badge}</span>
              <span className="modal-tag-sub">{selectedDestination.cityName}</span>
            </div>

            <div className="modal-section-title">Опис:</div>
            <p className="modal-desc-text">{selectedDestination.fullDesc}</p>

            <div className="modal-tips-box">
              <div className="modal-tips-title">💡 Клучни информации и совети:</div>
              <div className="modal-tip-item">
                🏛️ <strong>Топ атракции:</strong> {selectedDestination.topAttractions}
              </div>
              <div className="modal-tip-item">
                🎨 <strong>Најдобро време за посета:</strong> {selectedDestination.bestTime}
              </div>
              <div className="modal-tip-item">
                🍕 <strong>Препорака:</strong> {selectedDestination.recommendation}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-modal-close" onClick={() => setSelectedDestination(null)}>
                Затвори
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HomeView;
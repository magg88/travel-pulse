const API_BASE = 'http://localhost:3000/api';

let currentAttractionsList = [];

const DEFAULT_ATTRACTIONS = [
    {
        id: '1',
        name: 'Рим, Италија',
        city: 'Рим',
        description: 'Вечниот град нуди незаборавно патување низ историјата, од Колисеумот до Ватиканските музеи.',
        details: '🏛️ <strong>Топ атракции:</strong> Колисеум, Фонтана ди Треви, Пантеон, Ватикан.<br>☀️ <strong>Најдобро време за посета:</strong> Април - Мај и Септември - Октомври.<br>🍕 <strong>Препорака:</strong> Пробајте автентична Carbonara и gelato во дистриктот Трастевере.',
        category: 'Препорачано',
        imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600'
    },
    {
        id: '2',
        name: 'Париз, Франција',
        city: 'Париз',
        description: 'Град на светлината, уметноста, модата и романтиката со светски познати знаменитости.',
        details: '🗼 <strong>Топ атракции:</strong> Ајфелова кула, Лувр, Нотр Дам, Монмартр.<br>🎨 <strong>Култура:</strong> Музејот Лувр е дом на Мона Лиза.<br>🥐 <strong>Препорака:</strong> Уживајте во свеж кроасан покрај реката Сена.',
        category: 'Популарно',
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600'
    },
    {
        id: '3',
        name: 'Атина, Грција',
        city: 'Атина',
        description: 'Колепка на западната цивилизација со богата античка историја и современа живописна атмосфера.',
        details: '🏛️ <strong>Топ атракции:</strong> Акропол, Партенон, Плака, Музеј на Акропол.<br>🌊 <strong>Близина до море:</strong> Одлични плажи на само 30 минути од центарот.<br>🥙 <strong>Препорака:</strong> Вкусете традиционален сувлаки во Плака.',
        category: 'Топ избор',
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600'
    },
    {
        id: '4',
        name: 'Мадрид, Шпанија',
        city: 'Мадрид',
        description: 'Живописен град со прекрасна архитектура, кралски палати и богата уметничка сцена.',
        details: '👑 <strong>Топ атракции:</strong> Кралска Палата, Прадо Музеј, Парк Ретиро, Плаза Мајор.<br>💃 <strong>Култура:</strong> Доживејте традиционално Фламенко шоу.<br>🥘 <strong>Препорака:</strong> Уживајте во тапас на пазарот Сан Мигел.',
        category: 'Атрактивно',
        imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600'
    }
];

function setToken(token, user) {
    localStorage.setItem('tp_token', token);
    localStorage.setItem('tp_user', JSON.stringify(user));
}

function getToken() {
    return localStorage.getItem('tp_token');
}

function getUser() {
    const user = localStorage.getItem('tp_user');
    return user ? JSON.parse(user) : null;
}

function logout() {
    localStorage.removeItem('tp_token');
    localStorage.removeItem('tp_user');
    window.location.href = 'login-register.html';
}

function renderNavbar() {
    const user = getUser();
    const navList = document.getElementById('main-nav') || document.querySelector('.navbar-nav');
    const userInfoEl = document.getElementById('user-info');
    const currentPath = window.location.pathname;

    if (navList) {
        if (user) {
            navList.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link ${currentPath.includes('index.html') || currentPath.endsWith('/') ? 'active' : ''}" href="index.html">Почетна</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${currentPath.includes('trips-list.html') ? 'active' : ''}" href="trips-list.html">Мои Патувања</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${currentPath.includes('add-trip.html') ? 'active' : ''}" href="add-trip.html">Додади Патување</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${currentPath.includes('search-attractions.html') ? 'active' : ''}" href="search-attractions.html">Пребарај Атракции</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${currentPath.includes('destination-weather.html') ? 'active' : ''}" href="destination-weather.html">Време и Валути</a>
                </li>
            `;
        } else {
            navList.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link active" href="login-register.html">🔑 Најава / Регистрација</a>
                </li>
            `;
        }
    }

    if (userInfoEl) {
        if (user) {
            userInfoEl.innerHTML = `<span class="me-2 text-white">👤 <strong>${user.username}</strong> (${user.role})</span> <button onclick="logout()" class="btn btn-sm btn-outline-light">Одјави се</button>`;
        } else {
            userInfoEl.innerHTML = `<a href="login-register.html" class="btn btn-sm btn-light">Најави се</a>`;
        }
    }
}

function renderHeroButtons() {
    const heroButtonsEl = document.getElementById('hero-buttons');
    if (!heroButtonsEl) return;

    const user = getUser();

    if (user) {
        heroButtonsEl.innerHTML = `
            <a href="add-trip.html" class="btn btn-light rounded-pill px-4 fw-semibold">Креирај патување</a>
            <a href="trips-list.html" class="btn btn-outline-light rounded-pill px-4 fw-semibold">Мои Патувања</a>
        `;
    } else {
        heroButtonsEl.innerHTML = `
            <a href="add-trip.html" class="btn btn-light rounded-pill px-4 fw-semibold">Креирај патување</a>
            <a href="login-register.html" class="btn btn-outline-light rounded-pill px-4 fw-semibold">Најава / Регистрација</a>
        `;
    }
}

async function deleteTrip(id) {
    if (!confirm('Дали сте сигурни дека сакате да го избришете ова патување?')) return;

    try {
        const res = await fetch(`${API_BASE}/trips/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert('Патувањето е успешно избришано!');
            location.reload();
        } else {
            alert('Грешка при бришење на патувањето.');
        }
    } catch (err) {
        alert('Грешка со серверот.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const user = getUser();
    const currentPath = window.location.pathname;

    const protectedPages = ['trips-list.html', 'add-trip.html', 'destination-weather.html', 'search-attractions.html', 'index.html'];
    const isProtected = protectedPages.some(page => currentPath.includes(page));

    if (!user && isProtected) {
        window.location.href = 'login-register.html';
        return;
    }

    renderNavbar();
    renderHeroButtons();

    // Најава
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const res = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();

                if (res.ok) {
                    setToken(data.token, data.user);
                    alert(`Успешна најава! Добредојдовте ${data.user.username}`);
                    window.location.href = 'trips-list.html';
                } else {
                    alert(data.error || 'Грешка при најава.');
                }
            } catch (err) {
                alert('Грешка со серверот.');
            }
        });
    }

    // Регистрација
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const roleEl = document.getElementById('reg-role');
            const role = roleEl ? roleEl.value : 'viewer';

            try {
                const res = await fetch(`${API_BASE}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password, role })
                });
                const data = await res.json();

                if (res.ok) {
                    alert(data.message || 'Успешна регистрација! Сега можете да се најавите.');
                    registerForm.reset();
                } else {
                    alert(data.error || 'Грешка при регистрација.');
                }
            } catch (err) {
                alert('Грешка со серверот.');
            }
        });
    }

    // Додади патување
    const addTripForm = document.getElementById('add-trip-form');
    if (addTripForm) {
        addTripForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('trip-title').value;
            const destination = document.getElementById('trip-destination').value;
            const startDate = document.getElementById('trip-start-date').value;
            const endDate = document.getElementById('trip-end-date').value;
            const budget = document.getElementById('trip-budget').value;
            const currentUser = getUser();

            try {
                const res = await fetch(`${API_BASE}/trips`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title,
                        destination,
                        startDate,
                        endDate,
                        budget,
                        user: currentUser ? currentUser.id : null
                    })
                });

                if (res.ok) {
                    alert('Патувањето е успешно зачувано!');
                    window.location.href = 'trips-list.html';
                } else {
                    const data = await res.json();
                    alert(data.error || 'Грешка при додавање.');
                }
            } catch (err) {
                alert('Грешка со серверот при зачувување.');
            }
        });
    }

    const tripsContainer = document.getElementById('trips-container');
    if (tripsContainer) {
        loadTrips(tripsContainer);
    }

    const homeAttractionsContainer = document.getElementById('home-attractions-container');
    if (homeAttractionsContainer) {
        loadHomeAttractions(homeAttractionsContainer);
    }
});

async function loadTrips(container) {
    try {
        const res = await fetch(`${API_BASE}/trips`);
        const trips = await res.json();

        if (!Array.isArray(trips) || trips.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-muted py-5"><p>Немате зачувано патувања. Кликнете на "+ Додади Патување" за да креирате ново.</p></div>';
            return;
        }

        const currentUser = getUser();
        const isAdminOrEditor = currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor');
        const defaultTripImg = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600';

        container.innerHTML = trips.map(trip => {
            const startDate = trip.startDate ? new Date(trip.startDate).toLocaleDateString('mk-MK') : 'N/A';
            const endDate = trip.endDate ? new Date(trip.endDate).toLocaleDateString('mk-MK') : 'N/A';
            const imgUrl = trip.imageUrl || defaultTripImg;

            return `
                <div class="col-md-4">
                    <div class="card card-pastel h-100">
                        <img src="${imgUrl}" class="card-img-top-fixed" alt="${trip.title}">
                        <div class="card-body d-flex flex-column p-4">
                            <h5 class="fw-bold text-dark mb-1">${trip.title}</h5>
                            <h6 class="text-muted mb-3">📍 ${trip.destination}</h6>
                            <p class="card-text mb-1">📅 <strong>Период:</strong> ${startDate} - ${endDate}</p>
                            <p class="card-text mb-3">💰 <strong>Буџет:</strong> <span class="badge badge-pastel-mint">${trip.budget} €</span></p>
                            <div class="mt-auto text-end">
                                <button onclick="deleteTrip('${trip._id}')" class="btn btn-sm btn-outline-danger" style="border-radius: 10px;" ${!isAdminOrEditor ? 'disabled' : ''}>Избриши</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        container.innerHTML = '<div class="col-12 text-center text-muted py-5"><p>Немате зачувано патувања. Кликнете на "+ Додади Патување" за да креирате ново.</p></div>';
    }
}

async function loadHomeAttractions(container) {
    try {
        const res = await fetch(`${API_BASE}/attractions`);
        let attractions = await res.json();

        if (!Array.isArray(attractions) || attractions.length === 0) {
            attractions = DEFAULT_ATTRACTIONS;
        }

        currentAttractionsList = attractions;
        renderAttractionsList(container, attractions);

    } catch (err) {
        currentAttractionsList = DEFAULT_ATTRACTIONS;
        renderAttractionsList(container, DEFAULT_ATTRACTIONS);
    }
}

function renderAttractionsList(container, list) {
    const defaultAttractionImg = 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600';

    container.innerHTML = list.map((att, index) => {
        const imgUrl = att.imageUrl || defaultAttractionImg;
        const categoryBadge = att.category || 'Популарно';

        return `
            <div class="col-md-3">
                <div class="card card-pastel h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative" 
                     onclick="openAttractionModal(${index})" 
                     style="cursor: pointer; transition: transform 0.2s ease-in-out;">
                    <img src="${imgUrl}" class="card-img-top" alt="${att.name}" style="height: 180px; object-fit: cover;">
                    <div class="card-body text-center p-3">
                        <h5 class="fw-bold mb-1">${att.name}</h5>
                        <p class="text-muted small mb-3 text-truncate">${att.description || 'Прекрасна дестинација за посета.'}</p>
                        <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">${categoryBadge}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.openAttractionModal = function(index) {
    const item = currentAttractionsList[index];
    if (!item) return;

    document.getElementById('modalTitle').innerText = item.name;
    document.getElementById('modalImg').src = item.imageUrl || 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600';
    document.getElementById('modalBadge').innerText = item.category || 'Популарно';
    document.getElementById('modalCity').innerText = item.city ? ` ${item.city}` : '';
    document.getElementById('modalDescription').innerText = item.description || 'Нема достапен опис.';
    document.getElementById('modalDetails').innerHTML = item.details || 'Нема дополнителни детали за оваа дестинација.';

    const modal = new bootstrap.Modal(document.getElementById('attractionModal'));
    modal.show();
};
const API_BASE = 'http://localhost:3000/api';

// Зачувување и читање на JWT токенот во localStorage
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

// Функција за праќање на барања со JWT токен
async function authFetch(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(url, { ...options, headers });
    return res.json();
}

// Прикажување на информации за најавениот корисник
document.addEventListener('DOMContentLoaded', () => {
    const user = getUser();
    const userInfoEl = document.getElementById('user-info');
    if (userInfoEl && user) {
        userInfoEl.innerHTML = `Најавен: <strong>${user.username}</strong> (${user.role})`;
    }
});
import axios from 'axios';

// Базна адреса кон Express бекендот
const API = axios.create({
    baseURL: 'http://localhost:3000/api'
});

// 🔑 ИНТЕРЦЕПТОР: Автоматско земање на токенот од localStorage и додавање во заглавието (Authorization Header)
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// API повици за Автентикација
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerUser = (userData) => API.post('/auth/register', userData);

// API повици за Патувања (Trips)
export const fetchTrips = () => API.get('/trips');
export const createTrip = (tripData) => API.post('/trips', tripData);
export const deleteTrip = (id) => API.delete(`/trips/${id}`);

// API повици за Атракции (Attractions)
export const fetchAttractions = () => API.get('/attractions');
export const searchAttractions = (query = '', category = '') => 
    API.get(`/attractions?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category === 'Сите категории' ? '' : category)}`);
export const createAttraction = (data) => API.post('/attractions', data);
export const deleteAttraction = (id) => API.delete(`/attractions/${id}`);

export default API;
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import LoginRegisterView from './pages/LoginRegisterView';
import HomeView from './pages/HomeView';
import MyTripsView from './pages/MyTripsView';
import AddTripView from './pages/AddTripView';
import SearchAttractionsView from './pages/SearchAttractionsView';
import WeatherCurrencyView from './pages/WeatherCurrencyView';
import './App.css';

export default function App() {
  // Динамичко читање на најавениот корисник од localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isLoggedIn = !!user;

  // Функција за одјавување
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const [trips, setTrips] = useState([
    {
      id: 1,
      title: 'Викенд во Рим',
      location: 'Рим, Италија',
      dates: '05.10.2026 - 15.10.2026',
      img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600',
      budget: { accommodation: 320, food: 200, transport: 160, attractions: 120 }
    },
    {
      id: 2,
      title: 'Летување во Санторини',
      location: 'Санторини, Грција',
      dates: '01.06.2026 - 10.06.2026',
      img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600',
      budget: { accommodation: 500, food: 350, transport: 200, attractions: 150 }
    }
  ]);

  const [selectedTripId, setSelectedTripId] = useState(1);

  return (
    <Router>
      <Navigation user={user} onLogout={handleLogout} />
      <Routes>
        <Route 
          path="/login" 
          element={!isLoggedIn ? <LoginRegisterView setUser={setUser} /> : <Navigate to="/" replace />} 
        />
        
        <Route path="/" element={isLoggedIn ? <HomeView /> : <Navigate to="/login" replace />} />
        <Route path="/trips" element={isLoggedIn ? <MyTripsView trips={trips} /> : <Navigate to="/login" replace />} />
        <Route 
          path="/add-trip" 
          element={
            isLoggedIn ? (
              <AddTripView 
                trips={trips} 
                setTrips={setTrips} 
                setSelectedTripId={setSelectedTripId} 
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route path="/search" element={isLoggedIn ? <SearchAttractionsView /> : <Navigate to="/login" replace />} />
        <Route 
          path="/weather-currency" 
          element={
            isLoggedIn ? (
              <WeatherCurrencyView 
                trips={trips} 
                selectedTripId={selectedTripId} 
                setSelectedTripId={setSelectedTripId} 
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}
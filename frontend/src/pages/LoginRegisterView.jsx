import React, { useState } from 'react';

export default function LoginRegisterView({ setUser }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' или 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('viewer'); // Стандардно: viewer (Гостин)
  const [error, setError] = useState('');

  // Испраќање на формата
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const isRegister = activeTab === 'register';
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister 
      ? { username, email, password, role } 
      : { email, password };

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Настана грешка при автентикацијата.');
      }

      // Зачувај ги токенот и корисникот
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (setUser) {
        setUser(data.user);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '30px',
        width: '420px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        border: '1px solid #f1f5f9'
      }}>
        {/* ТАБОВИ ЗА НАЈАВА / РЕГИСТРАЦИЈА */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            style={{
              flex: 1,
              padding: '10px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'login' ? '3px solid #6366f1' : 'none',
              color: activeTab === 'login' ? '#4f46e5' : '#64748b',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            🔑 Најави се
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            style={{
              flex: 1,
              padding: '10px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'register' ? '3px solid #6366f1' : 'none',
              color: activeTab === 'register' ? '#4f46e5' : '#64748b',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            📝 Регистрација
          </button>
        </div>

        {error && (
          <div style={{ color: '#ef4444', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ПОЛЕ ЗА КОРИСНИЧКО ИМЕ (Само при Регистрација) */}
          {activeTab === 'register' && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem', color: '#1e293b' }}>
                Корисничко име
              </label>
              <input
                type="text"
                placeholder="Внесете корисничко име"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* ПОЛЕ ЗА Е-ПОШТА */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem', color: '#1e293b' }}>
              Е-пошта (Email)
            </label>
            <input
              type="text"
              placeholder="vasiot-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* ПОЛЕ ЗА ЛОЗИНКА */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem', color: '#1e293b' }}>
              Лозинка
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* ИЗБОР НА УЛОГА (Се прикажува само на табот Регистрација) */}
          {activeTab === 'register' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem', color: '#1e293b' }}>
                Избери улога (Role)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
              >
                <option value="viewer">👤 Гостин (Viewer)</option>
                <option value="user">✈️ Обичен Корисник (User)</option>
                <option value="admin">⚡ Администратор (Admin)</option>
              </select>
            </div>
          )}

          {/* ГЛАВНО КОПЧЕ */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#a7f3d0',
              color: '#065f46',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            {activeTab === 'register' ? 'Креирај сметка' : 'Влези во системот'}
          </button>
        </form>
      </div>
    </div>
  );
}
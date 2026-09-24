import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api';

function LoginRegisterView({ setUser }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLoginTab) {
        // Повик за најава
        const response = await loginUser({ email, password });
        const loggedUser = response.data.user || {
          name: response.data.name || email.split('@')[0],
          email: email,
          role: response.data.role || 'user'
        };

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        localStorage.setItem('user', JSON.stringify(loggedUser));
        setUser(loggedUser);
        navigate('/');
      } else {
        // Повик за регистрација - ги испраќаме и `username` и `name` за MongoDB
        const response = await registerUser({ 
          username: name, 
          name: name, 
          email: email, 
          password: password 
        });

        const newUser = response.data.user || {
          name: name,
          email: email,
          role: 'user'
        };

        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        navigate('/');
      }
    } catch (err) {
      console.error('Грешка при автентикација:', err);
      setErrorMsg(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Неуспешна регистрација/најава. Проверете ги податоците.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', marginBottom: '50px' }}>
      <div className="form-card" style={{ maxWidth: '450px', width: '100%', padding: '30px' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '25px' }}>
          <button
            type="button"
            onClick={() => { setIsLoginTab(true); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              color: isLoginTab ? '#4f46e5' : '#64748b',
              borderBottom: isLoginTab ? '3px solid #4f46e5' : 'none',
              marginBottom: '-2px'
            }}
          >
            🔑 Најави се
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginTab(false); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              color: !isLoginTab ? '#4f46e5' : '#64748b',
              borderBottom: !isLoginTab ? '3px solid #4f46e5' : 'none',
              marginBottom: '-2px'
            }}
          >
            📝 Регистрација
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLoginTab && (
            <div className="form-group">
              <label>Име и Презиме</label>
              <input
                type="text"
                className="form-control"
                placeholder="пр. Маја Петровска"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Е-пошта (Email)</label>
            <input
              type="email"
              className="form-control"
              placeholder="vasiot-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Лозинка</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit-green" style={{ width: '100%', marginTop: '15px' }} disabled={loading}>
            {loading ? 'Се процесира...' : isLoginTab ? 'Влези во системот' : 'Креирај профил'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginRegisterView;
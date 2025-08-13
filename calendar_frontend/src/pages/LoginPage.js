import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * PUBLIC_INTERFACE
 * LoginPage
 * Sign in form for existing users.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (e) {
      setError(e?.message || 'Login failed');
    }
  }

  return (
    <div className="auth-card">
      <div className="card">
        <div className="title">Sign in to Calendar</div>
        <div className="subtitle">Manage events, schedule meetings, and collaborate.</div>
        <form className="form" onSubmit={onSubmit}>
          <div>
            <label>Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label>Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {error ? <div className="text-danger">{error}</div> : null}
          <button className="button" type="submit">Sign in</button>
        </form>
        <div className="hint" style={{ marginTop: 8 }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Create one</Link>
        </div>
      </div>
    </div>
  );
}

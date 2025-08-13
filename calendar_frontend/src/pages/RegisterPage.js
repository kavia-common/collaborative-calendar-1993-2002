import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * PUBLIC_INTERFACE
 * RegisterPage
 * Sign up form to create a new account.
 */
export default function RegisterPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await register({ email, name, password });
      navigate('/', { replace: true });
    } catch (e) {
      setError(e?.message || 'Registration failed');
    }
  }

  return (
    <div className="auth-card">
      <div className="card">
        <div className="title">Create your account</div>
        <div className="subtitle">Start organizing your schedule today.</div>
        <form className="form" onSubmit={onSubmit}>
          <div>
            <label>Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
          </div>
          <div>
            <label>Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label>Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" required />
          </div>
          {error ? <div className="text-danger">{error}</div> : null}
          <button className="button" type="submit">Sign up</button>
        </form>
        <div className="hint" style={{ marginTop: 8 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}

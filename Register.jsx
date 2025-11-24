import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import '../styles.css';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      nav('/');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="container page stack" style={{ maxWidth: 420 }}>
      <h2 style={{ marginBottom: 0 }}>Create your account</h2>
      <p style={{ marginTop: 0, color: 'var(--muted)' }}>Book doorstep repairs in seconds</p>
      {error && <div className="card" style={{ padding: 12, borderColor: 'rgba(255,0,0,.3)' }}>{error}</div>}
      <input className="input" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
      <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input className="input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <div className="row">
        <button className="btn btn-primary" disabled={loading} type="submit">{loading ? 'Please wait...' : 'Register'}</button>
      </div>
    </form>
  );
}



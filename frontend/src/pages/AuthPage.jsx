import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { login, register, setError, error } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        setMessage('Login sukses');
      } else {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        setMessage('Register sukses');
      }
    } catch (err) {
      setMessage(err.message || 'Gagal memproses permintaan');
    }
  };

  return (
    <main className="page auth-page">
      <section className="auth-section">
        <div className="auth-card">
          <h1>{mode === 'login' ? 'Login' : 'Register'}</h1>
          <p className="muted">Gunakan seed: buyer@example.com / agent@example.com, password123</p>
          <form className="form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <label>
                  Name
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Role
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="buyer">Buyer</option>
                    <option value="agent">Agent</option>
                  </select>
                </label>
              </>
            )}
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </label>
            <div className="form-actions">
              <button className="btn primary" type="submit">
                {mode === 'login' ? 'Login' : 'Register'}
              </button>
              <button
                className="btn ghost"
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              >
                Switch to {mode === 'login' ? 'Register' : 'Login'}
              </button>
            </div>
          </form>
          {message && <p className="status-detail">{message}</p>}
          {error && <p className="status-detail">{error}</p>}
        </div>
      </section>
    </main>
  );
}

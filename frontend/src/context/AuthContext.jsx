import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister, me as apiMe, updateProfile as apiUpdateProfile } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    if (!token) {
      setLoading(false);
      return;
    }
    apiMe()
      .then(({ user }) => setUser(user))
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    setError('');
    const { token, user } = await apiLogin(email, password);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const register = async (payload) => {
    setError('');
    const { token, user } = await apiRegister(payload);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const { user: updated } = await apiUpdateProfile(payload);
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  };

  const value = { user, loading, error, setError, login, register, logout, updateProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

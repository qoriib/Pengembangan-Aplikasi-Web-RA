import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister, me as apiMe, updateProfile as apiUpdateProfile } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    apiMe()
      .then(({ user }) => setUser(user))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    setError('');
    const { token, user } = await apiLogin(email, password);
    localStorage.setItem('token', token);
    setUser(user);
    return user;
  };

  const register = async (payload) => {
    setError('');
    const { token, user } = await apiRegister(payload);
    localStorage.setItem('token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const { user: updated } = await apiUpdateProfile(payload);
    setUser(updated);
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

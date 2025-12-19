import { createContext, useContext, useEffect, useState } from 'react';
import { fetchPropertyDetail } from '../services/api';

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('compare_items');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('compare_items', JSON.stringify(items));
  }, [items]);

  const addLocal = (property) => {
    setItems((prev) => {
      if (prev.find((p) => p.id === property.id)) return prev;
      return [...prev, property].slice(-4); // max 4 items
    });
  };

  const addById = async (id) => {
    if (contains(id)) return;
    try {
      const { property } = await fetchPropertyDetail(id);
      if (property) addLocal(property);
    } catch (e) {
      console.error('Gagal mengambil detail property untuk compare', e);
    }
  };

  const remove = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setItems([]);
  const contains = (id) => items.some((p) => p.id === id);

  return (
    <CompareContext.Provider value={{ items, addLocal, addById, remove, clear, contains }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}

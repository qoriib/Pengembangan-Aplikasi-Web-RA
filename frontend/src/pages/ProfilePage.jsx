import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { me as apiMe } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', role: '' });
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    const load = async () => {
      try {
        const { user: fresh } = await apiMe();
        setProfile({
          name: fresh.name || '',
          email: fresh.email || '',
          phone: fresh.phone || '',
          role: fresh.role || '',
        });
      } catch (err) {
        showToast('Gagal memuat profil', 'error');
      }
    };
    load();
  }, [user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: profile.name,
        phone: profile.phone,
      };
      if (password) payload.password = password;
      const updated = await updateProfile(payload);
      showToast('Profil diperbarui', 'success');
      setProfile((prev) => ({ ...prev, ...updated }));
      setPassword('');
    } catch (err) {
      showToast(err.message || 'Gagal memperbarui profil', 'error');
    }
  };

  if (!user) return null;

  return (
    <main className="section max-w-3xl space-y-4">
      <section className="card p-6 space-y-4">
        <header className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-sm font-bold text-slate-900">
            {profile.name?.slice(0, 2).toUpperCase() || 'ME'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Profil</h1>
            <p className="text-sm text-slate-600">Kelola nama, kontak, dan password.</p>
          </div>
        </header>

        <form className="grid gap-3" onSubmit={handleUpdate}>
          <div className="grid gap-1">
            <label className="text-sm font-semibold text-slate-800">Nama</label>
            <input
              className="input"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-semibold text-slate-800">Email</label>
            <input className="input" value={profile.email} disabled />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-semibold text-slate-800">Telepon</label>
            <input
              className="input"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-semibold text-slate-800">Password baru (opsional)</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Biarkan kosong jika tidak diubah"
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <button className="btn btn-primary" type="submit">Simpan</button>
            <button className="btn btn-ghost" type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

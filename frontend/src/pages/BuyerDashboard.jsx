import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listInquiries, listFavorites, deleteInquiry, deleteFavorite } from '../services/api';
import TabBar from '../components/TabBar';
import SectionHeader from '../components/SectionHeader';
import Table from '../components/Table';
import { useToast } from '../context/ToastContext';

const formatPrice = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (value) => {
  if (!value) return '-';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return '-';
  }
};

export default function BuyerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [tab, setTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([]);
  const [favStatus, setFavStatus] = useState('');
  const [loadingInq, setLoadingInq] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [loadingFav, setLoadingFav] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (user.role !== 'buyer') {
      navigate('/');
      return;
    }
    loadInquiries();
  }, [user, navigate]);

  const loadInquiries = async () => {
    try {
      setLoadingInq(true);
      const { inquiries: list } = await listInquiries();
      setInquiries(list || []);
    } catch (err) {
      showToast('Gagal memuat inquiries', 'error');
    } finally {
      setLoadingInq(false);
    }
  };

  const loadFavorites = async () => {
    try {
      setLoadingFav(true);
      const { favorites: list } = await listFavorites();
      setFavorites(list || []);
    } catch (err) {
      showToast('Gagal memuat favorit', 'error');
    } finally {
      setLoadingFav(false);
    }
  };

  const handleDeleteInquiry = async (id) => {
    try {
      await deleteInquiry(id);
      showToast('Inquiry dihapus', 'success');
      loadInquiries();
    } catch (err) {
      showToast('Gagal menghapus inquiry', 'error');
    }
  };

  const handleDeleteFavorite = async (propertyId) => {
    try {
      await deleteFavorite(propertyId);
      showToast('Favorit dihapus', 'success');
      loadFavorites();
    } catch (err) {
      showToast('Gagal menghapus favorit', 'error');
    }
  };

  if (!user || user.role !== 'buyer') return null;

  return (
    <main className="section space-y-4">
      <TabBar
        tabs={[
          { id: 'inquiries', label: 'Inquiries Saya' },
          { id: 'favorites', label: 'Favorit Saya' },
        ]}
        activeId={tab}
        onChange={(id) => {
          setTab(id);
          if (id === 'favorites' && !favorites.length) loadFavorites();
        }}
      />
      {favStatus && <p className="text-sm text-slate-700">{favStatus}</p>}

      <section className={`card p-5 space-y-3 ${tab === 'inquiries' ? '' : 'hidden'}`}>
        <SectionHeader title="Inquiries" subtitle="Daftar permintaan yang Anda kirim ke agent." />
        {loadingInq ? (
          <p className="text-slate-600">Memuat...</p>
        ) : inquiries.length === 0 ? (
          <p className="text-slate-600">Belum ada inquiry.</p>
        ) : (
          <Table
            columns={['Property', 'Pesan', 'Tanggal', 'Aksi']}
            gridTemplateColumns="1.5fr 2fr 1fr auto"
            data={inquiries}
            renderRow={(i) => (
              <div key={i.id} className="table-row" style={{ gridTemplateColumns: '1.5fr 2fr 1fr auto' }}>
                <span className="cell-strong">{i.property?.title || i.property_title || i.property_name || '-'}</span>
                <span className="inquiry-message">{i.message}</span>
                <span className="cell-muted">{formatDate(i.created_at || i.createdAt || i.date)}</span>
                <span className="table-actions">
                  <a className="btn btn-ghost small" href={`/properties/${i.property_id || i.property?.id || ''}`}>
                    Lihat
                  </a>
                  <button className="btn btn-ghost small" onClick={() => handleDeleteInquiry(i.id)}>
                    Hapus
                  </button>
                </span>
              </div>
            )}
          />
        )}
      </section>

      <section className={`card p-5 space-y-3 ${tab === 'favorites' ? '' : 'hidden'}`}>
        <SectionHeader title="Favorit Saya" subtitle="Daftar properti yang Anda simpan." />
        {loadingFav ? (
          <p className="text-slate-600">Memuat...</p>
        ) : favorites.length === 0 ? (
          <p className="text-slate-600">Belum ada favorit.</p>
        ) : (
          <Table
            columns={['Judul', 'Harga', 'Tipe', 'Aksi']}
            gridTemplateColumns="2fr 1fr 1fr auto"
            data={favorites}
            renderRow={(p) => (
              <div key={p.id} className="table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr auto' }}>
                <span className="cell-strong">{p.title}</span>
                <span className="cell-muted">{formatPrice(p.price)}</span>
                <span className="cell-badge">{p.type}</span>
                <span className="table-actions">
                  <a className="btn btn-ghost small" href={`/properties/${p.id}`}>
                    Detail
                  </a>
                  <button className="btn btn-ghost small" onClick={() => handleDeleteFavorite(p.id)}>
                    Hapus
                  </button>
                </span>
              </div>
            )}
          />
        )}
      </section>
    </main>
  );
}

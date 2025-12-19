import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listInquiries, addFavorite, fetchProperties } from '../services/api';
import TabBar from '../components/TabBar';
import SectionHeader from '../components/SectionHeader';
import Table from '../components/Table';

const formatPrice = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function BuyerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([]);
  const [favStatus, setFavStatus] = useState('');
  const [loadingInq, setLoadingInq] = useState(true);
  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);

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
      setFavStatus('Gagal memuat inquiries');
    } finally {
      setLoadingInq(false);
    }
  };

  const loadFavCandidates = async () => {
    try {
      setLoadingProps(true);
      const { properties: list } = await fetchProperties();
      setProperties(list || []);
    } catch (err) {
      setFavStatus('Gagal memuat properti');
    } finally {
      setLoadingProps(false);
    }
  };

  const handleFavorite = async (id) => {
    try {
      await addFavorite(id);
      setFavStatus('Ditambahkan ke favorit');
    } catch (err) {
      setFavStatus(err.message || 'Gagal menambah favorit');
    }
  };

  if (!user || user.role !== 'buyer') return null;

  return (
    <main className="section space-y-4">
      <TabBar
        tabs={[
          { id: 'inquiries', label: 'Inquiries Saya' },
          { id: 'favorites', label: 'Tambah Favorit' },
        ]}
        activeId={tab}
        onChange={(id) => {
          setTab(id);
          if (id === 'favorites' && !properties.length) loadFavCandidates();
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
            columns={['Property', 'Pesan', 'Tanggal']}
            gridTemplateColumns="1.5fr 2fr 1fr"
            data={inquiries}
            renderRow={(i) => (
              <div key={i.id} className="table-row" style={{ gridTemplateColumns: '1.5fr 2fr 1fr' }}>
                <span className="cell-strong">{i.property_title || i.property?.title || '-'}</span>
                <span className="inquiry-message">{i.message}</span>
                <span className="cell-muted">{i.created_at || '-'}</span>
              </div>
            )}
          />
        )}
      </section>

      <section className={`card p-5 space-y-3 ${tab === 'favorites' ? '' : 'hidden'}`}>
        <SectionHeader title="Tambah Favorit" subtitle="Simpan properti yang Anda suka." />
        {loadingProps ? (
          <p className="text-slate-600">Memuat...</p>
        ) : properties.length === 0 ? (
          <p className="text-slate-600">Belum ada data.</p>
        ) : (
          <Table
            columns={['Judul', 'Harga', 'Tipe', 'Aksi']}
            gridTemplateColumns="2fr 1fr 1fr auto"
            data={properties}
            renderRow={(p) => (
              <div key={p.id} className="table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr auto' }}>
                <span className="cell-strong">{p.title}</span>
                <span className="cell-muted">{formatPrice(p.price)}</span>
                <span className="cell-badge">{p.type}</span>
                <span className="table-actions">
                  <button className="btn btn-primary small" onClick={() => handleFavorite(p.id)}>Favorite</button>
                </span>
              </div>
            )}
          />
        )}
      </section>
    </main>
  );
}

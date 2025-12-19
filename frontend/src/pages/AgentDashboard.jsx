import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createProperty, updateProperty, deleteProperty, fetchProperties, listInquiries } from '../services/api';
import { useToast } from '../context/ToastContext';
import TabBar from '../components/TabBar';
import SectionHeader from '../components/SectionHeader';
import Table from '../components/Table';

const formatPrice = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const emptyForm = {
  title: '',
  description: '',
  price: '',
  type: 'house',
  location: '',
  bedrooms: '',
  bathrooms: '',
  area: '',
  photos: '',
};

export default function AgentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('properties');
  const [inquiries, setInquiries] = useState([]);
  const [loadingInq, setLoadingInq] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (user.role !== 'agent') {
      navigate('/');
      return;
    }
    loadProps();
  }, [user, navigate]);

  const loadProps = async () => {
    try {
      setLoading(true);
      const { properties: list } = await fetchProperties({ agent_id: user?.id });
      setProperties(list || []);
    } catch (err) {
      showToast('Gagal memuat data properti', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      type: form.type,
      location: form.location,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      area: form.area ? Number(form.area) : null,
      photos: form.photos
        ? form.photos.split(',').map((p) => p.trim()).filter(Boolean)
        : [],
    };

    try {
      if (editingId) {
        await updateProperty(editingId, payload);
        showToast('Properti diperbarui', 'success');
      } else {
        await createProperty(payload);
        showToast('Properti dibuat', 'success');
      }
      setForm(emptyForm);
      setEditingId(null);
      loadProps();
    } catch (err) {
      showToast(err.message || 'Gagal menyimpan properti', 'error');
    }
  };

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

  const handleEdit = (prop) => {
    setEditingId(prop.id);
    setForm({
      title: prop.title || '',
      description: prop.description || '',
      price: prop.price || '',
      type: prop.type || 'house',
      location: prop.location || '',
      bedrooms: prop.bedrooms ?? '',
      bathrooms: prop.bathrooms ?? '',
      area: prop.area ?? '',
      photos: prop.photos?.map((p) => p.photo_url).join(', ') || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus properti ini?')) return;
    try {
      await deleteProperty(id);
      showToast('Properti dihapus', 'success');
      loadProps();
    } catch (err) {
      showToast(err.message || 'Gagal menghapus properti', 'error');
    }
  };

  if (!user || user.role !== 'agent') return null;

  return (
    <main className="section space-y-4">
      <TabBar
        tabs={[
          { id: 'properties', label: 'Kelola Properti' },
          { id: 'inquiries', label: 'Inquiries' },
        ]}
        activeId={tab}
        onChange={(id) => {
          setTab(id);
          if (id === 'inquiries' && !inquiries.length) loadInquiries();
        }}
      />
      <section className={`grid gap-4 lg:grid-cols-2 ${tab === 'properties' ? '' : 'hidden'}`}>
        <div className="card p-5 space-y-3">
          <SectionHeader title="Dashboard Agent" subtitle="Kelola listing properti Anda." />

          <form className="grid gap-3" onSubmit={handleSubmit}>
            <div className="grid gap-1">
              <label className="text-sm font-semibold text-slate-800">Judul</label>
              <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-semibold text-slate-800">Deskripsi</label>
              <textarea
                className="textarea"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-semibold text-slate-800">Harga</label>
              <input
                className="input"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-semibold text-slate-800">Tipe</label>
              <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-semibold text-slate-800">Lokasi</label>
              <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-slate-800">Kamar tidur</label>
                <input
                  className="input"
                  type="number"
                  value={form.bedrooms}
                  onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-slate-800">Kamar mandi</label>
                <input
                  className="input"
                  type="number"
                  value={form.bathrooms}
                  onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-slate-800">Luas (sqm)</label>
                <input
                  className="input"
                  type="number"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-semibold text-slate-800">Foto (pisahkan dengan koma)</label>
              <input
                className="input"
                value={form.photos}
                onChange={(e) => setForm({ ...form, photos: e.target.value })}
                placeholder="https://... , https://..."
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button className="btn btn-primary" type="submit">
                {editingId ? 'Update' : 'Tambah'} Properti
              </button>
              {editingId && (
                <button className="btn btn-ghost" type="button" onClick={() => { setForm(emptyForm); setEditingId(null); }}>
                  Batal edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="card p-5 space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Listing Anda</h2>
          {loading ? (
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
                    <button className="btn btn-primary small" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn btn-ghost small" onClick={() => handleDelete(p.id)}>
                      Hapus
                    </button>
                  </span>
                </div>
              )}
            />
          )}
        </div>
      </section>

      <section className={`card p-5 space-y-3 ${tab === 'inquiries' ? '' : 'hidden'}`}>
        <h2 className="text-lg font-bold text-slate-900">Inquiries</h2>
        {loadingInq ? (
          <p className="text-slate-600">Memuat...</p>
        ) : inquiries.length === 0 ? (
          <p className="text-slate-600">Belum ada inquiry.</p>
        ) : (
          <Table
            columns={['Property', 'Pesan', 'Buyer', 'Kontak']}
            gridTemplateColumns="1.5fr 2fr 1fr 1fr"
            data={inquiries}
            renderRow={(i) => (
              <div key={i.id} className="table-row" style={{ gridTemplateColumns: '1.5fr 2fr 1fr 1fr' }}>
                <span className="cell-strong">{i.property_title || i.property?.title || '-'}</span>
                <span className="inquiry-message">{i.message}</span>
                <span className="cell-muted">{i.buyer_name || i.buyer?.name || '-'}</span>
                <span className="cell-muted">
                  {i.buyer_email || i.buyer?.email || '-'}
                  {i.buyer_phone ? ` / ${i.buyer_phone}` : ''}
                </span>
              </div>
            )}
          />
        )}
      </section>
    </main>
  );
}

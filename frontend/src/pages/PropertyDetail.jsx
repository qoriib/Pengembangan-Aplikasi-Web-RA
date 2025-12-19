import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProperties, addFavorite, sendInquiry } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SectionHeader from '../components/SectionHeader';
import { useCompare } from '../context/CompareContext';
import { useToast } from '../context/ToastContext';

const formatPrice = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function PropertyDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addById: addCompareById, contains: inCompare } = useCompare();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [inquiryText, setInquiryText] = useState('Saya tertarik, bisa jadwalkan survei?');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { properties } = await fetchProperties();
        const found = properties.find((p) => String(p.id) === String(id));
        if (!found) {
          setMessage('Properti tidak ditemukan');
        }
        setProperty(found);
      } catch (err) {
        setMessage('Gagal memuat properti');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleFavorite = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (user.role !== 'buyer') {
      setMessage('Hanya buyer yang dapat menyimpan favorit');
      return;
    }
    try {
      await addFavorite(property.id);
      showToast('Ditambahkan ke favorit', 'success');
    } catch (err) {
      showToast('Gagal menambah favorit (login buyer?)', 'error');
    }
  };

  const handleInquiry = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    try {
      if (!inquiryText.trim()) {
        setMessage('Pesan inquiry tidak boleh kosong');
        return;
      }
      await sendInquiry({ property_id: property.id, message: inquiryText });
      showToast('Inquiry terkirim', 'success');
      setInquiryText('Saya tertarik, bisa jadwalkan survei?');
    } catch (err) {
      showToast('Gagal kirim inquiry (login?)', 'error');
    }
  };

  if (loading) return <main className="section"><p className="text-slate-600">Memuat...</p></main>;
  if (!property) return <main className="section"><p className="text-slate-600">{message || 'Tidak ada data'}</p></main>;
  const canFavorite = user?.role === 'buyer';
  const isLoggedIn = Boolean(user);

  return (
    <main className="section space-y-4">
      <button className="text-sm text-blue-600" onClick={() => navigate(-1)}>
        &larr; Kembali
      </button>

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <div className="card overflow-hidden">
          <div
            className="h-64 bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.35)), url(${property.photos?.[0]?.photo_url || 'https://placehold.co/800x500'})` }}
          />
        </div>

        <div className="card p-5 space-y-3">
          <SectionHeader eyebrow={property.type} title={property.title} subtitle={property.location} />
          <div className="text-blue-600 font-bold text-xl">{formatPrice(property.price)}</div>
          <div className="flex gap-4 text-sm text-slate-600">
            <span><i className="fa-solid fa-bed mr-1"></i>{property.bedrooms ?? 0} bd</span>
            <span><i className="fa-solid fa-bath mr-1"></i>{property.bathrooms ?? 0} ba</span>
            <span><i className="fa-solid fa-ruler-combined mr-1"></i>{property.area ?? 0} sqm</span>
          </div>
          <p className="text-sm text-slate-700">{property.description || 'Tidak ada deskripsi.'}</p>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              className={`btn btn-primary ${!isLoggedIn ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={handleFavorite}
              disabled={!canFavorite}
              title={!isLoggedIn ? 'Login untuk favorit' : !canFavorite ? 'Hanya buyer yang bisa favorit' : ''}
            >
              <i className="fa-solid fa-heart mr-2"></i>Favorite
            </button>
            <button
              className={`btn ${inCompare(property.id) ? 'btn-primary opacity-80' : 'btn-ghost border-dashed'}`}
              onClick={() => {
                if (inCompare(property.id)) return;
                addCompareById(property.id);
                showToast('Ditambahkan ke compare', 'success');
              }}
            >
              <i className="fa-solid fa-clone mr-2"></i>
              {inCompare(property.id) ? 'Sudah di Compare' : 'Tambah ke Compare'}
            </button>
            <div className="w-full space-y-2">
              <textarea
                className="textarea"
                rows={3}
                value={inquiryText}
                onChange={(e) => setInquiryText(e.target.value)}
                placeholder="Tuliskan pesan Anda untuk agent"
                disabled={!isLoggedIn}
              />
              <button
                className={`btn btn-ghost ${!isLoggedIn ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={handleInquiry}
                disabled={!isLoggedIn}
              >
                <i className="fa-solid fa-paper-plane mr-2"></i>
                {isLoggedIn ? 'Kirim Inquiry' : 'Login untuk Inquiry'}
              </button>
            </div>
          </div>
          {message && <p className="text-sm text-slate-700">{message}</p>}
        </div>
      </div>
    </main>
  );
}

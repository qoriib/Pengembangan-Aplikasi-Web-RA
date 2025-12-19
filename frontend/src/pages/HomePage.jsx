import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { addFavorite, fetchProperties, sendInquiry } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SectionHeader from '../components/SectionHeader';
import { useCompare } from '../context/CompareContext';
import { useToast } from '../context/ToastContext';

export default function HomePage() {
  const { user } = useAuth();
  const { addById: addCompareById, contains: inCompare } = useCompare();
  const { showToast } = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const { properties: props } = await fetchProperties();
      setProperties(
        props.map((p) => ({
          id: p.id,
          title: p.title,
          location: p.location,
          price: p.price,
          type: p.type,
          beds: p.bedrooms ?? 0,
          baths: p.bathrooms ?? 0,
          area: p.area ?? 0,
          photoUrl: p.photos?.[0]?.photo_url || 'https://placehold.co/600x400?text=Property',
        })),
      );
    } catch (err) {
      setMessage('Gagal memuat properties.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (propertyId) => {
    try {
      await addFavorite(propertyId);
      showToast('Ditambahkan ke favorit', 'success');
    } catch (err) {
      showToast('Gagal menambah favorit (login buyer?)', 'error');
    }
  };

  const handleInquiry = async (propertyId) => {
    try {
      const messageText = prompt('Pesan ke agent:', 'Saya tertarik, bisa jadwalkan survei?');
      if (!messageText) return;
      await sendInquiry({ property_id: propertyId, message: messageText });
      showToast('Inquiry terkirim', 'success');
    } catch (err) {
      showToast('Gagal kirim inquiry (login buyer?)', 'error');
    }
  };

  return (
    <main className="space-y-8">
      <section className="bg-slate-900 text-white py-12">
        <div className="section max-w-4xl text-center space-y-5">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-200">Temukan hunian</p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white">
            Cari, bandingkan, dan hubungi agent dalam satu tempat
          </h1>
          <p className="text-slate-200 text-sm md:text-base leading-relaxed">
            Integrasi penuh dengan Pyramid API. Simpan favorit, bandingkan hingga 4 properti, dan kirim inquiry langsung ke agent.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <a className="btn btn-primary" href="#listings">
              <i className="fa-solid fa-list"></i>
              Lihat Listings
            </a>
            <a className="btn btn-ghost border-white text-white hover:bg-white/10" href="/compare">
              <i className="fa-solid fa-layer-group"></i>
              Buka Compare
            </a>
          </div>
          {message && <p className="text-sm text-slate-200">{message}</p>}
        </div>
      </section>

      <section id="listings" className="section space-y-6">
        <SectionHeader eyebrow="Listings" title="Data Properti dari API" subtitle={!message ? 'Klik detail atau bandingkan properti.' : message} />

        {loading ? (
          <p className="text-slate-600">Memuat...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                favorite={false}
                detailHref={`/properties/${property.id}`}
                onCompare={() => addCompareById(property.id)}
                inCompare={inCompare(property.id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

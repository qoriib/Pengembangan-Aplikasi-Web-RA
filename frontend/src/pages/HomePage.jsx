import { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import { addFavorite, fetchProperties, sendInquiry } from '../services/api';
import { useAuth } from '../context/AuthContext';

const featureCards = [
  {
    title: 'Buyer experience',
    points: ['Browse & filter harga/tipe/lokasi', 'Simpan favorit', 'Kirim inquiry ke agent'],
  },
  {
    title: 'Agent cockpit',
    points: ['CRUD properti + foto', 'Kelola inquiries', 'Dashboard cepat'],
  },
  {
    title: 'Keamanan',
    points: ['Auth JWT', 'Role buyer/agent', 'Protected routes'],
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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
      setMessage('Ditambahkan ke favorit');
    } catch (err) {
      setMessage('Gagal menambah favorit (login buyer?)');
    }
  };

  const handleInquiry = async (propertyId) => {
    try {
      await sendInquiry({ property_id: propertyId, message: 'Saya tertarik, bisa jadwalkan survei?' });
      setMessage('Inquiry terkirim');
    } catch (err) {
      setMessage('Gagal kirim inquiry (login buyer?)');
    }
  };

  return (
    <main className="page landing">
      <section className="hero landing-hero">
        <div className="landing-hero__content">
          <p className="eyebrow">Platform listing properti</p>
          <h1>Bangun portal jual/sewa dengan React + Pyramid API</h1>
          <p className="lede">
            Listing, inquiry, favorites, dan dashboard agent dalam satu stack. Mulai dengan login/register, lalu kelola listing dan interaksi.
          </p>
        </div>
      </section>

      <section className="feature-section" id="features">
        <div className="section-header">
          <p className="eyebrow">Fitur</p>
          <h2>Semua kebutuhan listing properti</h2>
        </div>
        <div className="feature-grid">
          {featureCards.map((card) => (
            <article key={card.title} className="feature-card">
              <h3>{card.title}</h3>
              <ul>
                {card.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="showcase" id="properties">
        <div className="section-header">
          <p className="eyebrow">Listings</p>
          <h2>Data dari API</h2>
          {message && <p className="status-detail">{message}</p>}
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="property-grid">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                favorite={false}
                onFavorite={user?.role === 'buyer' ? handleFavorite : null}
                onInquiry={user ? handleInquiry : null}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

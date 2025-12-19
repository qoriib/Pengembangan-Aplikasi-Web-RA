import { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import { addFavorite, fetchProperties, sendInquiry } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SectionHeader from '../components/SectionHeader';

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
    <main className="section space-y-6">
      <SectionHeader eyebrow="Listings" title="Data Properti dari API" subtitle={message} />

      {loading ? (
        <p className="text-slate-600">Memuat...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </main>
  );
}

import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PropertyCard, { type Property } from './components/PropertyCard';

type ApiStatus = 'idle' | 'ok' | 'error';

const sampleProperties: Property[] = [
  {
    id: 1,
    title: 'Modern Scandinavian House',
    location: 'BSD, Tangerang',
    price: 2150000000,
    type: 'House',
    beds: 4,
    baths: 3,
    area: 210,
    photoUrl:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Highrise City Apartment',
    location: 'Kuningan, Jakarta',
    price: 1250000000,
    type: 'Apartment',
    beds: 2,
    baths: 2,
    area: 86,
    photoUrl:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Coastal Villa',
    location: 'Canggu, Bali',
    price: 3550000000,
    type: 'House',
    beds: 3,
    baths: 3,
    area: 260,
    photoUrl:
      'https://images.unsplash.com/photo-1465805139202-a644e217f00e?auto=format&fit=crop&w=1200&q=80',
  },
];

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

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('idle');
  const [message, setMessage] = useState<string>('');

  const apiBase = useMemo(
    () => (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:6543',
    [],
  );

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch(`${apiBase}/api/properties`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setApiStatus('ok');
        setMessage('Backend reachable. Ready to build UI.');
      } catch (error) {
        setApiStatus('error');
        setMessage(
          'Tidak bisa menghubungi backend. Pastikan Pyramid jalan di 6543 atau set VITE_API_BASE.',
        );
      }
    };

    checkApi();
  }, [apiBase]);

  return (
    <>
      <Navbar apiBase={apiBase} />
      <main className="page landing">
        <section className="hero landing-hero">
          <div className="landing-hero__content">
            <p className="eyebrow">Platform listing properti</p>
            <h1>Bangun portal jual/sewa dengan React + Pyramid API</h1>
            <p className="lede">
              Listing, inquiry, favorites, dan dashboard agent dalam satu stack. Start backend di
              <code>http://localhost:6543</code> lalu kembangkan UI ini.
            </p>
            <div className="landing-cta">
              <a className="btn primary" href="#properties">
                Lihat properti
              </a>
              <a className="btn ghost" href="#features">
                Lihat fitur
              </a>
            </div>
            <div className="status status--pill">
              <span className={`dot ${apiStatus}`} />
              <span>
                {apiStatus === 'idle' && 'Mengecek backend...'}
                {apiStatus === 'ok' && 'Backend terhubung'}
                {apiStatus === 'error' && 'Backend tidak terhubung'}
              </span>
            </div>
            {message && <p className="status-detail">{message}</p>}
          </div>
          <div className="landing-hero__panel">
            <div className="panel-card">
              <div className="panel-label">Roadmap</div>
              <ul>
                <li>Auth buyer/agent</li>
                <li>CRUD properti + foto</li>
                <li>Favorites & inquiry</li>
                <li>Filter harga/tipe/lokasi</li>
              </ul>
            </div>
            <div className="panel-card panel-card--accent">
              <div className="panel-label">API base</div>
              <div className="panel-value">{apiBase}</div>
              <div className="panel-note">Ubah di frontend/.env</div>
            </div>
          </div>
        </section>

        <section className="feature-section" id="features">
          <div className="section-header">
            <p className="eyebrow">Fitur</p>
            <h2>Semua kebutuhan listing properti</h2>
            <p className="lede">
              Dari publikasi listing sampai komunikasi dengan calon pembeli, semua endpoint Pyramid
              sudah disiapkan. Tinggal hubungkan komponen React.
            </p>
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
            <p className="eyebrow">Preview listings</p>
            <h2>Contoh data dummy untuk UI</h2>
            <p className="lede">
              Nanti ganti dengan data dari endpoint <code>/api/properties</code>.
            </p>
          </div>
          <div className="property-grid">
            {sampleProperties.map((property, idx) => (
              <PropertyCard key={property.id} property={property} favorite={idx === 0} />
            ))}
          </div>
        </section>

        <section className="workflow" id="dashboard">
          <div className="workflow__card">
            <h3>Untuk buyer</h3>
            <ol>
              <li>Register/login buyer</li>
              <li>Browse, search, filter properti</li>
              <li>Simpan favorit & kirim inquiry</li>
            </ol>
          </div>
          <div className="workflow__card">
            <h3>Untuk agent</h3>
            <ol>
              <li>Login agent</li>
              <li>Tambah/update/hapus listing + foto</li>
              <li>Kelola inquiries di dashboard</li>
            </ol>
          </div>
          <div className="workflow__card workflow__card--cta">
            <h3>Mulai bangun UI</h3>
            <p>Hook ke API Pyramid, tambahkan router, dan sambungkan state auth.</p>
            <div className="cta-row">
              <a className="btn primary" href="#features">
                Lihat fitur
              </a>
              <a className="btn ghost" href="#properties">
                Lihat listing
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default App;

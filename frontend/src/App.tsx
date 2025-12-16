import { useEffect, useMemo, useState } from 'react';

type ApiStatus = 'idle' | 'ok' | 'error';

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
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Pengembangan Aplikasi Web</p>
        <h1>React + Vite frontend siap untuk backend Pyramid</h1>
        <p className="lede">
          Jalankan backend di <code>http://localhost:6543</code>, start dev server ini, lalu mulai
          bangun komponen UI.
        </p>
        <div className="status">
          <span className={`dot ${apiStatus}`} />
          <span>
            {apiStatus === 'idle' && 'Mengecek backend...'}
            {apiStatus === 'ok' && 'Backend terhubung'}
            {apiStatus === 'error' && 'Backend tidak terhubung'}
          </span>
        </div>
        {message && <p className="status-detail">{message}</p>}
      </header>

      <section className="card-grid">
        <article className="card">
          <h2>Langkah jalan dev</h2>
          <ol>
            <li>Backend: <code>cd backend/myapp; python -m venv .venv; .venv\\Scripts\\activate</code></li>
            <li>Backend: <code>pip install -r requirements.txt && pip install -e .</code></li>
            <li>Backend: set env <code>MYAPP_SECRET_KEY</code> dan jalankan <code>pserve development.ini --reload</code>.</li>
            <li>Frontend: <code>cd frontend</code> lalu <code>npm run dev</code>.</li>
          </ol>
        </article>

        <article className="card">
          <h2>Konfigurasi API</h2>
          <p>
            Ubah base URL di <code>.env</code>:
          </p>
          <pre className="code-block">VITE_API_BASE=http://localhost:6543</pre>
          <p>
            Semua request <code>/api</code> akan otomatis di-proxy ke backend ketika mode dev
            berjalan.
          </p>
        </article>
      </section>
    </main>
  );
}

export default App;

import { useCompare } from '../context/CompareContext';
import SectionHeader from '../components/SectionHeader';

const formatPrice = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function ComparePage() {
  const { items, clear } = useCompare();
  const ready = items.length >= 2;
  return (
    <main className="section space-y-4">
      <div className="flex items-center justify-between">
        <SectionHeader title="Perbandingan Properti" subtitle="Pilih hingga 4 properti untuk dibandingkan." />
        {items.length > 0 && (
          <button className="btn btn-ghost" onClick={clear}>Bersihkan</button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-slate-600">Belum ada properti untuk dibandingkan.</p>
      ) : ready ? (
        <div className="overflow-auto">
          <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-800">
              <tr>
                <th className="px-3 py-2 text-left">Atribut</th>
                {items.map((p) => (
                  <th key={p.id} className="px-3 py-2 text-left">
                    <span>{p.title}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {[
                { label: 'Harga', key: 'price', formatter: formatPrice },
                { label: 'Tipe', key: 'type' },
                { label: 'Lokasi', key: 'location' },
                { label: 'Kamar Tidur', key: 'bedrooms' },
                { label: 'Kamar Mandi', key: 'bathrooms' },
                { label: 'Luas (sqm)', key: 'area' },
                { label: 'Deskripsi', key: 'description' },
              ].map((row) => (
                <tr key={row.key}>
                  <td className="px-3 py-2 font-semibold text-slate-800">{row.label}</td>
                  {items.map((p) => (
                    <td key={`${row.key}-${p.id}`} className="px-3 py-2 text-slate-700 align-top">
                      {row.formatter ? row.formatter(p[row.key]) : p[row.key] ?? '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-slate-600">Tambahkan minimal 2 properti untuk tabel komparasi.</p>
      )}
    </main>
  );
}

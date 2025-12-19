# Pengembangan Aplikasi Web – Pyramid + React

Aplikasi web full‑stack untuk listing properti dengan backend Pyramid (PostgreSQL/SQLAlchemy) dan frontend React + Tailwind. Fitur utama:
- Auth buyer/agent (JWT), profil.
- CRUD properti (agent), upload foto.
- Inquiry (buyer ke agent), favorit (buyer).
- Compare sampai 4 properti (frontend state).
- Dashboard agent/buyer, halaman detail, toast notifikasi, FontAwesome icons.

## Struktur Proyek
```
backend/    # Pyramid API
frontend/   # React + Vite + Tailwind
```

## Persiapan Backend
1) Masuk folder backend & siapkan venv:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -e .
   ```
2) Konfigurasi `development.ini` (koneksi DB PostgreSQL). Pastikan DB berjalan.
3) Migrasi dan seed:
   ```bash
   alembic -c development.ini upgrade head
   python seed.py
   ```
   Seeder menambahkan akun contoh dan data awal (lihat di bawah).
4) Jalankan server:
   ```bash
   pserve development.ini --reload
   ```
   API default di `http://localhost:6543`.

## Persiapan Frontend
1) Masuk folder frontend & install deps:
   ```bash
   cd frontend
   npm install
   ```
2) Jalankan dev server:
   ```bash
   npm run dev
   ```
   Buka URL yang ditampilkan (biasanya `http://localhost:5173`).

## Akun & Data Seeder
- Buyer seed: `buyer@example.com` / `password123`
- Agent seed: `agent@example.com` / `password123`
- Contoh properti dibuat di seed (cek `backend/seed.py`), sehingga listing awal dan pengujian CRUD/inquiry/favorit bisa langsung dilakukan.

## Endpoint Utama (Pyramid)
- Auth: `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`, `PUT /api/auth/profile`
- Properti: `GET /api/properties`, `GET /api/properties/detail/{id}`, `POST /api/properties/create`, `PUT /api/properties/update/{id}`, `DELETE /api/properties/delete/{id}`
- Foto properti: `POST /api/properties/photos-add/{id}`, `DELETE /api/properties/photos-delete/{photo_id}`
- Inquiry: `GET /api/inquiries`, `POST /api/inquiries/create`, `DELETE /api/inquiries/delete/{id}`
- Favorit: `GET /api/favorites`, `POST /api/favorites/add`, `DELETE /api/favorites/remove/{property_id}`

## Alur Penggunaan
1) Login sebagai buyer atau agent (gunakan seed atau daftar baru).
2) Agent: kelola properti di dashboard /agent (buat/update/delete, hanya properti milik agent).
3) Buyer: kirim inquiry, simpan favorit, dan lihat di dashboard /buyer. Compare hingga 4 properti via tombol compare pada kartu/detail, lihat di /compare.
4) Detail halaman properti: favorite/inquiry/compare dengan kontrol akses login; compare tetap tersedia.

## Catatan
- Compare disimpan di localStorage (maks 4 item) via CompareContext.
- Auth state disimpan di localStorage (token + user).
- Toast global untuk feedback aksi (sukses/error).

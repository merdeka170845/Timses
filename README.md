# Tim Sukses Final

Versi ini mengikuti arahan final:
- React + Vite
- tema hitam / putih / #f6f6f6
- header lebih putih saat discroll
- tanpa background hero yang mengganggu
- hanya fokus ke profil
- nama dan jumlah anggota tidak tampil di publik
- tombol Admin tetap ada
- password admin disembunyikan dari publik
- menu mobile bisa ditutup normal
- password default tetap bisa dipakai di semua device
- password baru yang diganti dari panel admin berlaku lokal di browser admin

Deploy:
npm install
npm run build


## Sinkron GitHub + Vercel + Supabase

Project ini sekarang tetap memakai tampilan yang sama, tetapi penyimpanan konten bisa disinkronkan ke Supabase agar hasil edit admin terlihat oleh semua user.

### 1) Supabase
- Buat project Supabase.
- Buka SQL Editor, lalu jalankan isi file `supabase-setup.sql`.
- Ambil `Project URL` dan `anon public key`.

### 2) Environment di Vercel
Tambahkan 2 environment variable:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Nilainya bisa dilihat dari file `.env.example`.

### 3) GitHub
- Push project ini ke repository GitHub.
- Import repository tersebut ke Vercel.
- Set environment variables yang sama di Vercel, lalu redeploy.

### Catatan
- Jika environment Supabase belum diisi, website tetap jalan dengan fallback lokal seperti sebelumnya.
- Jika Supabase aktif, perubahan dari panel admin akan tersimpan ke database dan bisa dibaca user lain.

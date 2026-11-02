# Complete Mulia

Website Toko Mas Complete Mulia (Arjawinangun, Cirebon), dibuat dengan React + Vite.

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:5173.

## Build produksi

```bash
npm run build
```

Hasilnya ada di folder `dist/`.

## Struktur

- `src/data.js` — data toko, produk, promo, dan harga emas. Isi `GOLD_PRICES` untuk menampilkan harga per gram.
- `src/pages/` — halaman Beranda, Produk, Detail Produk, Promo, Kontak, Wishlist.
- `src/components/RingStage.jsx` dan `src/three/goldRing.js` — cincin emas 3D di beranda (three.js, dimuat terpisah).
- `src/styles.css` — semua gaya; warna mengikuti completemulia.co.id (#EBC71A dan #2F1A37).

Foto produk dan banner masih diambil dari server completemulia.co.id.

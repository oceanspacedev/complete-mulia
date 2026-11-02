import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section">
      <div className="container empty">
        <h1>Halaman tidak ditemukan</h1>
        <p>Halaman yang kamu cari mungkin sudah dipindahkan.</p>
        <Link to="/" className="btn btn--dark">Kembali ke beranda</Link>
      </div>
    </section>
  )
}

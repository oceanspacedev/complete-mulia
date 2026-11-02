import { Link, useParams } from 'react-router-dom'
import { CATEGORIES, PRODUCTS, STORE, waLink } from '../data.js'
import { useWishlist } from '../wishlist.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { Heart, WhatsApp } from '../components/Icons.jsx'
import NotFound from './NotFound.jsx'

export default function ProductDetail() {
  const { slug } = useParams()
  const { has, toggle } = useWishlist()
  const product = PRODUCTS.find((p) => p.slug === slug)
  if (!product) return <NotFound />

  const cat = CATEGORIES.find((c) => c.slug === product.category)
  const related = PRODUCTS.filter((p) => p.category === product.category && p.slug !== slug).slice(0, 4)
  const saved = has(slug)
  const message = `Halo kak, saya tertarik dengan ${product.name} di website Complete Mulia. Berapa harga hari ini dan apakah ready?`

  return (
    <div className="container shop">
      <nav className="crumbs"><Link to="/">Beranda</Link> / <Link to={`/koleksi/${cat.slug}`}>{cat.name}</Link> / {product.name}</nav>

      <div className="pdp">
        <div className="pdp__media">
          <img src={product.image.replace('-480x480', '')} alt={product.name} onError={(e) => { e.currentTarget.src = product.image }} />
        </div>

        <div className="pdp__info">
          <span className="pdp__cat">{cat.name}</span>
          <h1>{product.name}</h1>

          <div className="pdp__price">
            <span>Harga</span>
            <strong>Ikut harga pasar hari ini</strong>
            <small>Harga mengikuti harga emas hari ini dan berat barang. Hubungi admin untuk harga pasti.</small>
          </div>

          <table className="specs">
            <tbody>
              <tr><th>Kategori</th><td>{cat.name}</td></tr>
              <tr><th>Kadar</th><td>{product.karat ?? '-'}</td></tr>
              <tr><th>Batu</th><td>{product.stone ? 'Mata putih' : 'Tanpa batu'}</td></tr>
              <tr><th>Berat</th><td>Lihat foto / tanya admin</td></tr>
              <tr><th>Pembayaran</th><td>Bisa COD (bayar di tempat)</td></tr>
            </tbody>
          </table>

          <div className="pdp__actions">
            <a href={waLink(message)} target="_blank" rel="noreferrer" className="btn btn--wa btn--lg">
              <WhatsApp width={20} /> Pesan via WhatsApp
            </a>
            <button className={`btn btn--outline btn--lg ${saved ? 'is-on' : ''}`} onClick={() => toggle(slug)} aria-pressed={saved}>
              <Heart filled={saved} width={18} /> {saved ? 'Tersimpan' : 'Wishlist'}
            </button>
          </div>

          <p className="pdp__markets">
            Juga tersedia di{' '}
            {STORE.marketplaces.map((m, i) => (
              <span key={m.name}>{i > 0 && ' dan '}<a href={m.href} target="_blank" rel="noreferrer">{m.name}</a></span>
            ))}
          </p>

          <div className="pdp__store">
            <strong>Mau lihat barangnya langsung?</strong>
            <p>Datang ke toko: {STORE.address}. Buka {STORE.hours}.</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section__head"><h2 className="title">{cat.name} lainnya</h2><Link to={`/koleksi/${cat.slug}`} className="link">Lihat semua</Link></div>
          <div className="grid-products grid-products--4">
            {related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  )
}

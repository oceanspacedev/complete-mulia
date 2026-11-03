import { Link, useParams } from 'react-router-dom'
import { CATEGORIES, PRODUCTS, STORE, waLink } from '../data.js'
import { useWishlist } from '../wishlist.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { Heart, WhatsApp } from '../components/Icons.jsx'
import RingSizeGuide from '../components/RingSizeGuide.jsx'
import NotFound from './NotFound.jsx'

export default function ProductDetail() {
  const { slug } = useParams()
  const { has, toggle } = useWishlist()
  const product = PRODUCTS.find((p) => p.slug === slug)
  if (!product) return <NotFound />

  // A few Shopee pieces (sets, pins) fit no category; they still live under "Produk".
  const cat = CATEGORIES.find((c) => c.slug === product.category) ?? { slug: '', name: 'Lainnya' }
  const catLink = cat.slug ? `/koleksi/${cat.slug}` : '/koleksi'
  const related = PRODUCTS.filter((p) => p.category === product.category && p.slug !== slug).slice(0, 4)
  const saved = has(slug)
  const url = `${window.location.origin}/produk/${slug}`
  // Names usually already end in the karat ("... 8K"); only add it when they don't.
  const label = product.karat && !product.name.includes(product.karat) ? `${product.name} (${product.karat})` : product.name
  const askMessage = `Halo kak, saya mau tanya ${label} di website Complete Mulia:\n${url}\n\nBerapa harga hari ini dan apakah ready?`
  const customMessage = `Halo kak, saya mau pesan custom dengan model seperti ${label}:\n${url}\n\nBisa dibantu untuk ukuran, kadar, dan harganya?`

  return (
    <div className="container shop">
      <nav className="crumbs"><Link to="/">Beranda</Link> / <Link to={catLink}>{cat.name}</Link> / {product.name}</nav>

      <div className="pdp">
        <div className="pdp__media">
          <img src={product.full} alt={product.name} onError={(e) => { e.currentTarget.src = product.image }} />
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
              <tr><th>Batu</th><td>{product.stone ?? 'Tanpa batu'}</td></tr>
              <tr><th>Pengambilan</th><td>Ambil di toko atau dikirim (bisa COD)</td></tr>
            </tbody>
          </table>

          <div className="pdp__actions">
            <a href={waLink(askMessage)} target="_blank" rel="noreferrer" className="btn btn--wa btn--lg btn--block">
              <WhatsApp width={20} /> Tanyakan produk ini
            </a>
            <a href={waLink(customMessage)} target="_blank" rel="noreferrer" className="btn btn--outline btn--lg pdp__custom">
              Pesan custom seperti ini
            </a>
            <button
              className={`btn btn--outline btn--lg pdp__fav ${saved ? 'is-on' : ''}`}
              onClick={() => toggle(slug)}
              aria-pressed={saved}
              aria-label={saved ? 'Hapus dari wishlist' : 'Simpan ke wishlist'}
            >
              <Heart filled={saved} width={18} />
            </button>
          </div>

          {product.category === 'cincin' && <RingSizeGuide productName={label} />}

          {product.shopee ? (
            <p className="pdp__markets">
              Bisa juga dibeli di <a href={product.shopee} target="_blank" rel="noreferrer">Shopee</a> (tetap tanya stok dulu ke admin)
            </p>
          ) : (
            <p className="pdp__markets">
              Juga tersedia di{' '}
              {STORE.marketplaces.map((m, i) => (
                <span key={m.name}>{i > 0 && ' dan '}<a href={m.href} target="_blank" rel="noreferrer">{m.name}</a></span>
              ))}
            </p>
          )}

          <div className="pdp__store">
            <strong>Mau lihat barangnya langsung?</strong>
            <p>Datang ke toko: {STORE.address}. Buka {STORE.hours}.</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section__head"><h2 className="title">{cat.name} lainnya</h2><Link to={catLink} className="link">Lihat semua</Link></div>
          <div className="grid-products grid-products--4">
            {related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  )
}

import { Link } from 'react-router-dom'
import { PRODUCTS, waLink } from '../data.js'
import { useWishlist } from '../wishlist.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { WhatsApp } from '../components/Icons.jsx'

export default function Wishlist() {
  const { items } = useWishlist()
  const list = PRODUCTS.filter((p) => items.includes(p.slug))
  const message = `Halo kak, saya ingin tanya harga untuk produk berikut:\n${list.map((p) => `- ${p.name}`).join('\n')}`

  return (
    <div className="container page">
      <nav className="crumbs"><Link to="/">Beranda</Link> / Wishlist</nav>

      <div className="shop__head">
        <div>
          <h1>Wishlist</h1>
          <span>{list.length} produk tersimpan</span>
        </div>
        {list.length > 0 && (
          <a href={waLink(message)} target="_blank" rel="noreferrer" className="btn btn--wa">
            <WhatsApp width={18} /> Tanya harga semua
          </a>
        )}
      </div>

      {list.length ? (
        <div className="grid-products grid-products--4">
          {list.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      ) : (
        <div className="empty">
          <p>Belum ada produk di wishlist. Tekan ikon hati pada produk untuk menyimpannya.</p>
          <Link to="/koleksi" className="btn btn--primary">Lihat Produk</Link>
        </div>
      )}
    </div>
  )
}

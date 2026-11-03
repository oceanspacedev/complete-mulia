import { Link } from 'react-router-dom'
import { PRODUCTS, waLink } from '../data.js'
import { useWishlist } from '../wishlist.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { Heart, WhatsApp } from '../components/Icons.jsx'

// Shown when the wishlist is empty, so there is something to start saving from.
const SUGGESTIONS = PRODUCTS.filter((p) => p.bestSeller).slice(0, 4)

export default function Wishlist() {
  const { items, clear } = useWishlist()
  const list = PRODUCTS.filter((p) => items.includes(p.slug))

  // Each product carries its link so admin can see exactly which piece is meant.
  const lines = list.map((p) => `- ${p.name}\n  ${window.location.origin}/produk/${p.slug}`)
  const message = `Halo kak, saya ingin tanya harga dan stok untuk produk berikut:\n${lines.join('\n')}`

  const clearAll = () => {
    if (window.confirm('Hapus semua produk dari wishlist?')) clear()
  }

  return (
    <div className="container page">
      <nav className="crumbs"><Link to="/">Beranda</Link> / Wishlist</nav>

      <div className="shop__head">
        <div>
          <h1>Wishlist</h1>
          <span>{list.length} produk tersimpan</span>
          <p className="wish__note">
            Tersimpan di perangkat ini
            {list.length > 0 && <> · <button type="button" onClick={clearAll}>Hapus semua</button></>}
          </p>
        </div>
        {list.length > 0 && (
          <a href={waLink(message)} target="_blank" rel="noreferrer" className="btn btn--wa">
            <WhatsApp width={18} /> Tanya harga &amp; stok
          </a>
        )}
      </div>

      {list.length ? (
        <div className="grid-products grid-products--4">
          {list.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      ) : (
        <>
          <div className="empty">
            <Heart width={34} height={34} className="empty__icon" />
            <p>Belum ada produk di wishlist. Tekan ikon hati pada produk untuk menyimpannya.</p>
            <Link to="/koleksi" className="btn btn--primary">Lihat Produk</Link>
          </div>
          <h2 className="title wish__suggest">Paling banyak dicari</h2>
          <div className="grid-products grid-products--4">
            {SUGGESTIONS.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
          </div>
        </>
      )}
    </div>
  )
}

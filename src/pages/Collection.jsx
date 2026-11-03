import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useParams, useSearchParams } from 'react-router-dom'
import { CATEGORIES, PRODUCTS, STORE, waLink } from '../data.js'
import ProductCard from '../components/ProductCard.jsx'
import { Search, WhatsApp } from '../components/Icons.jsx'

// The catalog has hundreds of pieces, so cards are added a page at a time.
const PAGE = 24

export default function Collection() {
  const { category } = useParams()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const current = CATEGORIES.find((c) => c.slug === category)
  const [shown, setShown] = useState(PAGE)

  const list = useMemo(() => {
    const needle = q.toLowerCase()
    return PRODUCTS.filter((p) => (!category || p.category === category) && (!needle || p.name.toLowerCase().includes(needle)))
  }, [category, q])

  useEffect(() => setShown(PAGE), [category, q])

  const setQuery = (value) => {
    const next = new URLSearchParams(params)
    value ? next.set('q', value) : next.delete('q')
    setParams(next, { replace: true })
  }
  // Keep the search term when switching category tabs.
  const tabLink = (slug) => `/koleksi${slug ? `/${slug}` : ''}${q ? `?q=${encodeURIComponent(q)}` : ''}`

  return (
    <div className="container page">
      <nav className="crumbs"><Link to="/">Beranda</Link> / <Link to="/koleksi">Produk</Link>{current && <> / {current.name}</>}</nav>

      <div className="catalog__head">
        <div>
          <h1 className="page__title">{current ? current.name : 'Produk'}</h1>
          <p className="catalog__note">Harga mengikuti harga emas hari ini. Tanyakan harga pasti lewat WhatsApp.</p>
        </div>
        <label className="field field--search">
          <Search width={16} />
          <input value={q} onChange={(e) => setQuery(e.target.value)} placeholder="Cari model…" aria-label="Cari produk" />
        </label>
      </div>

      <nav className="catalog__tabs" aria-label="Kategori">
        <NavLink to={tabLink()} end>Semua <span>{PRODUCTS.length}</span></NavLink>
        {CATEGORIES.map((c) => (
          <NavLink key={c.slug} to={tabLink(c.slug)}>
            {c.name} <span>{PRODUCTS.filter((p) => p.category === c.slug).length}</span>
          </NavLink>
        ))}
      </nav>

      {list.length ? (
        <>
          <div className="grid-products grid-products--4">
            {list.slice(0, shown).map((p, i) => <ProductCard key={p.slug} product={p} index={i % PAGE} />)}
          </div>
          {shown < list.length && (
            <div className="catalog__paging">
              <p>Menampilkan {shown} dari {list.length} model</p>
              <button type="button" className="btn btn--outline" onClick={() => setShown((n) => n + PAGE)}>Tampilkan lebih banyak</button>
            </div>
          )}
        </>
      ) : (
        <div className="empty">
          <p>Model “{q}” belum ada di website. Koleksi di toko lebih banyak, tanyakan ke admin.</p>
        </div>
      )}

      <aside className="catalog__more">
        <div>
          <h2>Koleksi di toko jauh lebih banyak</h2>
          <p>Yang tampil di sini baru sebagian. Tanyakan model yang kamu cari, atau lihat koleksi kami di marketplace.</p>
        </div>
        <div className="catalog__more-actions">
          <a href={waLink('Halo kak, saya cari model perhiasan yang tidak ada di website.')} target="_blank" rel="noreferrer" className="btn btn--wa">
            <WhatsApp width={18} /> Tanya Admin
          </a>
          {STORE.marketplaces.map((m) => (
            <a key={m.name} href={m.href} target="_blank" rel="noreferrer" className="btn btn--outline">{m.name}</a>
          ))}
        </div>
      </aside>
    </div>
  )
}

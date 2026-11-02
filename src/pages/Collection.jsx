import { useMemo, useState } from 'react'
import { Link, NavLink, useParams, useSearchParams } from 'react-router-dom'
import { CATEGORIES, PRODUCTS, waLink } from '../data.js'
import ProductCard from '../components/ProductCard.jsx'
import { Search } from '../components/Icons.jsx'

const SORTS = {
  popular: { label: 'Terlaris', fn: (a, b) => b.bestSeller - a.bestSeller },
  az: { label: 'Nama A–Z', fn: (a, b) => a.name.localeCompare(b.name) },
  za: { label: 'Nama Z–A', fn: (a, b) => b.name.localeCompare(a.name) },
}
const KARATS = ['6K', '8K', '9K']

export default function Collection() {
  const { category } = useParams()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [karats, setKarats] = useState([])
  const [sort, setSort] = useState('popular')
  const current = CATEGORIES.find((c) => c.slug === category)

  const list = useMemo(() => {
    const needle = q.toLowerCase()
    return PRODUCTS.filter((p) => !category || p.category === category)
      .filter((p) => !karats.length || karats.includes(p.karat))
      .filter((p) => !needle || p.name.toLowerCase().includes(needle))
      .sort(SORTS[sort].fn)
  }, [category, karats, q, sort])

  const setQuery = (value) => {
    const next = new URLSearchParams(params)
    value ? next.set('q', value) : next.delete('q')
    setParams(next, { replace: true })
  }
  const toggleKarat = (k) => setKarats((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]))

  return (
    <div className="container shop">
      <nav className="crumbs"><Link to="/">Beranda</Link> / <Link to="/koleksi">Produk</Link>{current && <> / {current.name}</>}</nav>

      <div className="shop__layout">
        <aside className="filters">
          <div className="filters__box">
            <h3>Kategori</h3>
            <ul>
              <li><NavLink to="/koleksi" end>Semua Produk <span>{PRODUCTS.length}</span></NavLink></li>
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <NavLink to={`/koleksi/${c.slug}`}>{c.name} <span>{PRODUCTS.filter((p) => p.category === c.slug).length}</span></NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="filters__box">
            <h3>Kadar</h3>
            {KARATS.map((k) => (
              <label key={k} className="check">
                <input type="checkbox" checked={karats.includes(k)} onChange={() => toggleKarat(k)} /> Emas {k}
              </label>
            ))}
          </div>
          <p className="filters__help">
            Koleksi di toko lebih banyak.{' '}
            <a href={waLink('Halo kak, saya cari model perhiasan yang tidak ada di website.')} target="_blank" rel="noreferrer">Tanya admin</a>
          </p>
        </aside>

        <div className="shop__main">
          <div className="shop__head">
            <div>
              <h1>{current ? current.name : 'Semua Produk'}</h1>
              <span>{list.length} produk</span>
            </div>
            <div className="shop__tools">
              <label className="field field--search">
                <Search width={16} />
                <input value={q} onChange={(e) => setQuery(e.target.value)} placeholder="Cari di sini…" aria-label="Cari produk" />
              </label>
              <label className="field">
                Urutkan
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
                </select>
              </label>
            </div>
          </div>

          <div className="chips">
            <NavLink to="/koleksi" end className="chip">Semua</NavLink>
            {CATEGORIES.map((c) => <NavLink key={c.slug} to={`/koleksi/${c.slug}`} className="chip">{c.name}</NavLink>)}
          </div>

          {list.length ? (
            <div className="grid-products grid-products--3">
              {list.map((p, i) => <ProductCard key={p.slug} product={p} index={i} columns={3} />)}
            </div>
          ) : (
            <div className="empty">
              <p>Produk tidak ditemukan. Coba kata kunci lain atau tanya admin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

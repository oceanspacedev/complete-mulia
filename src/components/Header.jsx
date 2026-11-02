import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { CATEGORIES, STORE, waLink } from '../data.js'
import { useWishlist } from '../wishlist.jsx'
import { Close, Heart, Menu, Search, WhatsApp } from './Icons.jsx'

const MENU = [
  { to: '/', label: 'Beranda' },
  { to: '/koleksi', label: 'Produk' },
  { to: '/kabar-terbaru', label: 'Promo' },
  { to: '/kontak-kami', label: 'Kontak' },
]

function isActive(item, { pathname }) {
  return item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)
}

export default function Header({ overlay = false }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const { items } = useWishlist()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => setOpen(false), [location.pathname, location.hash])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    navigate(`/koleksi?q=${encodeURIComponent(q.trim())}`)
    setQ('')
  }

  // On the homepage the header sits transparent over the opening scene until the visitor scrolls.
  const transparent = overlay && !scrolled && !open

  return (
    <header className={`header ${transparent ? 'header--overlay' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header__main">
        <button className="header__burger" onClick={() => setOpen(true)} aria-label="Buka menu">
          <Menu />
        </button>
        <Link to="/" className="header__logo" aria-label="Complete Mulia — Beranda">
          <img src={STORE.logo} alt="" />
          <span>
            <small>Toko Mas</small>
            <strong>Complete Mulia</strong>
          </span>
        </Link>
        <nav className="header__nav" aria-label="Menu utama">
          {MENU.map((m) => (
            <Link key={m.to} to={m.to} className={isActive(m, location) ? 'active' : ''}>{m.label}</Link>
          ))}
        </nav>
        <div className="header__actions">
          <form className="header__search" onSubmit={submit} role="search">
            <Search width={16} height={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari perhiasan" aria-label="Cari produk" />
          </form>
          <Link to="/wishlist" className="header__wish" aria-label={`Wishlist, ${items.length} produk`}>
            <Heart width={21} height={21} />
            {items.length > 0 && <span>{items.length}</span>}
          </Link>
        </div>
      </div>

      <div className={`drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="drawer__backdrop" onClick={() => setOpen(false)} />
        <aside className="drawer__panel">
          <div className="drawer__head">
            <strong>Menu</strong>
            <button onClick={() => setOpen(false)} aria-label="Tutup menu"><Close /></button>
          </div>
          <form className="drawer__search" onSubmit={submit} role="search">
            <Search width={16} height={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari perhiasan" aria-label="Cari produk" />
          </form>
          <nav className="drawer__nav">
            {MENU.map((m) => (
              <Link key={m.to} to={m.to} className={isActive(m, location) ? 'active' : ''}>{m.label}</Link>
            ))}
            <NavLink to="/wishlist">Wishlist ({items.length})</NavLink>
          </nav>
          <p className="drawer__label">Kategori</p>
          <nav className="drawer__cats">
            {CATEGORIES.map((c) => (
              <NavLink key={c.slug} to={`/koleksi/${c.slug}`}>{c.name}</NavLink>
            ))}
          </nav>
          <div className="drawer__foot">
            <p>{STORE.hours}</p>
            <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn--wa btn--block"><WhatsApp width={18} /> Chat Admin</a>
          </div>
        </aside>
      </div>
    </header>
  )
}

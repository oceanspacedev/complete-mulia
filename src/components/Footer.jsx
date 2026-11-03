import { Link } from 'react-router-dom'
import { CATEGORIES, STORE, waLink } from '../data.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <strong>Toko Mas Complete Mulia</strong>
          <p>{STORE.address}</p>
          <p>Buka {STORE.hours}</p>
        </div>
        <div>
          <h4>Kategori</h4>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c.slug}><Link to={`/koleksi/${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Informasi</h4>
          <ul>
            <li><Link to="/kabar-terbaru">Promo &amp; Kabar</Link></li>
            <li><Link to="/kontak-kami">Kontak</Link></li>
          </ul>
        </div>
        <div>
          <h4>Hubungi</h4>
          <ul>
            <li><a href={waLink()} target="_blank" rel="noreferrer">WhatsApp {STORE.phone}</a></li>
            <li><a href={`mailto:${STORE.email}`}>{STORE.email}</a></li>
            {STORE.marketplaces.map((m) => (
              <li key={m.name}><a href={m.href} target="_blank" rel="noreferrer">{m.name}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer__bottom">© 2021–{new Date().getFullYear()} Toko Mas Complete Mulia. All rights reserved.</div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import { STORE, waLink } from '../data.js'
import ConsultForm from '../components/ConsultForm.jsx'
import { Phone, Pin, WhatsApp } from '../components/Icons.jsx'

export default function Contact() {
  return (
    <div className="container page">
      <nav className="crumbs"><Link to="/">Beranda</Link> / Kontak</nav>
      <h1 className="page__title">Kontak</h1>
      <p className="page__lead">Tanya harga, cek stok, atau pesan custom. Paling cepat lewat WhatsApp.</p>

      {/* Quick contact comes first so it is at the top on phones; the form follows. */}
      <div className="contact">
        <div>
          <h2 className="title">Informasi</h2>
          <dl className="info">
            <div>
              <dt>WhatsApp &amp; Telepon</dt>
              <dd>
                {STORE.phone}
                <span className="info__actions">
                  <a href={waLink()} target="_blank" rel="noreferrer" className="chip chip--wa"><WhatsApp width={15} /> Chat WA</a>
                  <a href={`tel:+${STORE.phoneRaw}`} className="chip"><Phone width={15} /> Telepon</a>
                </span>
              </dd>
            </div>
            <div><dt>Jam buka</dt><dd>{STORE.hours}</dd></div>
            <div><dt>Alamat</dt><dd>{STORE.address}</dd></div>
            <div><dt>E-mail</dt><dd><a href={`mailto:${STORE.email}`}>{STORE.email}</a></dd></div>
          </dl>
          <iframe className="map map--sm" title="Peta Toko Mas Complete Mulia" src={STORE.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <a href={STORE.mapsLink} target="_blank" rel="noreferrer" className="btn btn--gold btn--block contact__directions"><Pin width={17} /> Petunjuk arah</a>
        </div>

        <div>
          <h2 className="title">Konsultasi &amp; Pesan</h2>
          <ConsultForm />
        </div>
      </div>

      <div className="contact-links">
        <div>
          <h3>Media sosial</h3>
          <ul>
            {STORE.socials.map((s) => (
              <li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.label} {s.handle}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Belanja online</h3>
          <ul>
            {STORE.marketplaces.map((m) => (
              <li key={m.name}><a href={m.href} target="_blank" rel="noreferrer">{m.name}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

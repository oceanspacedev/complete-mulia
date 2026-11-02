import { useState } from 'react'
import { Link } from 'react-router-dom'
import { STORE, waLink } from '../data.js'
import { WhatsApp } from '../components/Icons.jsx'

export default function Contact() {
  const [form, setForm] = useState({ name: '', topic: 'Tanya harga', message: '' })
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  // The form composes a WhatsApp message instead of posting anywhere.
  const submit = (e) => {
    e.preventDefault()
    const text = `Halo kak, saya ${form.name}.\nPerihal: ${form.topic}\n\n${form.message}`
    window.open(waLink(text), '_blank', 'noopener')
  }

  return (
    <div className="container page">
      <nav className="crumbs"><Link to="/">Beranda</Link> / Kontak</nav>
      <h1 className="page__title">Kontak</h1>
      <p className="page__lead">Tanya harga, cek stok, atau pesan custom. Paling cepat lewat WhatsApp.</p>

      <div className="contact">
        <div>
          <h2 className="title">Informasi</h2>
          <dl className="info">
            <div><dt>WhatsApp</dt><dd><a href={waLink()} target="_blank" rel="noreferrer">{STORE.phone}</a></dd></div>
            <div><dt>Telepon</dt><dd><a href={`tel:+${STORE.phoneRaw}`}>{STORE.phone}</a></dd></div>
            <div><dt>E-mail</dt><dd><a href={`mailto:${STORE.email}`}>{STORE.email}</a></dd></div>
            <div><dt>Jam buka</dt><dd>{STORE.hours}</dd></div>
            <div><dt>Alamat</dt><dd>{STORE.address}</dd></div>
          </dl>
          <iframe className="map map--sm" title="Peta Toko Mas Complete Mulia" src={STORE.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>

        <form className="cform" onSubmit={submit}>
          <h2 className="title">Kirim Pesan</h2>
          <label>
            <span>Nama</span>
            <input required value={form.name} onChange={update('name')} />
          </label>
          <label>
            <span>Perihal</span>
            <select value={form.topic} onChange={update('topic')}>
              <option>Tanya harga</option>
              <option>Cek stok produk</option>
              <option>Pesan perhiasan custom</option>
              <option>Pengiriman / COD</option>
              <option>Lainnya</option>
            </select>
          </label>
          <label>
            <span>Pesan</span>
            <textarea required rows={6} value={form.message} onChange={update('message')} />
          </label>
          <button className="btn btn--wa btn--block" type="submit"><WhatsApp width={18} /> Kirim lewat WhatsApp</button>
          <small className="cform__note">Pesan akan dibuka di aplikasi WhatsApp.</small>
        </form>
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

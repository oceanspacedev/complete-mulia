import { useState } from 'react'
import { waLink } from '../data.js'
import { WhatsApp } from './Icons.jsx'

const TYPES = ['Cincin kawin', 'Cincin', 'Gelang', 'Kalung', 'Kalung nama', 'Liontin', 'Anting', 'Lainnya']
const KARATS = ['6K', '8K', '9K', 'Belum tahu']
const DELIVERY = ['Ambil di toko', 'Kirim ke rumah (COD)']

// Collects the details admin usually has to ask for, then opens WhatsApp with them as one message.
export default function ConsultForm() {
  const [form, setForm] = useState({ name: '', type: TYPES[0], karat: KARATS[3], size: '', delivery: DELIVERY[0], note: '' })
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const details = [
      `Jenis: ${form.type}`,
      `Kadar: ${form.karat}`,
      form.size.trim() && `Ukuran: ${form.size.trim()}`,
      `Pengambilan: ${form.delivery}`,
      form.note.trim() && `Catatan: ${form.note.trim()}`,
    ].filter(Boolean)
    const message = `Halo kak, saya ${form.name.trim()}, mau konsultasi perhiasan.\n\n${details.join('\n')}`
    window.open(waLink(message), '_blank', 'noopener')
  }

  return (
    <form className="cform consult" onSubmit={submit}>
      <label>
        <span>Nama</span>
        <input required value={form.name} onChange={update('name')} />
      </label>
      <div className="consult__row">
        <label>
          <span>Jenis perhiasan</span>
          <select value={form.type} onChange={update('type')}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label>
          <span>Kadar</span>
          <select value={form.karat} onChange={update('karat')}>
            {KARATS.map((k) => <option key={k}>{k}</option>)}
          </select>
        </label>
      </div>
      <label>
        <span>Ukuran (opsional)</span>
        <input value={form.size} onChange={update('size')} placeholder="Contoh: cincin ukuran 14" />
      </label>
      <fieldset className="consult__choice">
        <legend>Pengambilan</legend>
        {DELIVERY.map((d) => (
          <label key={d} className={form.delivery === d ? 'is-on' : ''}>
            <input type="radio" name="delivery" value={d} checked={form.delivery === d} onChange={update('delivery')} />
            {d}
          </label>
        ))}
      </fieldset>
      <label>
        <span>Catatan</span>
        <textarea rows={3} value={form.note} onChange={update('note')} placeholder="Model yang diinginkan, nama untuk kalung nama, pilihan batu, dll." />
      </label>
      <button className="btn btn--wa btn--block" type="submit"><WhatsApp width={18} /> Kirim lewat WhatsApp</button>
      <small className="cform__note">Foto contoh model bisa dikirim setelah chat WhatsApp terbuka.</small>
    </form>
  )
}

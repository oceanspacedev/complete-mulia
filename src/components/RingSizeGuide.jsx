import { useState } from 'react'
import { waLink } from '../data.js'
import { WhatsApp } from './Icons.jsx'

// Measures the finger in millimetres (not a shop size number), which is what admin needs to match a size.
export default function RingSizeGuide({ productName }) {
  const [circ, setCirc] = useState('')
  const mm = parseFloat(circ.replace(',', '.'))
  const valid = mm >= 35 && mm <= 90
  const diameter = valid ? (mm / Math.PI).toLocaleString('id-ID', { maximumFractionDigits: 1 }) : null
  const message = `Halo kak, saya mau tanya ${productName}. Keliling jari saya ${circ.trim()} mm (diameter sekitar ${diameter} mm), ukuran berapa ya?`

  return (
    <details className="size-guide">
      <summary>Panduan ukuran cincin</summary>
      <ol>
        <li>Lilitkan kertas tipis atau benang di pangkal jari yang akan dipakai cincin.</li>
        <li>Tandai titik pertemuannya, lalu ukur panjangnya dengan penggaris (dalam milimeter).</li>
        <li>Masukkan angkanya di bawah, lalu kirim ke admin untuk dicocokkan dengan ukuran di toko.</li>
      </ol>
      <p className="size-guide__tip">Atau ukur diameter bagian dalam cincin yang pas di jarimu.</p>
      <label className="size-guide__field">
        <span>Keliling jari (mm)</span>
        <input inputMode="decimal" value={circ} onChange={(e) => setCirc(e.target.value)} placeholder="Contoh: 54" />
      </label>
      {valid && <p className="size-guide__result">Diameter jari sekitar <strong>{diameter} mm</strong></p>}
      {circ && !valid && <p className="size-guide__result">Isi keliling jari antara 35 dan 90 mm.</p>}
      {valid && (
        <a href={waLink(message)} target="_blank" rel="noreferrer" className="btn btn--wa btn--sm">
          <WhatsApp width={16} /> Kirim ukuran ke admin
        </a>
      )}
    </details>
  )
}

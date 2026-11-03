import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PRODUCTS, STORE, waLink } from '../data.js'
import RingStage from '../components/RingStage.jsx'
import Reveal from '../components/Reveal.jsx'
import SplitText from '../components/SplitText.jsx'
import ConsultForm from '../components/ConsultForm.jsx'
import { WhatsApp } from '../components/Icons.jsx'

const LINES = [
  { name: 'Classy Gold', href: 'https://www.instagram.com/classygold.cm/' },
  { name: 'Premium Gold', href: 'https://www.instagram.com/premiumgold.cm' },
  { name: 'Luxury Gold', href: 'https://www.instagram.com/luxurygold.cm' },
]

const CUSTOM = [
  ['Jenis perhiasan', 'Cincin kawin, cincin, gelang, kalung, kalung nama, atau liontin'],
  ['Kadar emas', '6K, 8K, atau 9K'],
  ['Batu', 'Mata putih atau batu warna'],
  ['Model', 'Pilih dari katalog atau kirim foto contoh'],
]

const STEPS = [
  ['Chat WhatsApp', 'Ceritakan perhiasan yang kamu mau, atau kirim foto contoh modelnya.'],
  ['Konsultasi', 'Kami bantu pilih ukuran, kadar, dan model. Harga mengikuti harga emas hari itu.'],
  ['Ambil atau dikirim', 'Datang ke toko untuk cek langsung, atau dikirim ke rumah dan bayar di tempat (COD).'],
]

const SAMPLES = [
  'cincin-jejer-mt-pth-lingkar-8k',
  'cincin-simple-batu-merah-8k',
  'gelang-diamond-8k-mt-pth',
  'kalung-infinity-mt-pth-8k',
  'liontin-koin-perempuan-8k',
  'anting-catok-love-mt-pth-8k',
]

// One full-screen chapter of the scroll story. `side` is where the text sits; the ring takes the other side.
function Chapter({ id, side = 'left', label, children }) {
  return (
    <section id={id} className={`op op--${side}`} data-scene>
      <Reveal className="op__content">
        {label && <span className="op__label"><SplitText text={label} /></span>}
        {children}
      </Reveal>
    </section>
  )
}

export default function Home() {
  const { hash } = useLocation()
  const samples = SAMPLES.map((s) => PRODUCTS.find((p) => p.slug === s))

  // Support links like /#tentang-kami.
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60)
  }, [hash])

  return (
    <div className="onepage">
      <RingStage />

      <Chapter label="Toko Mas Complete Mulia">
        <h1 className="op__lead">Konsultasikan cincin &amp; gelang impianmu</h1>
        <p>Tanya model, harga, atau pesan custom lewat WhatsApp. Ambil di toko atau dikirim ke rumah.</p>
        <div className="op__btns">
          <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn--wa"><WhatsApp width={18} /> Konsultasi via WhatsApp</a>
          <Link to="/koleksi" className="btn btn--outline">Lihat Model</Link>
        </div>
        <p className="op__facts">Harga ikut pasar · Bisa COD · Pengalaman 50+ tahun</p>
      </Chapter>

      <Chapter side="right" label="Bisa Custom">
        <h2>Buat perhiasan sesuai keinginanmu</h2>
        <dl className="op__specs">
          {CUSTOM.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </Chapter>

      <Chapter label="Cara Pesan">
        <ol className="op__steps">
          {STEPS.map(([title, text]) => (
            <li key={title}><strong>{title}</strong><p>{text}</p></li>
          ))}
        </ol>
      </Chapter>

      <Chapter id="konsultasi" side="right" label="Form Konsultasi">
        <ConsultForm />
      </Chapter>

      <Chapter side="center" label="Contoh Model">
        <div className="op__models">
          {samples.map((p) => (
            <Link key={p.slug} to={`/produk/${p.slug}`} className="op__model">
              <img src={p.image} alt="" loading="lazy" />
              <span>{p.name}</span>
            </Link>
          ))}
        </div>
        <Link to="/koleksi" className="btn btn--outline">Lihat Semua Model</Link>
      </Chapter>

      <Chapter id="tentang-kami" label="Tentang Kami">
        <h2>Berdiri sejak Februari 2021</h2>
        <p>
          Didukung pengalaman lebih dari 50 tahun di dunia perhiasan emas, Complete Mulia membuat perhiasan yang berkonsep
          dan punya nilai emosional bagi pemakainya, dengan pelayanan yang hangat seperti ke keluarga sendiri.
        </p>
        <p className="op__links">
          Lini toko kami:{' '}
          {LINES.map((l, i) => (
            <span key={l.name}>{i > 0 && ' · '}<a href={l.href} target="_blank" rel="noreferrer">{l.name}</a></span>
          ))}
        </p>
      </Chapter>

      <Chapter side="right" label="Kunjungi Toko">
        <h2>Datang langsung ke toko</h2>
        <p>{STORE.address}</p>
        <p>Buka {STORE.hours}</p>
        <div className="op__btns">
          <a href={STORE.mapsLink} target="_blank" rel="noreferrer" className="btn btn--gold">Petunjuk Arah</a>
          <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn--outline">Chat Admin</a>
        </div>
      </Chapter>
    </div>
  )
}

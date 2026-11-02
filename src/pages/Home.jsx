import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MISSIONS, STORE, USPS, waLink } from '../data.js'
import PriceBoard from '../components/PriceBoard.jsx'
import RingStage from '../components/RingStage.jsx'
import Reveal from '../components/Reveal.jsx'
import SplitText from '../components/SplitText.jsx'

const LINES = [
  { name: 'Classy Gold', href: 'https://www.instagram.com/classygold.cm/' },
  { name: 'Premium Gold', href: 'https://www.instagram.com/premiumgold.cm' },
  { name: 'Luxury Gold', href: 'https://www.instagram.com/luxurygold.cm' },
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

  // Support links like /#tentang-kami from other pages and the menu.
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60)
  }, [hash])

  return (
    <div className="onepage">
      <RingStage />

      <Chapter label="Toko Mas Complete Mulia">
        <p className="op__lead">Perhiasan emas pilihan di Arjawinangun, Cirebon.</p>
        <span className="op__hint">Gulir ke bawah</span>
      </Chapter>

      <Chapter id="tentang-kami" side="right" label="Tentang Kami">
        <h2>Berdiri sejak Februari 2021</h2>
        <p>
          Didukung pengalaman lebih dari 50 tahun di dunia perhiasan emas, Complete Mulia membuat perhiasan yang berkonsep
          dan punya nilai emosional bagi pemakainya.
        </p>
        <p>Kami melayani dengan hangat, seperti ke keluarga sendiri.</p>
        <p className="op__links">
          Lini toko kami:{' '}
          {LINES.map((l, i) => (
            <span key={l.name}>{i > 0 && ' · '}<a href={l.href} target="_blank" rel="noreferrer">{l.name}</a></span>
          ))}
        </p>
      </Chapter>

      <Chapter label="Visi">
        <p className="op__quote">Perhiasan emas terlengkap dan berkualitas bagi semua kalangan, dengan model terkini dan pelayanan terbaik.</p>
      </Chapter>

      <Chapter side="right" label="Misi">
        <ol className="op__list">
          {MISSIONS.map((m) => <li key={m}>{m}</li>)}
        </ol>
      </Chapter>

      <Chapter label="Kenapa Complete Mulia">
        <ul className="op__usps">
          {USPS.map((u) => (
            <li key={u.title}>
              <img src={u.icon} alt="" />
              <div><strong>{u.title}</strong><span>{u.text}</span></div>
            </li>
          ))}
        </ul>
      </Chapter>

      <Chapter side="center">
        <PriceBoard />
      </Chapter>

      <Chapter label="Pesan Custom">
        <h2>Cincin kawin, kalung nama, atau model sesuai keinginan</h2>
        <p>Ceritakan model yang kamu mau, konsultasinya gratis.</p>
        <a href={waLink('Halo kak, saya mau tanya pesan perhiasan custom.')} target="_blank" rel="noreferrer" className="btn btn--gold">
          Konsultasi via WhatsApp
        </a>
      </Chapter>

      <Chapter side="right" label="Kunjungi Toko">
        <h2>Datang langsung ke toko</h2>
        <p>{STORE.address}</p>
        <p>Buka {STORE.hours}</p>
        <div className="op__btns">
          <Link to="/koleksi" className="btn btn--gold">Lihat Koleksi</Link>
          <a href={STORE.mapsLink} target="_blank" rel="noreferrer" className="btn btn--outline">Petunjuk Arah</a>
        </div>
      </Chapter>
    </div>
  )
}

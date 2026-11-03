import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { POSTS, formatDate, isEnded } from '../data.js'
import Reveal from '../components/Reveal.jsx'
import PostModal from '../components/PostModal.jsx'

const TAGS = ['Semua', ...new Set(POSTS.map((p) => p.tag))]

function useColumnCount() {
  const get = () => {
    const w = window.innerWidth
    return w >= 1100 ? 4 : w >= 800 ? 3 : w >= 560 ? 2 : 1
  }
  const [count, setCount] = useState(get)
  useEffect(() => {
    const onResize = () => setCount(get())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return count
}

export default function News() {
  const [tag, setTag] = useState('Semua')
  const [open, setOpen] = useState(null)
  const count = useColumnCount()
  const list = tag === 'Semua' ? POSTS : POSTS.filter((p) => p.tag === tag)

  // Deal posts round-robin so the newest ones sit across the top row.
  const columns = Array.from({ length: count }, (_, c) => list.filter((_, i) => i % count === c))

  return (
    <div className="container page">
      <nav className="crumbs"><Link to="/">Beranda</Link> / Promo &amp; Kabar</nav>
      <h1 className="page__title">Promo & Kabar</h1>
      <p className="page__lead">Promo, undian berhadiah, dan tulisan seputar emas dari Toko Mas Complete Mulia.</p>

      <div className="news-tags" role="tablist">
        {TAGS.map((t) => (
          <button key={t} role="tab" aria-selected={tag === t} onClick={() => setTag(t)}>{t}</button>
        ))}
      </div>

      {/* key forces a fresh reveal animation whenever the filter changes */}
      <div className="masonry" key={tag} style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
        {columns.map((col, c) => (
          <div key={c} className="masonry__col">
            {col.map((post, r) => (
              <Reveal key={post.href} delay={c * 90 + r * 60}>
                <button type="button" className={`mcard ${isEnded(post) ? 'is-ended' : ''}`} onClick={() => setOpen(post)}>
                  <div className="mcard__img"><img src={post.image} alt="" loading="lazy" /></div>
                  <div className="mcard__body">
                    <div className="mcard__meta">
                      <span className="mcard__tag">{post.tag}</span>
                      <time>{formatDate(post.date)}</time>
                      {isEnded(post) && <span className="ended">Sudah berakhir</span>}
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        ))}
      </div>

      {open && <PostModal key={open.href} post={open} onClose={() => setOpen(null)} />}
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { formatDate, isEnded, waLink } from '../data.js'
import { Close, WhatsApp } from './Icons.jsx'

// Full poster and details for one promo/kabar post, shown in a native <dialog> (Esc and focus handling built in).
export default function PostModal({ post, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return undefined
    dialog.showModal()
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [])

  const ended = isEnded(post)
  const isPromo = post.tag !== 'Edukasi'
  const message = isPromo
    ? `Halo kak, saya mau tanya promo "${post.title}". Apakah masih ada promo serupa saat ini?`
    : `Halo kak, saya baca artikel "${post.title}" di website Complete Mulia, mau tanya-tanya.`

  return (
    <dialog
      ref={ref}
      className="post-modal"
      onClose={onClose}
      // Clicking the dimmed backdrop (the dialog element itself, outside the panel) closes it.
      onClick={(e) => e.target === ref.current && ref.current.close()}
      aria-labelledby="post-modal-title"
    >
      <div className="post-modal__panel">
        <button className="post-modal__close" onClick={() => ref.current.close()} aria-label="Tutup"><Close /></button>
        <div className="post-modal__img"><img src={post.image} alt="" /></div>
        <div className="post-modal__body">
          <div className="mcard__meta">
            <span className="mcard__tag">{post.tag}</span>
            <time>{formatDate(post.date)}</time>
            {ended && <span className="ended">Sudah berakhir</span>}
          </div>
          <h2 id="post-modal-title">{post.title}</h2>
          {post.period && <p className="post-modal__period"><span>Periode</span>{post.period}</p>}
          <p>{post.excerpt}</p>
          <a href={waLink(message)} target="_blank" rel="noreferrer" className="btn btn--wa btn--block">
            <WhatsApp width={18} /> {isPromo ? (ended ? 'Tanya promo terbaru' : 'Tanya promo ini') : 'Tanya admin'}
          </a>
          <a href={post.href} target="_blank" rel="noreferrer" className="post-modal__source">Baca artikel lengkap</a>
        </div>
      </div>
    </dialog>
  )
}

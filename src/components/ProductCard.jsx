import { Link } from 'react-router-dom'
import { useWishlist } from '../wishlist.jsx'
import { Heart } from './Icons.jsx'
import Reveal from './Reveal.jsx'

export default function ProductCard({ product, index = 0, columns = 4 }) {
  const { has, toggle } = useWishlist()
  const saved = has(product.slug)

  return (
    <Reveal as="article" className="pcard" delay={(index % columns) * 80}>
      <Link to={`/produk/${product.slug}`} className="pcard__media">
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <button
        className={`pcard__fav ${saved ? 'is-on' : ''}`}
        onClick={() => toggle(product.slug)}
        aria-label={saved ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
        aria-pressed={saved}
      >
        <Heart filled={saved} width={16} height={16} />
      </button>
      <Link to={`/produk/${product.slug}`} className="pcard__body">
        <span className="pcard__name">{product.name}</span>
        <span className="pcard__meta">{[product.karat, product.stone, product.custom && 'Pesanan'].filter(Boolean).join(' · ')}</span>
      </Link>
    </Reveal>
  )
}

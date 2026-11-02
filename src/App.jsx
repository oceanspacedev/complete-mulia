import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppFab from './components/WhatsAppFab.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import Home from './pages/Home.jsx'
import Collection from './pages/Collection.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import News from './pages/News.jsx'
import Contact from './pages/Contact.jsx'
import Wishlist from './pages/Wishlist.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    // Links with a #section are scrolled by the page itself.
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <>
      <ScrollToTop />
      <Header overlay={isHome} />
      <main className={isHome ? 'is-home' : ''}>
        {/* keyed wrapper replays the fade-in on every route change */}
        <div key={pathname} className="page-fade">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/koleksi" element={<Collection />} />
            <Route path="/koleksi/:category" element={<Collection />} />
            <Route path="/produk/:slug" element={<ProductDetail />} />
            <Route path="/kabar-terbaru" element={<News />} />
            <Route path="/tentang-kami" element={<Navigate to="/#tentang-kami" replace />} />
            <Route path="/kontak-kami" element={<Contact />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
      <CustomCursor />
    </>
  )
}

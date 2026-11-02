import { createContext, useContext, useEffect, useState } from 'react'

const KEY = 'cm-wishlist'
const WishlistContext = createContext(null)

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable: keep in memory only */
    }
  }, [items])

  const toggle = (slug) =>
    setItems((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]))
  const has = (slug) => items.includes(slug)

  return <WishlistContext.Provider value={{ items, toggle, has }}>{children}</WishlistContext.Provider>
}

export const useWishlist = () => useContext(WishlistContext)

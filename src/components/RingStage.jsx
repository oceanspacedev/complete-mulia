import { useEffect, useRef, useState } from 'react'
import { PRODUCTS } from '../data.js'

// Shown when WebGL is unavailable.
const FALLBACK = PRODUCTS.find((p) => p.slug === 'cincin-simple-batu-merah-8k')

/**
 * Fixed full-screen 3D ring that travels with the page. It reads every element marked
 * `data-scene` and maps the scroll position to a fractional section index:
 * 0 while the first section is centered, 1 at the second, 1.5 halfway between them, etc.
 */
export default function RingStage() {
  const stageRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let scene = null
    let cancelled = false

    const sectionIndex = () => {
      const sections = [...document.querySelectorAll('[data-scene]')]
      const mid = window.innerHeight / 2
      const centers = sections.map((s) => {
        const r = s.getBoundingClientRect()
        return r.top + r.height / 2
      })
      if (!centers.length || mid <= centers[0]) return 0
      for (let i = 0; i < centers.length - 1; i++) {
        if (mid < centers[i + 1]) return i + (mid - centers[i]) / (centers[i + 1] - centers[i])
      }
      return centers.length - 1
    }

    // Once the footer enters the screen, slide the stage up with it so the ring leaves
    // together with the last section instead of being covered by the footer.
    const releaseForFooter = () => {
      const footer = document.querySelector('.footer')
      const stage = stageRef.current
      if (!footer || !stage) return
      const overlap = Math.max(0, window.innerHeight - footer.getBoundingClientRect().top)
      stage.style.transform = overlap ? `translate3d(0, ${-overlap}px, 0)` : ''
    }

    const onScroll = () => {
      scene?.setSection(sectionIndex())
      releaseForFooter()
    }
    const onPointer = (e) => {
      scene?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
    }

    // three.js is loaded on demand so it doesn't weigh down the first page load.
    import('../three/goldRing.js')
      .then(({ mountGoldRing }) => {
        if (cancelled) return
        scene = mountGoldRing(stageRef.current, { reducedMotion })
        onScroll()
      })
      .catch(() => setFailed(true))

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      cancelled = true
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pointermove', onPointer)
      scene?.dispose()
    }
  }, [])

  return (
    <div className="stage" ref={stageRef} aria-hidden>
      {failed && <img className="stage__fallback" src={FALLBACK.full} alt="" />}
    </div>
  )
}

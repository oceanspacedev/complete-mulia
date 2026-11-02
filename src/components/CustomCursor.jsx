import { useEffect, useRef } from 'react'

// A gold ring that trails the mouse and grows over links and buttons. Mouse/trackpad only.
export default function CustomCursor() {
  const ringRef = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ring = ringRef.current
    if (!fine || reduced || !ring) return undefined

    const target = { x: -100, y: -100 }
    const pos = { x: -100, y: -100 }
    let frame = 0

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.18
      pos.y += (target.y - pos.y) * 0.18
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      frame = requestAnimationFrame(loop)
    }
    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
      ring.classList.add('is-visible')
    }
    const onOver = (e) => {
      ring.classList.toggle('is-hover', Boolean(e.target.closest('a, button, input, select, textarea, label')))
    }
    const onLeave = () => ring.classList.remove('is-visible')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    document.documentElement.addEventListener('pointerleave', onLeave)
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <div className="cursor" ref={ringRef} aria-hidden><span /></div>
}

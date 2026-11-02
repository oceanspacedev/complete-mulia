// Splits text into per-letter spans so CSS can reveal them one after another.
// Words stay unbroken; each letter gets --i for its stagger delay.
export default function SplitText({ text, className = '' }) {
  let i = 0
  return (
    <span className={`split ${className}`} aria-label={text}>
      {text.split(' ').map((word, w) => (
        <span key={w}>
          {w > 0 && ' '}
          <span className="split__word" aria-hidden>
            {[...word].map((ch) => (
              <span key={i} className="split__char" style={{ '--i': i++ }}>{ch}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}

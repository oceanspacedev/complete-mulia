import { GOLD_PRICES, formatDate, rupiah, waLink } from '../data.js'

export default function PriceBoard() {
  const date = formatDate(GOLD_PRICES.updated ?? new Date().toISOString())

  return (
    <aside className="prices">
      <div className="prices__title">
        <h2>Harga Emas Hari Ini</h2>
        <span>{date}</span>
      </div>
      <dl className="prices__list">
        {GOLD_PRICES.rows.map((r) => (
          <div key={r.karat}>
            <dt>Emas {r.karat}</dt>
            <dd>
              {r.price ? (
                `${rupiah(r.price)}/gr`
              ) : (
                <a href={waLink(`Halo kak, harga emas ${r.karat} hari ini berapa per gram?`)} target="_blank" rel="noreferrer">Tanya harga</a>
              )}
            </dd>
          </div>
        ))}
      </dl>
      <a href={waLink('Halo kak, saya mau cek harga emas hari ini.')} target="_blank" rel="noreferrer" className="btn btn--gold">
        Cek via WhatsApp
      </a>
    </aside>
  )
}

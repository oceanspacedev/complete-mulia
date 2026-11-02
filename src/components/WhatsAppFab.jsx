import { waLink } from '../data.js'
import { WhatsApp } from './Icons.jsx'

export default function WhatsAppFab() {
  return (
    <a className="wa-fab" href={waLink()} target="_blank" rel="noreferrer" aria-label="Chat admin via WhatsApp">
      <WhatsApp width={26} height={26} />
    </a>
  )
}

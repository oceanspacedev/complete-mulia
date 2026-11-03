// Turns the Shopee shop listing (data-marketplace/shopee-raw.json, {id: [name, price, imageId]})
// into src/data/shopee.json with tidy names. Prices are dropped on purpose: they follow the daily gold price.
// Run: node scripts/import-shopee.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const RAW = 'data-marketplace/shopee-raw.json'
const OUT = 'src/data/shopee.json'

// Misspellings seen in the listing, and shop shorthand spelled out.
const WORDS = {
  aanting: 'anting', anating: 'anting', antimg: 'anting', cicin: 'cincin', klaung: 'kalung', kaling: 'kalung',
  lontin: 'liontin', gelnag: 'gelang', gelaang: 'gelang', bnagle: 'bangle', emaas: 'emas', rmas: 'emas', aanak: 'anak',
  rante: 'rantai', ctok: 'catok', catik: 'catok', lovr: 'love', slemapng: 'slempang', selempang: 'slempang',
  krktr: 'karakter', karakyter: 'karakter', karaktek: 'karakter', karkter: 'karakter', karater: 'karakter',
  straubery: 'strawberry', strawbary: 'strawberry', strawbery: 'strawberry', combinasi: 'kombinasi', kobinasi: 'kombinasi',
  kmbs: 'kombinasi', exstenaion: 'extension', shapier: 'sapphire', shapire: 'sapphire', pperlina: 'paperlina',
  pperlin: 'paperlina', pperclip: 'paperclip', tiffny: 'tiffany', tifany: 'tiffany', bulst: 'bulat', coe: 'cor',
  mdl: 'model', lgkp: 'lengkap', lhkp: 'lengkap', htm: 'hitam', mrh: 'merah', orn: 'oranye', polos: 'polos',
  dewaasa: 'dewasa', italyy: 'italy', gipsyy: 'gipsy', gepsy: 'gipsy', kity: 'kitty', unicron: 'unicorn', mas: 'emas',
  bngle: 'bangle', lngkp: 'lengkap', apell: 'apel', variais: 'variasi', varisi: 'variasi', varias: 'variasi',
  vriasi: 'variasi', variasa: 'variasi', mwar: 'mawar', bulet: 'bulat', nulat: 'bulat', 'lionrin/bandul': 'liontin',
  plos: 'polos', poloa: 'polos', '1gran': '1 gram', dewasarante: 'rantai', dewasacor: 'cor', rnte: 'rantai',
  kakarakter: 'karakter', emasarakter: 'karakter', krktrr: 'karakter', ronve: 'ronce', urel: 'aurel', tiffnay: 'tiffany',
  mnaik: 'manik', bndul: 'bandul', segita: 'segitiga', strobery: 'strawberry', minan: 'mainan', '2mainan': '2 mainan',
  kpu: 'kupu', gepsi: 'gipsy', bungaa: 'bunga', kombinas: 'kombinasi', rosegolg: 'rosegold', diamind: 'diamond',
  kelindi: 'kelinci', ceryy: 'cherry', mrron: 'maroon', cinamonroll: 'cinnamoroll', dewii: 'dewi', tetets: 'tetes',
}
const ACRONYMS = new Set(['VC', 'LM', 'CRE', 'MPK', 'CTR', 'UBS'])
// "Dewasa" is the default so it adds nothing; the rest are leftovers of "(Complete Mulia)" / "(Wajib Tanya Stock)" typed by hand.
const DROP = new Set(['dewasa', 'dewassa', 'sewasa', 'dawasa', 'emas', 'e,mas', 'wajib', 'tanya', 'taanya', 'stock', 'stok',
  'muia', 'mulua', 'mullia', 'maulia', 'completemulia'])
const CATEGORIES = [
  ['cincin', /^cincin\b/], ['gelang', /^(variasi )?gelang\b/], ['kalung', /^kalung\b/],
  ['liontin', /^(liontin|bandul)\b/], ['anting', /^(anting|giwang|tindik)\b/],
]

function tidy(raw) {
  let s = ` ${raw} `
    .replace(/\(?\s*wajib tanya[^)]*\)?/gi, ' ')
    .replace(/[\s(9]*\bcom\w*\s+mulia\b\s*\)?(\s*\(\d+k\))?/gi, ' ')
    .replace(/\bm(?:a?t(?:a)?)\s*p(?:u)?t(?:i)?h\b|\bmtpth\b/gi, ' mata putih ')
    .replace(/\bmt\s*htm\b/gi, ' mata hitam ')
    .replace(/\bjt\s*ati\b/gi, ' jantung hati ')
    .replace(/(\D)(\d{1,2}k)\b/gi, '$1 $2')
    .replace(/[()"']/g, ' ')

  // Pull every karat mention out; the first one goes to the end of the name.
  const karats = [...s.matchAll(/\b(\d{1,2})\s?k\b/gi)].map((m) => `${m[1]}K`)
  s = s.replace(/\b\d{1,2}\s?k\b|[*^]k\b|\bk8\b/gi, ' ')

  const tokens = s.split(/\s+/).filter(Boolean)
  const words = []
  let last = ''
  tokens.forEach((w, i) => {
    const lower = WORDS[w.toLowerCase()] ?? w.toLowerCase()
    // "Emas" stays only where it means something: emas putih (white gold), emas tua.
    if (DROP.has(lower) && !(lower === 'emas' && /^(putih|tua)$/i.test(tokens[i + 1] ?? ''))) return
    if (lower === last) { // repeated word: "Kupu Kupu" -> "Kupu-Kupu", otherwise just a typo
      if (lower === 'kupu') words[words.length - 1] = 'Kupu-Kupu'
      return
    }
    last = lower
    words.push(ACRONYMS.has(w.toUpperCase()) ? w.toUpperCase() : lower.length === 1 ? lower.toUpperCase() : cap(lower))
  })
  let name = words.join(' ')
  if (karats[0]) name += ` ${karats[0]}`
  return { name, karat: karats[0] ?? null }
}
const cap = (w) => w.replace(/(^|[-/\s])(\p{L})/gu, (_, sep, c) => sep + c.toUpperCase())

const slugify = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const raw = JSON.parse(readFileSync(RAW, 'utf8'))
const seen = new Set()
const products = Object.entries(raw).map(([id, [rawName, , image]]) => {
  const { name, karat } = tidy(rawName)
  let slug = slugify(name)
  if (seen.has(slug)) slug += `-${id.slice(-5)}` // same model listed more than once (each listing is one piece)
  seen.add(slug)
  const category = CATEGORIES.find(([, re]) => re.test(name.toLowerCase()))?.[0] ?? 'lainnya'
  return { id, name, slug, category, karat, image }
})

mkdirSync('src/data', { recursive: true })
writeFileSync(OUT, JSON.stringify(products))
console.log(`${products.length} products -> ${OUT}`)

import SHOPEE from './data/shopee.json'

const UP = 'https://completemulia.co.id/wp-content/uploads'

export const STORE = {
  name: 'Complete Mulia',
  logo: `${UP}/2022/02/logo-complete-mulia.png`,
  phone: '+62 811-2110-0111',
  phoneRaw: '6281121100111',
  email: 'official.completemulia@gmail.com',
  address: 'Jl. Pahlawan No.230, Jungjang, Kec. Arjawinangun, Kabupaten Cirebon, Jawa Barat 45162',
  hours: 'Senin – Sabtu, 08:00 – 17:00',
  mapsEmbed:
    'https://www.google.com/maps?q=Complete+Mulia+Jl.+Pahlawan+No.230+Arjawinangun+Cirebon&output=embed',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Complete+Mulia+Arjawinangun+Cirebon',
  socials: [
    { label: 'Instagram', handle: '@classygold.cm', href: 'https://www.instagram.com/classygold.cm/' },
    { label: 'Instagram', handle: '@premiumgold.cm', href: 'https://www.instagram.com/premiumgold.cm' },
    { label: 'Instagram', handle: '@luxurygold.cm', href: 'https://www.instagram.com/luxurygold.cm' },
    { label: 'Facebook', handle: '@completemulia', href: 'https://www.facebook.com/completemulia/' },
    { label: 'TikTok', handle: '@completemulia', href: 'https://www.tiktok.com/@completemulia' },
  ],
  marketplaces: [
    { name: 'Shopee', logo: `${UP}/2022/01/Shopee.svg-300x96-1.png`, href: 'https://shopee.co.id/completecmulia' },
    { name: 'Tokopedia', logo: `${UP}/2022/01/logo-tokopedia-e1701413099582-300x96-1.webp`, href: 'https://www.tokopedia.com/cmulia1' },
  ],
}

export function waLink(message = 'Halo kak, saya lihat di website Complete Mulia dan saya tertarik. Bisa dibantu kak?') {
  return `https://wa.me/${STORE.phoneRaw}?text=${encodeURIComponent(message)}`
}

export const CATEGORIES = [
  { slug: 'cincin', name: 'Cincin', image: `${UP}/2024/08/8409581d-39f2-440c-88a9-2413c5d6f0cc-480x480.jpg` },
  { slug: 'anting', name: 'Anting', image: `${UP}/2024/08/2be71690-362e-4789-bb31-e450674367d8-480x480.jpg` },
  { slug: 'kalung', name: 'Kalung', image: `${UP}/2024/08/1432f230-36b7-4913-8c3e-60e7f2740f72-480x480.jpg` },
  { slug: 'gelang', name: 'Gelang', image: `${UP}/2024/08/d695133b-a4be-4f98-9902-8c3c63bd26f0-480x480.jpg` },
  { slug: 'liontin', name: 'Liontin', image: `${UP}/2024/08/8668931e-7774-4166-a3f4-aea8cc7e4bae-480x480.jpg` },
]

const RAW_PRODUCTS = [
  ['Kalung Kombinasi Kupu 8K', 'kalung-kombinasi-kupu-8k', 'd834c99f-18ba-4c3c-bf66-85255385d248'],
  ['Kalung Nagita Mt Pth 8K', 'kalung-nagita-mt-pth-8k', '4d9ea235-eae5-4924-849f-14864c437e7b'],
  ['Kalung Infinity Mt Pth 8K', 'kalung-infinity-mt-pth-8k', '1432f230-36b7-4913-8c3e-60e7f2740f72'],
  ['Kalung Ring Daun Mt Pth 8K', 'kalung-ring-daun-mt-pth-8k', '01fc03a7-6900-4b74-bf89-32816cdee2aa'],
  ['Kalung Aloy 9K Pesanan', 'kalung-aloy-9k-pesanan', '5fa31bc8-6fb0-4411-8350-5883a5fbd784-2'],
  ['Gelang Bangle Pipa Bulat Mt Pth 6K', 'gelang-bangle-pipa-bulat-mt-pth-6k', 'ef0e0850-ef02-44d6-b0f1-37f89bdb9fdf'],
  ['Gelang Bangle Bulat 6K', 'gelang-bangle-bulat-6k', '8df5aeda-2534-4d71-a2c5-dc03192293e2'],
  ['Gelang Rante Paperclip Mt Pth 8K', 'gelang-rante-paperclip-mt-pth-8k', 'e6af7c70-6455-4f1f-b768-d5da67314284-2'],
  ['Gelang Diamond 8K Mt Pth', 'gelang-diamond-8k-mt-pth', 'd695133b-a4be-4f98-9902-8c3c63bd26f0'],
  ['Gelang Rante Plat Bunga 8K', 'gelang-rante-plat-bunga-8k', 'a4978167-a569-4671-af8b-8963cfa94085-2'],
  ['Cincin Jejer Mt Pth Lingkar 8K', 'cincin-jejer-mt-pth-lingkar-8k', '8409581d-39f2-440c-88a9-2413c5d6f0cc'],
  ['Gelang Bangle Pipa Hermong 8K', 'gelang-bangle-pipa-hermong-8k', '59a5fcb0-a56b-4e92-a087-e61dc10724fc'],
  ['Liontin Batu Hitam 8K', 'liontin-batu-hitam-8k', 'f500cf82-2e79-4b65-9c6f-7fde681ffef9'],
  ['Anting Catok Bunga 8K', 'anting-catok-bunga-8k', 'e6d2cf3a-5e3b-4871-a4f9-e7e0df8fc2f0'],
  ['Anting Catok Kupu Mt Pth 8K', 'anting-catok-kupu-mt-pth-8k', 'e5f30f9e-2b9e-4bc2-b41d-7536a581c415'],
  ['Liontin Koin Ukon Kombinasi 8K', 'liontin-koin-ukon-kombinasi-8k', 'c48b6ad2-32aa-4f95-a28a-822c8d041302'],
  ['Liontin Ukon 1Graman 8K', 'liontin-ukon-1graman-8k', 'b96d63ab-4008-4b8b-86dd-0255a540b77b'],
  ['Anting Bulat Ronce Mt Pth 6K', 'anting-bulat-ronce-mt-pth-6k', 'b43ccbfa-6ab6-4d40-8214-39a064751c2e'],
  ['Anting Ronce Bulat 6K', 'anting-ronce-bulat-6k', 'b1c097e2-980a-49f9-812f-c0972037bae5'],
  ['Anting Catok Doir Mt Pth 8K', 'anting-catok-doir-mt-pth-8k', '977be89f-c7eb-493d-affb-f4f7d9271e94'],
  ['Liontin Koin Perempuan 8K', 'liontin-koin-perempuan-8k', '8668931e-7774-4166-a3f4-aea8cc7e4bae'],
  ['Anting Catok Bulat Simple Mt Pth 8K', 'anting-catok-bulat-simple-mt-pth-8k', '61768cd1-7774-4b10-acd8-fcd7f3827cc2'],
  ['Anting Catok Bulat Mt Pth 8K', 'anting-catok-bulat-mt-pth-8k', '589089ed-0418-4475-a012-5dc3d8f7bbce'],
  ['Anting Catok Love Mt Pth 8K', 'anting-catok-love-mt-pth-8k', '2be71690-362e-4789-bb31-e450674367d8'],
  ['Anting Ronce Persegi Mt Pth 8K', 'anting-ronce-persegi-mt-pth-8k', '28dde53a-b27b-4573-b570-a94acfb4346e'],
  ['Kalung Vc 5 Bunga Hitam 8K', 'kalung-vc-5-bunga-hitam-8k', '7d98d75d-5dfa-420c-8f06-5342cacb53e9-2'],
  ['Gelang Rantai Ronce Love 8K', 'gelang-rantai-ronce-love-8k', 'cbbca582-541d-46d3-b542-a6c1c6a9158e-2'],
  ['Gelang Serut Aurel Mt Pth 8K', 'gelang-serut-aurel-mt-pth-8k', 'b507f0fd-b248-415a-979e-4a089c937b7f-2'],
  ['Cincin Simple Batu Merah 8K', 'cincin-simple-batu-merah-8k', 'b0d58881-a0c3-497d-b47a-421fa715b830-2'],
  ['Gelang Rantai Peneng 8K', 'gelang-rantai-peneng-8k', 'a67fcaa1-3472-48a5-81ca-6b7a57129392-2'],
  ['Gelang Rantai Serut Daun Mt Pth 8K', 'gelang-rantai-serut-daun-mt-pth-8k', '3ead6304-e62f-4f1f-aa7e-2f1fe4c0c928-2'],
]

const BEST_SELLERS = [
  'anting-catok-bulat-simple-mt-pth-8k', 'cincin-jejer-mt-pth-lingkar-8k', 'liontin-koin-perempuan-8k',
  'gelang-rante-plat-bunga-8k', 'gelang-rantai-serut-daun-mt-pth-8k', 'anting-catok-doir-mt-pth-8k',
  'gelang-diamond-8k-mt-pth', 'gelang-rantai-peneng-8k',
]

// Stone label from the product name: "Mt Pth" / "Mata Putih" = white stones, "Batu Merah", "Mata Hitam" etc. = coloured stone.
function stoneOf(name) {
  if (/Mt Pth|Mata Putih/i.test(name)) return 'Mata putih'
  const [, kind, colour] = name.match(/\b(Batu|Mata) (Merah|Hitam|Pink|Biru|Hijau)\b/i) ?? []
  return kind ? `${kind} ${colour.toLowerCase()}` : null
}

const SITE_PRODUCTS = RAW_PRODUCTS.map(([name, slug, img], i) => {
  const karat = name.match(/(\d)K/)?.[1]
  return {
    name,
    slug,
    category: name.split(' ')[0].toLowerCase(),
    karat: karat ? `${karat}K` : null,
    stone: stoneOf(name),
    custom: /Pesanan/.test(name),
    image: `${UP}/2024/08/${img}-480x480.jpg`,
    full: `${UP}/2024/08/${img}.jpg`,
    bestSeller: BEST_SELLERS.includes(slug),
    isNew: i < 8,
  }
})

// The Shopee shop listing (newest first), generated by scripts/import-shopee.mjs. Photos are served by Shopee's CDN;
// "_tn" is its thumbnail size. Models already on the site above are skipped so they don't show twice.
const SHOPEE_IMG = 'https://down-id.img.susercontent.com/file/'
const sameModel = (name) => name.toLowerCase().replace(/mt pth/g, 'mata putih').replace(/rante/g, 'rantai')
const siteNames = new Set(SITE_PRODUCTS.map((p) => sameModel(p.name)))
const SHOPEE_PRODUCTS = SHOPEE.filter((p) => !siteNames.has(sameModel(p.name))).map((p, i) => ({
  name: p.name,
  slug: p.slug,
  category: p.category,
  karat: p.karat,
  stone: stoneOf(p.name),
  custom: false,
  image: `${SHOPEE_IMG}${p.image}_tn`,
  full: `${SHOPEE_IMG}${p.image}`,
  shopee: `https://shopee.co.id/product/332312698/${p.id}`,
  bestSeller: false,
  isNew: i < 12,
}))

export const PRODUCTS = [...SHOPEE_PRODUCTS, ...SITE_PRODUCTS]

// Promo & kabar. period/endsAt come from each original article; once endsAt has passed the post is labelled "Sudah berakhir".
export const POSTS = [
  {
    title: 'Menangkan Hadiah Kulkas di Gebyar Ulang Tahun Complete Mulia!',
    date: '2024-11-29',
    href: 'https://completemulia.co.id/menangkan-hadiah-kulkas-di-gebyar-ulang-tahun-complete-mulia/',
    excerpt: 'Gebyar ulang tahun Complete Mulia hadir dengan kejutan besar. Raih kesempatan memenangkan kulkas sebagai hadiah utama dengan cara yang mudah.',
    image: `${UP}/2024/11/Gebyar-ulang-tahun.webp`,
    tag: 'Promo',
    period: '1 Desember 2024 – 14 Februari 2025, undian 15 Februari 2025',
    endsAt: '2025-02-15',
  },
  {
    title: 'Dapatkan Sepeda Listrik Impianmu! Ikuti Live Undian Sabtu, 4 Januari 2025',
    date: '2024-11-29',
    href: 'https://completemulia.co.id/dapatkan-sepeda-listrik-impianmu-ikuti-live-undian-sabtu-4-januari-2025/',
    excerpt: 'Ingin memiliki sepeda listrik keren secara gratis? Complete Mulia mengadakan Live Undian Hadiah untuk pelanggan setia.',
    image: `${UP}/2024/11/Design-Live-Undian-Hadiah-Sepeda-Listrik.webp`,
    tag: 'Undian',
    period: 'Live undian Sabtu, 4 Januari 2025',
    endsAt: '2025-01-04',
  },
  {
    title: 'Promo Undian Sepeda Listrik di Toko Mas Complete Mulia',
    date: '2024-08-27',
    href: 'https://completemulia.co.id/promo-undian-sepeda-listrik-di-toko-mas-complete-mulia/',
    excerpt: 'Berbelanja perhiasan kini semakin menguntungkan dengan promo terbaru dari Toko Mas Complete Mulia.',
    image: `${UP}/2024/08/Brosur-Complete-Mulia-Undian-Sepeda-Listrik-2024_page-0001-scaled.webp`,
    tag: 'Promo',
    period: 'September – Desember 2024, undian awal Januari 2025',
    endsAt: '2025-01-04',
  },
  {
    title: 'Rayakan Kemerdekaan dengan Undian Hadiah Langsung di Toko Mas Complete Mulia!',
    date: '2024-08-01',
    href: 'https://completemulia.co.id/rayakan-kemerdekaan-dengan-undian-hadiah-langsung-di-toko-mas-complete-mulia/',
    excerpt: 'Memperingati Hari Kemerdekaan RI ke-79, Complete Mulia mempersembahkan promo spesial Undian Hadiah Langsung.',
    image: `${UP}/2024/08/promo-agustus_page-0001-725x1024-1.webp`,
    tag: 'Undian',
    // The article gives no end date (17 Agustus 2024 until prizes run out); treated as over since it was a 2024 promo.
    period: '17 Agustus 2024 – selama hadiah masih ada',
    endsAt: '2024-12-31',
  },
  {
    title: 'Raih Kesempatan Memenangkan Logam Mulia Antam dengan Promo Undian!',
    date: '2024-06-05',
    href: 'https://completemulia.co.id/raih-kesempatan-memenangkan-logam-mulia-antam-dengan-promo-undian-toko-mas-complete-mulia/',
    excerpt: 'Setiap pembelian minimal Rp1 juta berkesempatan memenangkan Logam Mulia Antam melalui promo undian terbaru.',
    image: `${UP}/2024/08/Promo-Undian-Logam-Mulia-Toko-Mas-Complete-Mulia-768x1084-1.webp`,
    tag: 'Undian',
    period: 'Mei – Agustus 2024, pengumuman awal September 2024',
    endsAt: '2024-09-07',
  },
  {
    title: 'Tips Investasi Emas Digital untuk Pemula: Panduan Lengkap',
    date: '2023-12-22',
    href: 'https://completemulia.co.id/tips-investasi-emas-digital-untuk-pemula-panduan-lengkap/',
    excerpt: 'Investasi emas digital menjadi pilihan populer bagi pemula yang ingin mulai dengan modal terjangkau dan risiko lebih rendah.',
    image: `${UP}/2024/08/TIPS-INVESTASI-EMAS-DIGITAL-BAGI-PEMULA-1024x512-1.jpg`,
    tag: 'Edukasi',
  },
]

// A promo is over once its end date has passed. Posts without endsAt (articles) never expire.
export const isEnded = (post, today = new Date()) => Boolean(post.endsAt) && new Date(post.endsAt + 'T23:59:59') < today

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const GOLD = '#ebc71a'

function dotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.4, 'rgba(255,255,255,.6)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function buildRing() {
  const ring = new THREE.Group()
  const gold = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.2, envMapIntensity: 1.25 })

  // Torus stretched along its axis reads as a comfort-fit band rather than a wire.
  const bandGeo = new THREE.TorusGeometry(1, 0.12, 48, 200)
  bandGeo.scale(1, 1, 2.1)
  ring.add(new THREE.Mesh(bandGeo, gold))

  // Setting: a small collar with four prongs on top of the band.
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.11, 0.16, 32), gold)
  collar.position.y = 1.18
  ring.add(collar)
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4
    const prong = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.03, 0.26, 12), gold)
    prong.position.set(Math.cos(a) * 0.17, 1.33, Math.sin(a) * 0.17)
    prong.rotation.set(Math.sin(a) * -0.35, 0, Math.cos(a) * 0.35)
    ring.add(prong)
  }

  // Brilliant-cut stone: a faceted lathe profile (pavilion point down, flat table up).
  const profile = [
    new THREE.Vector2(0, -0.2),
    new THREE.Vector2(0.24, 0.02),
    new THREE.Vector2(0.22, 0.08),
    new THREE.Vector2(0.13, 0.13),
    new THREE.Vector2(0, 0.13),
  ]
  const stone = new THREE.Mesh(
    new THREE.LatheGeometry(profile, 16),
    new THREE.MeshStandardMaterial({ color: '#dfe8f5', metalness: 0.55, roughness: 0.06, flatShading: true, envMapIntensity: 1.6 }),
  )
  stone.position.y = 1.43
  ring.add(stone)

  return { ring, stone }
}

function buildDust(count) {
  const positions = new Float32Array(count * 3)
  const speeds = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = (Math.random() - 0.5) * 7
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 0.5
    speeds[i] = 0.08 + Math.random() * 0.22
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const mat = new THREE.PointsMaterial({
    color: '#d9b612',
    size: 0.07,
    map: dotTexture(),
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  })
  return { points: new THREE.Points(geo, mat), speeds }
}

const lerp = (a, b, t) => a + (b - a) * t
const ease = (t) => t * t * (3 - 2 * t)

// One pose per homepage section: the ring sits opposite the text and turns a little further each time.
// x/y are world units at the ring's depth (about ±3.5 wide on a desktop screen), s is scale, r* are radians.
const WIDE_POSES = [
  { x: 1.75, y: -0.1, s: 1, rx: -0.5, ry: 0, rz: 0.18 }, // intro: text left
  { x: -1.8, y: 0, s: 0.95, rx: 0.15, ry: 2.2, rz: -0.2 }, // tentang kami: text right
  { x: 1.85, y: 0.1, s: 0.9, rx: -1.15, ry: 3.6, rz: 0.1 }, // visi
  { x: -1.85, y: -0.1, s: 0.9, rx: -0.3, ry: 5, rz: 0.4 }, // misi
  { x: 1.85, y: 0, s: 0.85, rx: 0.4, ry: 6.4, rz: -0.1 }, // keunggulan
  { x: 0, y: 1.3, s: 0.55, rx: -0.6, ry: 7.6, rz: 0 }, // harga emas: above the card
  { x: 1.7, y: 0, s: 1.05, rx: -0.4, ry: 9.2, rz: 0.15 }, // pesan custom
  { x: -1.7, y: 0, s: 1, rx: -0.5, ry: 10.6, rz: 0.1 }, // kunjungi toko
]
// On narrow screens the ring stays in the top band and the text sits below it.
const NARROW_POSES = WIDE_POSES.map((p) => ({ ...p, x: 0, y: p.y > 1 ? 1.45 : 1.15, s: p.s * 0.55 }))

function poseAt(poses, f) {
  const i = Math.min(Math.floor(f), poses.length - 1)
  const a = poses[Math.max(0, i)]
  const b = poses[Math.min(i + 1, poses.length - 1)]
  const t = ease(Math.min(1, Math.max(0, f - i)))
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    s: lerp(a.s, b.s, t),
    rx: lerp(a.rx, b.rx, t),
    ry: lerp(a.ry, b.ry, t),
    rz: lerp(a.rz, b.rz, t),
  }
}

/**
 * Mounts the gold ring scene into `container`. Returns controls the React side drives:
 * setSection(float index) from scroll, setPointer(-1..1, -1..1) from the mouse, setActive(bool) to pause.
 */
export function mountGoldRing(container, { reducedMotion = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

  const key = new THREE.DirectionalLight('#fff4d6', 1.6)
  key.position.set(3, 4, 5)
  scene.add(key)

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
  camera.position.z = 7

  const { ring, stone } = buildRing()
  scene.add(ring)
  const dust = buildDust(160)
  scene.add(dust.points)

  const state = { target: 0, f: 0, px: 0, py: 0, tx: 0, ty: 0, active: true, wide: true }
  const clock = new THREE.Clock()
  let frame = 0

  function resize() {
    const { clientWidth: w, clientHeight: h } = container
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    state.wide = camera.aspect > 1.05
  }

  function render() {
    const dt = Math.min(clock.getDelta(), 0.05)
    const t = clock.elapsedTime
    // Ease toward the scroll target and the pointer so the ring glides instead of snapping.
    state.f = reducedMotion ? state.target : lerp(state.f, state.target, 0.07)
    state.tx = lerp(state.tx, state.px, 0.05)
    state.ty = lerp(state.ty, state.py, 0.05)

    const pose = poseAt(state.wide ? WIDE_POSES : NARROW_POSES, state.f)
    const spin = reducedMotion ? 0 : t * 0.15
    const float = reducedMotion ? 0 : Math.sin(t * 1.1) * 0.06
    ring.position.set(pose.x, pose.y + float, 0)
    ring.scale.setScalar(pose.s)
    ring.rotation.set(pose.rx + state.ty * 0.35, pose.ry + spin + state.tx * 0.55, pose.rz)
    stone.rotation.y = -spin * 3

    if (!reducedMotion) {
      const pos = dust.points.geometry.attributes.position
      for (let i = 0; i < dust.speeds.length; i++) {
        let y = pos.getY(i) + dust.speeds[i] * dt
        if (y > 3.6) y = -3.6
        pos.setY(i, y)
      }
      pos.needsUpdate = true
      dust.points.rotation.y = state.tx * 0.08
    }

    renderer.render(scene, camera)
    if (state.active) frame = requestAnimationFrame(render)
  }

  const ro = new ResizeObserver(resize)
  ro.observe(container)
  resize()
  frame = requestAnimationFrame(render)

  return {
    setSection(f) {
      state.target = f
    },
    setPointer(x, y) {
      state.px = x
      state.py = y
    },
    setActive(on) {
      if (on === state.active) return
      state.active = on
      if (on) {
        clock.getDelta()
        frame = requestAnimationFrame(render)
      }
    },
    dispose() {
      state.active = false
      cancelAnimationFrame(frame)
      ro.disconnect()
      scene.traverse((o) => {
        o.geometry?.dispose()
        if (o.material) {
          o.material.map?.dispose()
          o.material.dispose()
        }
      })
      scene.environment?.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}

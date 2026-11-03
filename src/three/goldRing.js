import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const GOLD = '#ebc71a'

const lerp = (a, b, t) => a + (b - a) * t
const clamp = (v) => Math.min(1, Math.max(0, v))
const ease = (t) => t * t * (3 - 2 * t)

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

// Brilliant cut: pointed pavilion below, flat table on top (+y).
function brilliant(r) {
  const profile = [
    new THREE.Vector2(0, -0.83 * r),
    new THREE.Vector2(r, 0.08 * r),
    new THREE.Vector2(0.92 * r, 0.33 * r),
    new THREE.Vector2(0.54 * r, 0.54 * r),
    new THREE.Vector2(0, 0.54 * r),
  ]
  return new THREE.LatheGeometry(profile, 16)
}

/** Ring in its own frame: band in the XY plane (axis Z), centre stone on top (+y). Band inner radius is 0.9. */
function buildRing() {
  const ring = new THREE.Group()
  const gold = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.2, envMapIntensity: 1.25 })
  const pave = new THREE.MeshStandardMaterial({ color: '#eef3fb', metalness: 0.5, roughness: 0.05, flatShading: true, envMapIntensity: 1.8 })
  const centreMat = new THREE.MeshStandardMaterial({ color: '#dfe8f5', metalness: 0.55, roughness: 0.06, flatShading: true, envMapIntensity: 1.6 })

  const bandGeo = new THREE.TorusGeometry(1, 0.1, 40, 180)
  bandGeo.scale(1, 1, 1.7)
  ring.add(new THREE.Mesh(bandGeo, gold))

  // Pavé: small stones set along the upper arc of the band, either side of the centre stone.
  const smallStone = brilliant(0.055)
  for (const side of [-1, 1]) {
    for (let k = 0; k < 4; k++) {
      const a = Math.PI / 2 + side * (0.42 + k * 0.2)
      const s = new THREE.Mesh(smallStone, pave)
      s.position.set(Math.cos(a) * 1.09, Math.sin(a) * 1.09, 0)
      s.rotation.z = a - Math.PI / 2
      ring.add(s)
    }
  }

  // Setting: collar, four prongs, and a halo of tiny stones around the centre stone.
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.1, 0.16, 32), gold)
  collar.position.y = 1.16
  ring.add(collar)
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4
    const prong = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.028, 0.24, 12), gold)
    prong.position.set(Math.cos(a) * 0.16, 1.32, Math.sin(a) * 0.16)
    prong.rotation.set(Math.sin(a) * -0.3, 0, Math.cos(a) * 0.3)
    ring.add(prong)
  }
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.03, 12, 64), gold)
  halo.rotation.x = Math.PI / 2
  halo.position.y = 1.38
  ring.add(halo)
  const tiny = brilliant(0.04)
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2
    const s = new THREE.Mesh(tiny, pave)
    s.position.set(Math.cos(a) * 0.29, 1.41, Math.sin(a) * 0.29)
    ring.add(s)
  }

  const centre = new THREE.Mesh(brilliant(0.22), centreMat)
  centre.position.y = 1.44
  ring.add(centre)

  return { ring, centre }
}

// Hand model: WebXR Input Profiles generic right hand (W3C licence, see public/models/LICENSE-right-hand.txt).
// In the file the fingers point down (-Y), the back of the hand faces +X and the thumb sits toward -Z.
// MODEL_TO_VIEW stands it up: fingers +Y, back of the hand toward the camera (+Z), thumb on the viewer's left.
const HAND_URL = '/models/right-hand.glb'
const HAND_SCALE = 20 // model is in metres; ~0.2 m hand → ~4 scene units before the per-section scale
const PALM_CENTRE = new THREE.Vector3(0.036, 0.008, 0.008) // between the wrist and the middle-finger knuckle
const FINGER_RADIUS = 0.0088 // ring finger at the proximal phalanx, in metres
const MODEL_TO_VIEW = new THREE.Quaternion().setFromRotationMatrix(
  new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, -1, 0), new THREE.Vector3(1, 0, 0)),
)

/** Loads the hand into `parent` (origin = palm centre) and resolves with the bones the ring needs. */
function loadHand(parent) {
  return new GLTFLoader().loadAsync(HAND_URL).then((gltf) => {
    const skin = new THREE.MeshPhysicalMaterial({
      color: '#ecdfd2',
      roughness: 0.5,
      clearcoat: 0.4,
      clearcoatRoughness: 0.45,
      envMapIntensity: 0.85,
    })
    gltf.scene.traverse((o) => {
      if (o.isMesh) {
        o.material.dispose()
        o.material = skin
        o.frustumCulled = false // skinned bounds don't follow the bones
      }
    })

    const orient = new THREE.Group()
    orient.quaternion.copy(MODEL_TO_VIEW)
    orient.scale.setScalar(HAND_SCALE)
    orient.position.copy(PALM_CENTRE).applyQuaternion(MODEL_TO_VIEW).multiplyScalar(-HAND_SCALE)
    orient.add(gltf.scene)

    // Forearm sized to the model's own wrist: measured in the file at y≈0.06 m the wrist is about 5.2 cm wide and
    // 3.8 cm thick, centred at (x 0.0395, z 0.0103). The mesh tapers shut below that, so the arm starts just
    // inside it to hide the taper and widens slightly toward the elbow. The stage mask fades it out lower down.
    const WRIST = { width: 0.052, thickness: 0.038, centre: new THREE.Vector3(0.0395, 0.058, 0.0103) }
    const top = WRIST.centre.clone().sub(PALM_CENTRE).applyQuaternion(MODEL_TO_VIEW).multiplyScalar(HAND_SCALE)
    const armLength = 3.2
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.97, 1.12, armLength, 64, 1, true), skin)
    arm.scale.set((WRIST.width / 2) * HAND_SCALE, 1, (WRIST.thickness / 2) * HAND_SCALE)
    arm.position.set(top.x, top.y - armLength / 2, top.z)
    parent.add(orient, arm)

    const bone = (name) => gltf.scene.getObjectByName(name)

    // In the file every joint hangs straight off the armature, so bending one wouldn't carry the rest of the
    // finger. Chain them wrist → metacarpal → phalanges → tip; attach() keeps world transforms, so the skin's
    // bind pose is unchanged.
    gltf.scene.updateMatrixWorld(true)
    const wristBone = bone('wrist')
    for (const finger of Object.keys(FINGER_JOINTS)) {
      const names = finger === 'thumb'
        ? ['thumb-metacarpal', 'thumb-phalanx-proximal', 'thumb-phalanx-distal', 'thumb-tip']
        : [`${finger}-metacarpal`, `${finger}-phalanx-proximal`, `${finger}-phalanx-intermediate`, `${finger}-phalanx-distal`, `${finger}-tip`]
      names.reduce((parentBone, name) => {
        const b = bone(name)
        parentBone.attach(b)
        return b
      }, wristBone)
    }
    gltf.scene.updateMatrixWorld(true)

    // The joints that bend, with their rest rotation so curls are applied on top of it.
    const joints = {}
    for (const [finger, names] of Object.entries(FINGER_JOINTS)) {
      joints[finger] = names.map((name) => {
        const b = bone(name)
        return { bone: b, rest: b.quaternion.clone() }
      })
    }

    return {
      proximal: bone('ring-finger-phalanx-proximal'),
      intermediate: bone('ring-finger-phalanx-intermediate'),
      tip: bone('ring-finger-tip'),
      joints,
    }
  })
}

// Joints that curl, per finger (WebXR names). Curling is a rotation about each joint's own X axis.
const FINGER_JOINTS = {
  'index-finger': ['index-finger-phalanx-proximal', 'index-finger-phalanx-intermediate', 'index-finger-phalanx-distal'],
  'middle-finger': ['middle-finger-phalanx-proximal', 'middle-finger-phalanx-intermediate', 'middle-finger-phalanx-distal'],
  'ring-finger': ['ring-finger-phalanx-proximal', 'ring-finger-phalanx-intermediate', 'ring-finger-phalanx-distal'],
  'pinky-finger': ['pinky-finger-phalanx-proximal', 'pinky-finger-phalanx-intermediate', 'pinky-finger-phalanx-distal'],
  thumb: ['thumb-metacarpal', 'thumb-phalanx-proximal', 'thumb-phalanx-distal'],
}

// Four-point star with a warm halo, drawn once to a canvas; used as the glint on the centre stone.
function glintTexture() {
  const size = 128
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const mid = size / 2
  const halo = g.createRadialGradient(mid, mid, 0, mid, mid, mid)
  halo.addColorStop(0, 'rgba(255,255,255,1)')
  halo.addColorStop(0.15, 'rgba(255,248,214,.85)')
  halo.addColorStop(0.45, 'rgba(235,199,26,.25)')
  halo.addColorStop(1, 'rgba(235,199,26,0)')
  g.fillStyle = halo
  g.fillRect(0, 0, size, size)
  g.fillStyle = 'rgba(255,255,255,.95)'
  for (const [w, h] of [[4, mid], [mid, 4]]) {
    g.beginPath()
    g.ellipse(mid, mid, w, h, 0, 0, Math.PI * 2)
    g.fill()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
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
  const mat = new THREE.PointsMaterial({ color: '#d9b612', size: 0.07, map: dotTexture(), transparent: true, opacity: 0.75, depthWrite: false })
  return { points: new THREE.Points(geo, mat), speeds }
}

const FINGERS = Object.keys(FINGER_JOINTS)
const X_AXIS = new THREE.Vector3(1, 0, 0)

// A section pose: where the hand sits (world units at z=0, about ±3.5 wide on desktop), how it is turned, and a
// gesture given as curl angles (radians, toward the palm) for each joint of index, middle, ring, pinky, thumb.
function handPose(place, [index, middle, ring, pinky, thumb]) {
  const p = { s: 0.72, gem: 0, ...place }
  ;[index, middle, ring, pinky, thumb].forEach((curls, f) => curls.forEach((v, j) => (p[`${FINGERS[f]}${j}`] = v)))
  return p
}

// Every gesture is a jewellery-ad pose whose job is to show the ring: the ring finger stays in front and the
// stone faces the camera. Curl order: index, middle, ring, pinky, thumb.
const OPEN = [[0.12, 0.15, 0.1], [0.1, 0.14, 0.1], [0.12, 0.15, 0.1], [0.18, 0.2, 0.12], [0, 0.1, 0.1]]
// Fingers together and gently curved, the ring finger a little straighter so the ring leads.
const ELEGANT = [[0.18, 0.22, 0.15], [0.16, 0.2, 0.14], [0.08, 0.1, 0.08], [0.25, 0.3, 0.2], [0.25, 0.35, 0.25]]
// Fingers drawn in as if admiring the ring on them.
const ADMIRE = [[0.55, 0.7, 0.4], [0.55, 0.7, 0.4], [0.45, 0.6, 0.35], [0.6, 0.75, 0.45], [0.2, 0.35, 0.3]]
// Soft fist with the knuckles forward: the classic ring catalogue shot.
const CATALOGUE = [[1, 1.2, 0.7], [1.05, 1.25, 0.7], [1, 1.2, 0.7], [1.05, 1.3, 0.75], [0.3, 0.5, 0.4]]

// One pose per homepage section; the hand sits opposite the text and drops out of frame for "contoh model".
// Bigger `s` is a closer look. gem blends the centre stone clear → ruby.
const WIDE_POSES = [
  // pembuka: open hand, the ring floats beside it and then slides on
  handPose({ x: 1.75, y: -0.5, rx: 0.05, ry: -0.15, rz: 0.06 }, OPEN),
  // bisa custom: close-up on the ruby, fingers together, ring finger leading
  handPose({ x: -1.5, y: -1.4, s: 1.3, rx: 0.15, ry: 0.1, rz: -0.25, gem: 1 }, ELEGANT),
  // cara pesan: hand tipped toward the text, fingers drawn in, admiring the ring
  handPose({ x: 1.85, y: -0.6, s: 0.9, rx: 0.25, ry: -0.45, rz: 0.35 }, ADMIRE),
  // form konsultasi: catalogue shot, knuckles and ring to the camera
  handPose({ x: -1.75, y: -0.75, s: 1.15, rx: 0.35, ry: 0.4, rz: -0.15 }, CATALOGUE),
  // contoh model: out of frame
  handPose({ x: 0, y: -4.8, rx: 0.2, ry: 0, rz: 0 }, ELEGANT),
  // tentang kami: long diagonal, ring toward the camera
  handPose({ x: 1.7, y: -0.7, s: 0.9, rx: 0.1, ry: -0.3, rz: 0.45 }, ELEGANT),
  // kunjungi toko: open hand presenting the ring
  handPose({ x: -1.75, y: -0.55, s: 0.85, rx: 0.1, ry: 0.3, rz: -0.3 }, [[0.1, 0.12, 0.08], [0.1, 0.12, 0.08], [0.05, 0.06, 0.04], [0.15, 0.15, 0.1], [0.05, 0.1, 0.1]]),
]
// Phones: a smaller hand centred in the top band (the stage is masked below it in CSS).
// Close-ups are capped so the hand never reaches the text below the band.
const NARROW_POSES = WIDE_POSES.map((p) => ({ ...p, x: 0, y: p.y < -3 ? -4.8 : 0.72, s: Math.min(p.s, 0.8) * 0.5 }))

function poseAt(poses, f) {
  const i = Math.min(Math.floor(f), poses.length - 1)
  const a = poses[Math.max(0, i)]
  const b = poses[Math.min(i + 1, poses.length - 1)]
  const t = ease(clamp(f - i))
  const out = {}
  for (const k of Object.keys(a)) out[k] = lerp(a[k], b[k], t)
  return out
}

const CLEAR_STONE = new THREE.Color('#dfe8f5')
const RUBY_STONE = new THREE.Color('#c0233f')

/**
 * Mounts the hand-and-ring scene into `container`. Returns controls the React side drives:
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

  const key = new THREE.DirectionalLight('#fff4d6', 1.5)
  key.position.set(3, 4, 5)
  scene.add(key)
  scene.add(new THREE.HemisphereLight('#fffaf0', '#c9bfae', 0.5))

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
  camera.position.z = 7

  const handRoot = new THREE.Group()
  scene.add(handRoot)
  // Until the model arrives (or if it fails to load) the ring simply keeps floating.
  let bones = null
  loadHand(handRoot)
    .then((b) => {
      bones = b
    })
    .catch(() => {})

  const { ring, centre } = buildRing()
  scene.add(ring)
  const dust = buildDust(160)
  scene.add(dust.points)
  const glint = new THREE.Sprite(new THREE.SpriteMaterial({ map: glintTexture(), transparent: true, depthTest: false, opacity: 0 }))
  glint.renderOrder = 10
  scene.add(glint)
  const stoneWorld = new THREE.Vector3()
  const stoneNormal = new THREE.Vector3()
  const toCamera = new THREE.Vector3()

  const tmp = {
    a: { p: new THREE.Vector3(), q: new THREE.Quaternion(), s: new THREE.Vector3() },
    b: { p: new THREE.Vector3(), q: new THREE.Quaternion(), s: new THREE.Vector3() },
    euler: new THREE.Euler(),
    base: new THREE.Vector3(),
    next: new THREE.Vector3(),
    tip: new THREE.Vector3(),
    dir: new THREE.Vector3(),
    up: new THREE.Vector3(),
    side: new THREE.Vector3(),
    q: new THREE.Quaternion(),
    basis: new THREE.Matrix4(),
    curl: new THREE.Quaternion(),
  }

  /**
   * Worn and hovering ring matrices from the ring-finger bones. The ring's own axes are mapped so its axis (Z)
   * runs along the finger and its centre stone (Y) faces out of the back of the hand.
   */
  function fingerMatrices(handScale, worn, hover) {
    bones.proximal.getWorldPosition(tmp.base)
    bones.intermediate.getWorldPosition(tmp.next)
    bones.tip.getWorldPosition(tmp.tip)
    tmp.dir.subVectors(tmp.next, tmp.base).normalize()
    bones.proximal.getWorldQuaternion(tmp.q)
    tmp.up.set(0, 1, 0).applyQuaternion(tmp.q) // WebXR joints: +Y points out of the back of the hand
    tmp.up.addScaledVector(tmp.dir, -tmp.up.dot(tmp.dir)).normalize()
    tmp.side.crossVectors(tmp.up, tmp.dir)
    tmp.basis.makeBasis(tmp.side, tmp.up, tmp.dir)
    tmp.q.setFromRotationMatrix(tmp.basis)

    const scale = (FINGER_RADIUS * HAND_SCALE * handScale * 1.08) / 0.9
    const seat = tmp.base.clone().lerp(tmp.next, 0.38)
    worn.compose(seat, tmp.q, new THREE.Vector3().setScalar(scale))
    const above = tmp.tip.clone().addScaledVector(tmp.dir, 0.5 * handScale)
    hover.compose(above, tmp.q, new THREE.Vector3().setScalar(scale * 1.1))
  }

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

  // World matrix for the ring while it floats beside the hand (section 0), expressed relative to the hand.
  function floatingMatrix(spin, out) {
    tmp.euler.set(-0.55 + Math.sin(spin * 0.7) * 0.15, spin, 0.2)
    out.compose(new THREE.Vector3(-1.5, 1.9, 0.9), new THREE.Quaternion().setFromEuler(tmp.euler), new THREE.Vector3().setScalar(0.5))
    return out.premultiply(handRoot.matrixWorld)
  }

  function blendInto(target, fromM, toM, t) {
    fromM.decompose(tmp.a.p, tmp.a.q, tmp.a.s)
    toM.decompose(tmp.b.p, tmp.b.q, tmp.b.s)
    target.position.lerpVectors(tmp.a.p, tmp.b.p, t)
    target.quaternion.slerpQuaternions(tmp.a.q, tmp.b.q, t)
    target.scale.lerpVectors(tmp.a.s, tmp.b.s, t)
  }

  const mFloat = new THREE.Matrix4()
  const mHover = new THREE.Matrix4()
  const mWorn = new THREE.Matrix4()

  function render() {
    const dt = Math.min(clock.getDelta(), 0.05)
    const t = clock.elapsedTime

    // Ease toward the scroll target and the pointer so everything glides instead of snapping.
    state.f = reducedMotion ? state.target : lerp(state.f, state.target, 0.07)
    state.tx = lerp(state.tx, state.px, 0.05)
    state.ty = lerp(state.ty, state.py, 0.05)

    const pose = poseAt(state.wide ? WIDE_POSES : NARROW_POSES, state.f)
    // Idle motion shows the ring off: the wrist turns slowly back and forth, like turning a hand under the
    // shop lights so the stone catches them. No side-to-side swinging.
    const twist = reducedMotion ? 0 : Math.sin(t * 0.55) * 0.22
    const float = reducedMotion ? 0 : Math.sin(t * 0.8) * 0.02
    handRoot.position.set(pose.x, pose.y + float, 0)
    handRoot.scale.setScalar(pose.s)
    handRoot.rotation.set(pose.rx + state.ty * 0.12, pose.ry + twist + state.tx * 0.25, pose.rz)
    if (bones) {
      FINGERS.forEach((finger) =>
        bones.joints[finger].forEach((joint, j) => {
          tmp.curl.setFromAxisAngle(X_AXIS, -pose[`${finger}${j}`])
          joint.bone.quaternion.copy(joint.rest).multiply(tmp.curl)
        }),
      )
    }
    handRoot.updateMatrixWorld(true)

    // Wearing: 0 = floating beside the hand, 0.6 = lined up above the fingertip, 1 = on the finger.
    const wear = bones ? clamp(state.f / 0.85) : 0
    const spin = reducedMotion ? 0 : t * 0.6
    floatingMatrix(spin * (1 - wear), mFloat)
    if (bones) {
      fingerMatrices(pose.s, mWorn, mHover)
      if (wear < 0.6) blendInto(ring, mFloat, mHover, ease(wear / 0.6))
      else blendInto(ring, mHover, mWorn, ease((wear - 0.6) / 0.4))
    } else {
      mFloat.decompose(ring.position, ring.quaternion, ring.scale)
    }

    centre.material.color.lerpColors(CLEAR_STONE, RUBY_STONE, pose.gem)
    centre.material.metalness = lerp(0.55, 0.2, pose.gem)
    centre.rotation.y = reducedMotion ? 0 : t * 0.5

    // Glint: strongest when the stone's table turns toward the camera during the wrist twist.
    centre.getWorldPosition(stoneWorld)
    stoneNormal.set(0, 1, 0).applyQuaternion(ring.quaternion)
    toCamera.subVectors(camera.position, stoneWorld).normalize()
    const facing = THREE.MathUtils.smoothstep(stoneNormal.dot(toCamera), 0.25, 0.75)
    const pulse = reducedMotion ? 1 : 0.65 + 0.35 * Math.sin(t * 3.2)
    glint.position.copy(stoneWorld).addScaledVector(toCamera, 0.2)
    glint.scale.setScalar(ring.scale.x * 2.6)
    glint.material.opacity = facing * pulse
    glint.material.rotation = reducedMotion ? 0 : t * 0.4

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
      const disposed = new Set()
      scene.traverse((o) => {
        for (const res of [o.geometry, o.material, o.material?.map]) {
          if (res && !disposed.has(res)) {
            disposed.add(res)
            res.dispose()
          }
        }
      })
      scene.environment?.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}

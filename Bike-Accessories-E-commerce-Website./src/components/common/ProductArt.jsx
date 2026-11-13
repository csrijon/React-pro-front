import { useId, memo } from 'react'

/**
 * Vector product renders. Every catalog item uses an `art` type + accent colour, so the store
 * always shows a relevant, crisp image with zero network cost. When your backend supplies real
 * photos, pass `image` to <ProductImage/> and it will take over automatically.
 */
function shade(hex, p) {
  const n = parseInt(hex.slice(1), 16)
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255
  const t = p < 0 ? 0 : 255, k = Math.abs(p)
  r = Math.round((t - r) * k + r); g = Math.round((t - g) * k + g); b = Math.round((t - b) * k + b)
  return `rgb(${r},${g},${b})`
}

const VARIANTS = [
  '',
  'translate(200 205) rotate(-9) scale(.92) translate(-200 -200)',
  'translate(200 200) scale(1.75) translate(-200 -200)',
  'translate(400 0) scale(-1 1)',
]

function Defs({ id, c }) {
  return (
    <defs>
      <radialGradient id={`${id}-bg`} cx="50%" cy="45%" r="65%">
        <stop offset="0" stopColor={c} stopOpacity=".28" />
        <stop offset="1" stopColor={c} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-dark`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3a404a" />
        <stop offset=".5" stopColor="#1b1e24" />
        <stop offset="1" stopColor="#0c0e11" />
      </linearGradient>
      <linearGradient id={`${id}-acc`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={shade(c, 0.25)} />
        <stop offset="1" stopColor={shade(c, -0.35)} />
      </linearGradient>
      <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f2f4f7" />
        <stop offset=".35" stopColor="#9aa3ae" />
        <stop offset=".6" stopColor="#d7dce2" />
        <stop offset="1" stopColor="#4a515b" />
      </linearGradient>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4a5568" />
        <stop offset=".45" stopColor="#10141a" />
        <stop offset="1" stopColor="#05070a" />
      </linearGradient>
      <radialGradient id={`${id}-lens`} cx="40%" cy="35%" r="70%">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset=".4" stopColor="#ffe9a8" />
        <stop offset="1" stopColor="#d99a1c" />
      </radialGradient>
      <radialGradient id={`${id}-cam`} cx="40%" cy="35%" r="70%">
        <stop offset="0" stopColor="#5b7bd6" />
        <stop offset=".5" stopColor="#14214a" />
        <stop offset="1" stopColor="#05080f" />
      </radialGradient>
    </defs>
  )
}

const Gloss = ({ d, o = 0.14 }) => <path d={d} fill="#fff" opacity={o} />

function Helmet({ id, c }) {
  return (
    <g>
      <ellipse cx="205" cy="338" rx="120" ry="10" fill="#000" opacity=".45" />
      <path d="M88 255C78 150 150 72 240 76C322 80 348 160 336 242C333 286 312 316 272 323L172 323C122 323 96 302 88 255Z" fill={`url(#${id}-dark)`} />
      <path d="M96 175C120 110 175 80 240 80C290 82 326 110 336 160C290 130 190 120 96 175Z" fill={`url(#${id}-acc)`} />
      <path d="M92 215C150 150 250 128 334 196" fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth="5" strokeLinecap="round" />
      <path d="M204 150C262 138 326 150 340 204L338 238C300 224 240 224 192 234C182 206 188 170 204 150Z" fill={`url(#${id}-glass)`} stroke="#6b7280" strokeWidth="2" />
      <path d="M214 160C258 152 306 160 326 190C290 176 244 172 214 180Z" fill="#fff" opacity=".22" />
      <path d="M190 252L336 248L331 292C302 316 250 322 196 320Z" fill="#101215" />
      {[0, 1, 2].map((i) => <rect key={i} x={282 + i * 12} y="262" width="6" height="26" rx="3" fill={c} />)}
      <ellipse cx="148" cy="272" rx="34" ry="30" fill="#0c0e11" />
      <circle cx="148" cy="272" r="10" fill={c} opacity=".9" />
      <path d="M118 320L284 324" stroke="#07080a" strokeWidth="12" strokeLinecap="round" />
      <Gloss d="M120 140C150 96 200 82 236 86C190 96 150 120 120 170Z" o=".28" />
    </g>
  )
}

function Jacket({ id, c, vest }) {
  return (
    <g>
      <ellipse cx="200" cy="352" rx="110" ry="9" fill="#000" opacity=".4" />
      <path d="M150 78L102 100L50 262L96 280L126 196L128 338L272 338L274 196L304 280L350 262L298 100L250 78Q200 118 150 78Z" fill={vest ? `url(#${id}-acc)` : `url(#${id}-dark)`} />
      <path d="M150 78Q200 122 250 78L240 62Q200 92 160 62Z" fill="#0c0e11" />
      {!vest && <>
        <path d="M102 100L150 78L162 138L118 152Z" fill={`url(#${id}-acc)`} />
        <path d="M298 100L250 78L238 138L282 152Z" fill={`url(#${id}-acc)`} />
        <path d="M60 232L106 246L113 222L70 208Z" fill={`url(#${id}-acc)`} />
        <path d="M340 232L294 246L287 222L330 208Z" fill={`url(#${id}-acc)`} />
        <rect x="127" y="188" width="146" height="18" fill={`url(#${id}-acc)`} />
      </>}
      {vest && <>
        <rect x="127" y="170" width="146" height="20" fill="#e6e9ee" opacity=".92" />
        <rect x="127" y="236" width="146" height="20" fill="#e6e9ee" opacity=".92" />
        <rect x="127" y="300" width="146" height="20" fill="#e6e9ee" opacity=".92" />
        <path d="M150 78L168 336M250 78L232 336" stroke="#e6e9ee" strokeWidth="14" opacity=".92" />
      </>}
      <line x1="200" y1="104" x2="200" y2="338" stroke="#07080a" strokeWidth="6" />
      <line x1="200" y1="104" x2="200" y2="338" stroke="#a6adb6" strokeWidth="2.5" strokeDasharray="2 5" />
      <rect x="138" y="262" width="46" height="9" rx="4" fill="#07080a" />
      <rect x="216" y="262" width="46" height="9" rx="4" fill="#07080a" />
      <Gloss d="M110 110L148 92L158 130L122 142Z" o=".2" />
    </g>
  )
}

function Glove({ id, c, x, y, r, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <rect x="-34" y="24" width="28" height="70" rx="14" transform="rotate(32 -20 58)" fill={`url(#${id}-dark)`} />
      {[[0, -82, 26, 90], [28, -102, 26, 110], [56, -94, 26, 102], [84, -72, 24, 80]].map(([fx, fy, w, h], i) => (
        <rect key={i} x={fx} y={fy} width={w} height={h} rx="12" fill={`url(#${id}-dark)`} stroke="#07080a" strokeWidth="1.5" />
      ))}
      <path d="M-2 0H110V92Q110 132 80 142H26Q-2 132 -2 92Z" fill={`url(#${id}-dark)`} />
      <rect x="0" y="-8" width="108" height="26" rx="10" fill={`url(#${id}-acc)`} />
      {[14, 42, 70, 94].map((px, i) => <circle key={i} cx={px} cy="5" r="4" fill="#07080a" opacity=".5" />)}
      <rect x="12" y="132" width="86" height="58" rx="10" fill="#0c0e11" />
      <rect x="12" y="150" width="86" height="12" fill={c} />
      <rect x="30" y="100" width="48" height="10" rx="5" fill={c} opacity=".85" />
    </g>
  )
}
const Gloves = (p) => (
  <g>
    <Glove {...p} x={112} y={162} r={-9} />
    <Glove {...p} x={232} y={176} r={8} s={0.96} />
  </g>
)

function Boots({ id, c }) {
  return (
    <g>
      <ellipse cx="235" cy="352" rx="130" ry="9" fill="#000" opacity=".45" />
      <path d="M140 56L246 56L254 214C304 224 344 246 348 288L348 318L122 318L128 214Z" fill={`url(#${id}-dark)`} />
      <rect x="112" y="316" width="244" height="26" rx="10" fill="#08090b" />
      <path d="M300 232C332 240 346 258 348 290L348 316L276 316C280 280 290 250 300 232Z" fill={`url(#${id}-acc)`} />
      <rect x="132" y="100" width="116" height="20" fill={`url(#${id}-acc)`} />
      <rect x="132" y="150" width="120" height="16" rx="4" fill="#0c0e11" />
      <rect x="226" y="146" width="22" height="24" rx="4" fill="#cdd2d9" />
      <rect x="132" y="190" width="122" height="16" rx="4" fill="#0c0e11" />
      <rect x="226" y="186" width="22" height="24" rx="4" fill="#cdd2d9" />
      <path d="M142 70L160 300" stroke="#fff" strokeOpacity=".1" strokeWidth="12" />
      <rect x="136" y="56" width="114" height="18" rx="6" fill="#0c0e11" />
    </g>
  )
}

function Cover({ id, c }) {
  return (
    <g>
      <ellipse cx="205" cy="346" rx="160" ry="9" fill="#000" opacity=".4" />
      {[105, 300].map((x) => (
        <g key={x}><circle cx={x} cy="300" r="46" fill="#0a0b0d" stroke="#2b2f36" strokeWidth="5" /><circle cx={x} cy="300" r="22" fill="#2b2f36" /></g>
      ))}
      <path d="M52 296C44 204 100 162 160 148C186 108 252 98 288 128C334 150 356 222 352 296Q200 318 52 296Z" fill={`url(#${id}-dark)`} />
      <path d="M52 296Q200 318 352 296" fill="none" stroke={c} strokeWidth="7" />
      <path d="M130 170C150 220 150 260 140 300M200 140C214 200 214 260 206 308M270 140C280 200 290 250 288 304" fill="none" stroke="#000" strokeOpacity=".35" strokeWidth="4" />
      <path d="M170 130C230 100 276 112 290 140" fill="none" stroke="#fff" strokeOpacity=".16" strokeWidth="8" strokeLinecap="round" />
      <rect x="150" y="214" width="96" height="30" rx="6" fill="#0c0e11" opacity=".6" />
      <text x="198" y="236" textAnchor="middle" fontFamily="Poppins,sans-serif" fontWeight="700" fontStyle="italic" fontSize="20" fill={c}>MotoGear</text>
    </g>
  )
}

function TopBox({ id, c }) {
  return (
    <g>
      <ellipse cx="200" cy="336" rx="140" ry="9" fill="#000" opacity=".45" />
      <rect x="120" y="296" width="160" height="22" rx="8" fill="#0a0b0d" />
      <rect x="62" y="130" width="276" height="170" rx="38" fill={`url(#${id}-dark)`} />
      <path d="M62 196H338" stroke="#000" strokeOpacity=".6" strokeWidth="5" />
      <path d="M90 150C140 126 260 126 310 150" fill="none" stroke="#fff" strokeOpacity=".18" strokeWidth="7" strokeLinecap="round" />
      <rect x="168" y="214" width="64" height="38" rx="10" fill="#07080a" />
      <circle cx="200" cy="233" r="9" fill={c} />
      <rect x="296" y="178" width="30" height="66" rx="10" fill={`url(#${id}-acc)`} />
      <rect x="74" y="178" width="30" height="66" rx="10" fill={`url(#${id}-acc)`} opacity=".6" />
      <path d="M150 130C150 104 250 104 250 130" fill="none" stroke="#0c0e11" strokeWidth="12" strokeLinecap="round" />
    </g>
  )
}

function Bottles({ id, c }) {
  const Label = ({ x, y, w, h }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={`url(#${id}-acc)`} />
      <rect x={x + 10} y={y + 14} width={w - 20} height="7" rx="3" fill="#fff" opacity=".9" />
      <rect x={x + 10} y={y + 28} width={(w - 20) * 0.6} height="6" rx="3" fill="#fff" opacity=".6" />
      <circle cx={x + w / 2} cy={y + h - 22} r="10" fill="#fff" opacity=".85" />
    </g>
  )
  return (
    <g>
      <ellipse cx="200" cy="346" rx="160" ry="9" fill="#000" opacity=".45" />
      <rect x="86" y="150" width="30" height="34" fill="#0c0e11" />
      <rect x="70" y="116" width="62" height="40" rx="10" fill={`url(#${id}-acc)`} />
      <rect x="132" y="126" width="22" height="12" rx="4" fill="#0c0e11" />
      <rect x="58" y="180" width="86" height="162" rx="20" fill={`url(#${id}-dark)`} />
      <Label x={66} y={214} w={70} h={100} />
      <rect x="160" y="100" width="82" height="32" rx="8" fill="#0c0e11" />
      <rect x="156" y="128" width="90" height="214" rx="16" fill={`url(#${id}-dark)`} />
      <Label x={166} y={170} w={70} h={130} />
      <rect x="284" y="164" width="52" height="34" rx="8" fill={`url(#${id}-acc)`} />
      <rect x="264" y="194" width="92" height="148" rx="18" fill={`url(#${id}-dark)`} />
      <Label x={272} y={226} w={76} h={90} />
      <path d="M72 200V320M172 142V320M278 210V324" stroke="#fff" strokeOpacity=".13" strokeWidth="6" strokeLinecap="round" />
    </g>
  )
}

function Camera({ id, c }) {
  return (
    <g>
      <ellipse cx="200" cy="340" rx="110" ry="9" fill="#000" opacity=".45" />
      <rect x="170" y="268" width="60" height="26" fill="#0c0e11" />
      <rect x="152" y="288" width="96" height="26" rx="8" fill="#171a1f" />
      <rect x="170" y="306" width="60" height="14" fill="#cdd2d9" opacity=".6" />
      <rect x="96" y="112" width="208" height="166" rx="30" fill={`url(#${id}-dark)`} stroke="#4b5260" strokeWidth="1.5" />
      <circle cx="190" cy="196" r="58" fill="#07080a" />
      <circle cx="190" cy="196" r="52" fill="none" stroke={c} strokeWidth="5" />
      <circle cx="190" cy="196" r="40" fill={`url(#${id}-cam)`} />
      <circle cx="176" cy="182" r="9" fill="#fff" opacity=".55" />
      <rect x="248" y="128" width="42" height="30" rx="5" fill="#0a1a2e" stroke="#4b5260" />
      <rect x="254" y="136" width="30" height="5" rx="2" fill="#6fa8ff" opacity=".8" />
      <circle cx="116" cy="132" r="6" fill={c} />
      <rect x="252" y="232" width="34" height="14" rx="7" fill="#07080a" />
      <text x="196" y="270" fontFamily="Poppins,sans-serif" fontSize="12" fontWeight="700" fill="#8b929c" textAnchor="middle" letterSpacing="3">4K PRO</text>
    </g>
  )
}

function Led({ id, c }) {
  const Light = ({ x, y, r }) => (
    <g>
      {[-1, 0, 1].map((i) => <rect key={i} x={x - r * 0.5 + i * (r * 0.5)} y={y - r - 22} width={r * 0.3} height="34" rx="4" fill="#1b1e24" />)}
      <circle cx={x} cy={y} r={r + 14} fill={`url(#${id}-dark)`} />
      <circle cx={x} cy={y} r={r + 4} fill="#07080a" stroke="#6b7280" strokeWidth="3" />
      <circle cx={x} cy={y} r={r - 4} fill={`url(#${id}-lens)`} />
      <circle cx={x} cy={y} r={r * 0.55} fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="3" />
      <circle cx={x} cy={y} r={r * 0.22} fill="#fff" />
      <circle cx={x} cy={y} r={r + 14} fill="none" stroke={c} strokeOpacity=".7" strokeWidth="2" />
    </g>
  )
  return (
    <g>
      <ellipse cx="200" cy="330" rx="150" ry="9" fill="#000" opacity=".45" />
      <circle cx="200" cy="205" r="150" fill="#ffd66b" opacity=".07" />
      <Light x={125} y={210} r={66} />
      <Light x={285} y={210} r={66} />
    </g>
  )
}

function Mount({ id, c }) {
  return (
    <g>
      <rect x="30" y="302" width="340" height="28" rx="14" fill={`url(#${id}-steel)`} />
      <rect x="174" y="268" width="52" height="42" rx="8" fill="#0c0e11" />
      <rect x="130" y="60" width="140" height="222" rx="24" fill="#06070a" stroke="#4b5260" strokeWidth="3" />
      <rect x="140" y="72" width="120" height="198" rx="14" fill={`url(#${id}-acc)`} />
      <rect x="154" y="92" width="60" height="9" rx="4" fill="#fff" opacity=".85" />
      <rect x="154" y="110" width="92" height="6" rx="3" fill="#fff" opacity=".5" />
      <circle cx="200" cy="190" r="34" fill="#07080a" opacity=".35" />
      <path d="M186 196l10 10 20-24" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {[[122, 52], [250, 52], [122, 262], [250, 262]].map(([x, y], i) => <rect key={i} x={x} y={y} width="28" height="20" rx="6" fill="#0c0e11" />)}
      <path d="M270 150C330 150 340 230 300 300" fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" />
    </g>
  )
}

function Exhaust({ id, c }) {
  return (
    <g>
      <ellipse cx="205" cy="330" rx="150" ry="9" fill="#000" opacity=".4" />
      <g transform="rotate(-16 200 200)">
        <rect x="52" y="160" width="26" height="86" rx="6" fill="#16191e" />
        <rect x="70" y="172" width="252" height="62" rx="31" fill={`url(#${id}-steel)`} />
        <rect x="110" y="170" width="14" height="66" fill={`url(#${id}-acc)`} />
        <rect x="244" y="170" width="14" height="66" fill={`url(#${id}-acc)`} />
        <path d="M130 184H240" stroke="#fff" strokeOpacity=".5" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="322" cy="203" rx="16" ry="31" fill="#0a0b0d" />
        <ellipse cx="322" cy="203" rx="9" ry="20" fill="#000" stroke="#4b5260" strokeWidth="2" />
        <rect x="176" y="232" width="28" height="30" fill="#16191e" />
      </g>
    </g>
  )
}

function Filter({ id, c }) {
  return (
    <g>
      <ellipse cx="200" cy="330" rx="150" ry="12" fill="#000" opacity=".45" />
      <ellipse cx="200" cy="268" rx="134" ry="46" fill="#0c0e11" />
      <rect x="66" y="150" width="268" height="118" fill={`url(#${id}-acc)`} />
      {Array.from({ length: 17 }, (_, i) => <line key={i} x1={78 + i * 16} y1="152" x2={78 + i * 16} y2="268" stroke="#000" strokeOpacity=".35" strokeWidth="3" />)}
      <ellipse cx="200" cy="268" rx="134" ry="46" fill="none" stroke="#0c0e11" strokeWidth="14" />
      <ellipse cx="200" cy="150" rx="134" ry="46" fill={`url(#${id}-dark)`} />
      <ellipse cx="200" cy="150" rx="82" ry="26" fill="#050608" />
      <ellipse cx="200" cy="146" rx="82" ry="22" fill="none" stroke="#fff" strokeOpacity=".15" strokeWidth="3" />
    </g>
  )
}

function Sprocket({ id, c }) {
  const teeth = 30
  const pts = []
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2, a1 = ((i + 0.5) / teeth) * Math.PI * 2
    const f = (a, r) => `${(200 + Math.cos(a) * r).toFixed(1)},${(200 + Math.sin(a) * r).toFixed(1)}`
    pts.push(f(a0, 108), f(a0 + 0.02, 124), f(a1 - 0.02, 124), f(a1, 108))
  }
  return (
    <g>
      <ellipse cx="200" cy="338" rx="130" ry="9" fill="#000" opacity=".4" />
      <polygon points={pts.join(' ')} fill={`url(#${id}-acc)`} stroke="#000" strokeOpacity=".4" />
      <circle cx="200" cy="200" r="94" fill="none" stroke="#fff" strokeOpacity=".2" strokeWidth="3" />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2
        return <circle key={i} cx={200 + Math.cos(a) * 62} cy={200 + Math.sin(a) * 62} r="20" fill="#0c0e11" />
      })}
      <circle cx="200" cy="200" r="30" fill="#0c0e11" stroke="#fff" strokeOpacity=".3" strokeWidth="3" />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + 0.52
        return <circle key={i} cx={200 + Math.cos(a) * 46} cy={200 + Math.sin(a) * 46} r="4" fill="#d7dce2" />
      })}
    </g>
  )
}

function Lock({ id, c }) {
  return (
    <g>
      <ellipse cx="200" cy="344" rx="120" ry="9" fill="#000" opacity=".4" />
      <circle cx="170" cy="200" r="122" fill={`url(#${id}-steel)`} />
      <circle cx="170" cy="200" r="64" fill="#101215" />
      <circle cx="170" cy="200" r="22" fill="#2b2f36" />
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2
        return <circle key={i} cx={170 + Math.cos(a) * 92} cy={200 + Math.sin(a) * 92} r="9" fill="#101215" />
      })}
      <path d="M256 196V150a30 30 0 0 1 60 0V196" fill="none" stroke="#e5e8ec" strokeWidth="14" strokeLinecap="round" />
      <rect x="236" y="190" width="100" height="92" rx="20" fill={`url(#${id}-acc)`} />
      <circle cx="286" cy="226" r="11" fill="#07080a" />
      <rect x="282" y="228" width="8" height="26" rx="3" fill="#07080a" />
      <circle cx="318" cy="204" r="4" fill="#fff" opacity=".7" />
    </g>
  )
}

function Guard({ id, c }) {
  return (
    <g>
      <ellipse cx="200" cy="346" rx="120" ry="9" fill="#000" opacity=".4" />
      <rect x="40" y="168" width="320" height="34" rx="17" fill="#0c0e11" />
      <rect x="40" y="248" width="320" height="34" rx="17" fill="#0c0e11" />
      <path d="M90 98Q200 54 310 98Q340 200 286 306Q200 346 114 306Q60 200 90 98Z" fill={`url(#${id}-dark)`} stroke="#4b5260" strokeWidth="2" />
      <path d="M118 122Q200 90 282 122Q304 200 262 280Q200 306 138 280Q96 200 118 122Z" fill={`url(#${id}-acc)`} />
      {[[200, 150], [160, 180], [240, 180], [200, 210], [160, 240], [240, 240]].map(([x, y], i) => (
        <polygon key={i} points={`${x},${y - 20} ${x + 18},${y - 10} ${x + 18},${y + 10} ${x},${y + 20} ${x - 18},${y + 10} ${x - 18},${y - 10}`} fill="none" stroke="#000" strokeOpacity=".35" strokeWidth="3" />
      ))}
      <path d="M126 130Q170 106 220 112" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="6" strokeLinecap="round" />
    </g>
  )
}

const ART = {
  helmet: Helmet, jacket: Jacket, vest: (p) => <Jacket {...p} vest />, gloves: Gloves, boots: Boots, cover: Cover,
  topbox: TopBox, bottles: Bottles, camera: Camera, led: Led, mount: Mount, exhaust: Exhaust, filter: Filter,
  sprocket: Sprocket, lock: Lock, guard: Guard,
}

function ProductArt({ type = 'helmet', color = '#EF252B', variant = 0, className = '' }) {
  const id = useId().replace(/:/g, '')
  const Art = ART[type] || Helmet
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label={`${type} product illustration`} preserveAspectRatio="xMidYMid meet">
      <Defs id={id} c={color} />
      <rect width="400" height="400" fill="#13161b" />
      <rect width="400" height="400" fill={`url(#${id}-bg)`} />
      {variant === 3 && <rect width="400" height="400" fill={color} opacity=".07" />}
      <g transform={VARIANTS[variant] || ''}>
        <Art id={id} c={color} />
      </g>
    </svg>
  )
}

export default memo(ProductArt)

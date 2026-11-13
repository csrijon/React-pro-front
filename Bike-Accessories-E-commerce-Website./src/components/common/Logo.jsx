import { Link } from 'react-router-dom'

export function LogoMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#EF252B" />
      <path d="M13 38c0-13 9-22 21-22 9 0 16 5 19 12-6-3-14-4-22 0-8 4-12 9-14 14-2-1-4-2-4-4z" fill="#fff" />
      <path d="M21 47c6-8 16-12 29-10 0 8-6 13-15 13-6 0-11-1-14-3z" fill="#0B0D10" opacity=".85" />
    </svg>
  )
}

export default function Logo({ size = 'md', to = '/', asLink = false }) {
  const text = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-xl'
  const mark = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-6 w-6' : 'h-9 w-9'
  const inner = (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark className={mark} />
      <span className={`font-display font-extrabold italic tracking-tight text-white ${text}`}>
        Moto<span className="text-white">Gear</span>
      </span>
    </span>
  )
  return asLink ? (
    <Link to={to} aria-label="MotoGear home">
      {inner}
    </Link>
  ) : (
    inner
  )
}

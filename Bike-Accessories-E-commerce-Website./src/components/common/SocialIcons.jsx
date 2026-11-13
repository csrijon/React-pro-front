// Brand glyphs (lucide-react v1 no longer ships brand icons)
const base = { viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true }

export const YoutubeIcon = (p) => (
  <svg {...base} {...p}><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.2ZM9.8 15.1V8.9l5.4 3.1-5.4 3.1Z" /></svg>
)
export const InstagramIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
  </svg>
)
export const FacebookIcon = (p) => (
  <svg {...base} {...p}><path d="M13.500 21v-8.200h2.800l.4-3.300h-3.200V7.400c0-.9.300-1.600 1.600-1.600h1.700V2.900A22 22 0 0 0 14.400 2.800c-2.400 0-4.100 1.500-4.100 4.200v2.500H7.500v3.300h2.800V21Z" /></svg>
)
export const XIcon = (p) => (
  <svg {...base} {...p}><path d="M17.800 3h3.100l-6.800 7.700L22 21h-6.200l-4.900-6.400L5.300 21H2.200l7.300-8.300L2 3h6.400l4.400 5.800ZM16.700 19.200h1.700L7.400 4.700H5.600Z" /></svg>
)
export const LinkedinIcon = (p) => (
  <svg {...base} {...p}><path d="M4.900 3.200a2.100 2.100 0 1 0 0 4.200 2.100 2.100 0 0 0 0-4.200ZM3 8.900h3.800V21H3ZM9.200 8.900h3.600v1.700h.1a4 4 0 0 1 3.600-2c3.800 0 4.500 2.500 4.500 5.700V21h-3.800v-5.800c0-1.400 0-3.100-1.900-3.100s-2.200 1.500-2.200 3V21H9.200Z" /></svg>
)

export const socials = [
  { label: 'YouTube', href: 'https://youtube.com', Icon: YoutubeIcon },
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
  { label: 'X (Twitter)', href: 'https://x.com', Icon: XIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedinIcon },
]

export function SocialLinks({ className = '', itemClass = 'h-10 w-10' }) {
  return (
    <div className={`flex flex-wrap gap-2.5 ${className}`}>
      {socials.map(({ label, href, Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
          className={`flex items-center justify-center rounded-lg border border-line bg-ink-800 text-white/85 transition hover:border-brand hover:bg-brand-solid hover:text-white ${itemClass}`}>
          <Icon className="h-[18px] w-[18px]" />
        </a>
      ))}
    </div>
  )
}

const styles = {
  italic: 'italic font-extrabold tracking-tight',
  bold: 'font-black uppercase tracking-wider',
  wide: 'font-bold uppercase tracking-[0.25em]',
}

/** Typographic brand logo (placeholder for real logo images). */
export default function BrandMark({ brand, className = 'text-xl' }) {
  return <span className={`font-display ${styles[brand.style] || styles.bold} ${className}`}>{brand.name}</span>
}

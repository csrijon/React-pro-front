export default function Field({ label, error, children, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      {children}
      {error && <p className="field-error" role="alert">{error.message || error}</p>}
    </div>
  )
}

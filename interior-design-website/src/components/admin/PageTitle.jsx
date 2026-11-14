export default function PageTitle({ title, text, children }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div><h1 className="font-sans text-2xl font-semibold text-cream tracking-normal">{title}</h1>{text && <p className="text-sm text-cream/50 mt-1">{text}</p>}</div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

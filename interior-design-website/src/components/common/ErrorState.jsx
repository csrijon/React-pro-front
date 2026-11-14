export default function ErrorState({ error, onRetry, dark = false }) {
  return (
    <div className={`py-14 text-center ${dark ? 'text-cream/70' : 'text-charcoal/70'}`} role="alert">
      <p className="font-semibold">{error?.message || 'Could not load this content.'}</p>
      {onRetry && <button onClick={onRetry} className={dark ? 'a-btn a-btn-ghost mt-4' : 'btn btn-outline mt-4'}>Try again</button>}
    </div>
  );
}

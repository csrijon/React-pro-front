import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', text, action, dark = false, icon: Icon = Inbox }) {
  return (
    <div className={`flex flex-col items-center text-center py-16 px-6 ${dark ? 'text-cream/70' : 'text-charcoal/70'}`}>
      <Icon size={34} strokeWidth={1.2} className={dark ? 'text-sage' : 'text-forest'} />
      <h3 className={`mt-4 text-2xl ${dark ? 'font-sans font-semibold text-lg text-cream' : 'font-display'}`}>{title}</h3>
      {text && <p className="mt-1.5 max-w-sm text-sm">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

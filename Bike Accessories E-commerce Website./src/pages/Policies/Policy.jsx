import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import { ErrorState } from '../../components/common/States'
import { Skeleton } from '../../components/common/Skeletons'
import useFetch from '../../hooks/useFetch'
import usePageTitle from '../../hooks/usePageTitle'
import contentService from '../../services/contentService'
import { slugify } from '../../utils/format'

const OTHERS = [['shipping-policy', 'Shipping Policy'], ['return-policy', 'Return & Refund Policy'], ['privacy-policy', 'Privacy Policy'], ['terms', 'Terms & Conditions'], ['faq', 'FAQs']]

/** Shared template for Shipping, Return, Privacy and Terms pages (content comes from the service layer). */
export default function Policy({ slug }) {
  const { data, loading, error, reload } = useFetch(() => contentService.policy(slug), [slug])
  usePageTitle(data?.title)

  return (
    <div className="container-x py-8 sm:py-12">
      <Breadcrumbs className="mb-6" items={[{ label: data?.title || 'Policy' }]} />
      {loading ? <div className="space-y-4"><Skeleton className="h-12 w-1/2" /><Skeleton className="h-64" /></div>
        : error ? <ErrorState message={error.message} onRetry={reload} />
        : (
          <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-line bg-ink-800 p-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">On this page</p>
                <ol className="space-y-1 text-sm">
                  {data.sections.map(([t], i) => <li key={t}><a href={`#${slugify(t)}`} className="flex gap-2 rounded-lg px-2 py-1.5 text-white/80 transition hover:bg-ink-700 hover:text-brand"><span className="text-brand">{String(i + 1).padStart(2, '0')}</span>{t}</a></li>)}
                </ol>
              </div>
              <div className="mt-4 rounded-2xl border border-line bg-ink-800 p-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Related policies</p>
                <ul className="space-y-1 text-sm">{OTHERS.filter(([s]) => s !== slug).map(([s, l]) => <li key={s}><Link to={`/${s}`} className="block rounded-lg px-2 py-1.5 text-white/80 transition hover:bg-ink-700 hover:text-brand">{l}</Link></li>)}</ul>
              </div>
            </aside>
            <article className="min-w-0">
              <header className="mb-8 border-b border-line pb-6"><h1 className="font-display text-4xl font-extrabold sm:text-5xl">{data.title}</h1><p className="mt-2 text-sm text-muted">Last updated: {data.updated}</p></header>
              <div className="space-y-6">
                {data.sections.map(([t, body], i) => (
                  <section key={t} id={slugify(t)} className="scroll-mt-24 rounded-2xl border border-line bg-ink-800 p-6">
                    <h2 className="mb-2 flex items-center gap-3 text-xl font-bold"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-sm text-brand">{i + 1}</span>{t}</h2>
                    <p className="leading-relaxed text-muted">{body}</p>
                  </section>
                ))}
              </div>
              <p className="mt-8 text-sm text-muted">Questions about this policy? <Link to="/contact" className="font-semibold text-brand hover:underline">Contact our support team</Link>.</p>
            </article>
          </div>
        )}
    </div>
  )
}

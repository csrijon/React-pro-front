import { Mail } from 'lucide-react'
import NewsletterForm from '../forms/NewsletterForm'
import SmartImage from '../common/SmartImage'

export default function NewsletterBand() {
  return (
    <section className="container-x pb-4 pt-6">
      <div className="relative isolate overflow-hidden rounded-3xl border border-line">
        <SmartImage photoKey="harley" w={1400} sizes="(min-width: 1320px) 1320px, 100vw" className="absolute inset-0 -z-10 h-full w-full" alt="" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/60" />
        <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-solid"><Mail size={22} /></span>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Join the Ride Club</h2>
            <p className="mt-2 max-w-md text-muted">Get early access to sales, new arrivals and expert riding tips straight to your inbox.</p>
          </div>
          <div><NewsletterForm /><p className="mt-3 text-xs text-muted">No spam. Unsubscribe anytime.</p></div>
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { useSite } from '../../context/SiteContext'
import { Link, Navigate } from 'react-router-dom'
import { CheckCircle2, ShieldCheck, Camera, BadgeCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useSEO } from '../../utils/seo'
import { useAuth } from '../../context/AuthContext'
import { submissionService } from '../../services/submissionService'
import PropertyForm from '../../components/forms/PropertyForm'
import PageHeader from '../../components/common/PageHeader'


export default function ListProperty() {
  const { site, tx } = useSite()
  useSEO('List Your Property', `Submit your property to ${site.company}. Our team reviews it and publishes it on the website.`)
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)
  const [ref, setRef] = useState(null)
  if (!user) return <Navigate to="/login" state={{ from: '/list-property', notice: 'Log in or create an account to submit your property.' }} replace />
  const submit = async (d) => {
    setBusy(true)
    try { const r = await submissionService.submit(d); setRef(r.reference); window.scrollTo(0, 0) }
    catch (e) { toast.error(e.message || 'We could not submit your property. Please try again.') } finally { setBusy(false) }
  }
  if (ref) return (
    <div className="container-x py-20"><div className="card mx-auto max-w-lg p-10 text-center">
      <CheckCircle2 size={52} className="mx-auto text-accent" /><h1 className="mt-4 text-2xl font-semibold">Submitted for review</h1>
      <p className="mt-2 text-muted">Your property is not live yet. Our team will check it and, if approved, publish it on {site.company}. We'll email you either way. Reference: <strong className="text-ink">{ref}</strong></p>
      <div className="mt-6 flex flex-wrap justify-center gap-3"><Link to="/account?tab=submissions" className="btn-primary">Track my submissions</Link><button className="btn-outline" onClick={() => setRef(null)}>Submit another</button></div>
    </div></div>
  )
  return (
    <>
      <PageHeader title={tx(site.pages.listProperty.title)} subtitle={tx(site.pages.listProperty.subtitle)} />
      <div className="container-x max-w-3xl py-8">
        <ol className="mb-6 grid gap-3 sm:grid-cols-3">{[[Camera, 'Fill in the details and add photos'], [ShieldCheck, 'Our team reviews your submission'], [BadgeCheck, `Approved listings are published under ${site.company}`]].map(([I, t], i) => <li key={t} className="card flex items-center gap-3 p-4 text-sm"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-50 text-primary"><I size={17} /></span><span><span className="text-xs text-muted">Step {i + 1}</span><br />{t}</span></li>)}</ol>
        {site.pages.listProperty.privacy && <p className="mb-6 rounded-xl bg-primary-50 p-4 text-sm text-primary">{tx(site.pages.listProperty.privacy)}</p>}
        <PropertyForm onSubmit={submit} submitLabel="Submit for review" busy={busy} defaultValues={{ ownerName: user.name, email: user.email, phone: user.phone || '' }} />
      </div>
    </>
  )
}

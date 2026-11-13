import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSEO } from '../../utils/seo'
import { propertyService } from '../../services/propertyService'
import PropertyForm from '../../components/forms/PropertyForm'
import PageHeader from '../../components/common/PageHeader'

export default function ListProperty() {
  useSEO('List Your Property', 'Submit your property to EstateHub and reach verified buyers and tenants.')
  const [busy, setBusy] = useState(false)
  const [ref, setRef] = useState(null)
  const submit = async (d) => {
    setBusy(true)
    try { const r = await propertyService.submitListing(d); setRef(r.reference); window.scrollTo(0, 0) }
    catch (e) { toast.error(e.message || 'We could not submit your property. Please try again.') } finally { setBusy(false) }
  }
  if (ref) return (
    <div className="container-x py-20"><div className="card mx-auto max-w-lg p-10 text-center">
      <CheckCircle2 size={52} className="mx-auto text-accent" /><h1 className="mt-4 text-2xl font-semibold">Property submitted</h1>
      <p className="mt-2 text-muted">Our team will verify your details and contact you within two business days. Reference: <strong className="text-ink">{ref}</strong></p>
      <div className="mt-6 flex justify-center gap-3"><Link to="/" className="btn-outline">Go home</Link><button className="btn-primary" onClick={() => setRef(null)}>List another</button></div>
    </div></div>
  )
  return (
    <>
      <PageHeader title="List your property" subtitle="Tell us about your property. Listings are reviewed before they go live." />
      <div className="container-x max-w-3xl py-8"><PropertyForm onSubmit={submit} submitLabel="Submit property" busy={busy} /></div>
    </>
  )
}

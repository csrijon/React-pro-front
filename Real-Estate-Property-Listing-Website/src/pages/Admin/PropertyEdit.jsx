import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAsync } from '../../hooks/useAsync'
import { propertyService } from '../../services/propertyService'
import { agentService } from '../../services/agentService'
import PropertyForm from '../../components/forms/PropertyForm'
import { AdminHeader } from '../../components/admin/AdminUI'
import { PageLoader, ErrorState, EmptyState } from '../../components/common/States'

export default function PropertyEdit() {
  const { id } = useParams(); const nav = useNavigate()
  const edit = !!id
  const [busy, setBusy] = useState(false)
  const { data, loading, error, reload } = useAsync(() => Promise.all([edit ? propertyService.get(id) : null, agentService.list()]), [id])
  if (loading) return <PageLoader />
  if (error) return <ErrorState error={error} onRetry={reload} />
  const [prop, agents] = data
  if (edit && !prop) return <EmptyState title="Property not found" />
  const submit = async (d) => {
    setBusy(true)
    try {
      const body = { ...d, price: +d.price, area: +d.area, beds: +d.beds, baths: +d.baths, parking: +(d.parking ?? 0) }
      edit ? await propertyService.update(id, body) : await propertyService.create(body)
      toast.success(edit ? 'Property updated' : 'Property added'); nav('/admin/properties')
    } catch (e) { toast.error(e.message || 'Could not save the property.') } finally { setBusy(false) }
  }
  return (
    <>
      <AdminHeader title={edit ? 'Edit property' : 'Add property'} />
      <div className="max-w-3xl"><PropertyForm mode="admin" agents={agents} defaultValues={prop || undefined} onSubmit={submit} submitLabel={edit ? 'Save changes' : 'Add property'} busy={busy} /></div>
    </>
  )
}

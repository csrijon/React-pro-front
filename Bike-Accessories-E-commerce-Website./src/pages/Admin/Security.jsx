import { PageTitle } from './ui'
import TwoFactorPanel from '../../components/forms/TwoFactorPanel'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import toast from 'react-hot-toast'

export default function Security() {
  const { adoptSession } = useAuth()
  return (
    <>
      <PageTitle title="Security" text="Protect the admin account." />
      <div className="max-w-2xl space-y-6">
        <TwoFactorPanel mandatory />
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-ink-800 p-5">
          <div><h3 className="font-bold">Sign out of all other devices</h3><p className="text-sm text-muted">Ends every other admin session immediately.</p></div>
          <button className="btn-ghost" onClick={async () => { try { adoptSession(await authService.logoutAll()); toast.success('Other sessions ended') } catch (e) { toast.error(e.message) } }}>Sign out everywhere</button>
        </div>
      </div>
    </>
  )
}
